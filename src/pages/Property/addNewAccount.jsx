import { useGlobalContext } from "@/context/GlobalContext";
import { addDoc, updateDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/Button/index";
import { getFirestoreRefs } from "../../firebase/api";

export default function AddNewFunction({
  account_type,
  bgColor,
  setIsAddNewOpen,
  setAlertMessage,
}) {
  const [addProperty, setAddProperty] = useState(false);
  const { loginEmail } = useGlobalContext();
  const { propertyCollectionRef } = getFirestoreRefs(loginEmail);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      account: "",
    },
  });

  const handleAddProperty = () => {
    setAddProperty(true);
    setIsAddNewOpen(true);
  };

  const handleCloseButton = () => {
    setAddProperty(false);
    setIsAddNewOpen(false);
    reset();
  };
  const onSubmit = async (data) => {
    try {
      setIsAddNewOpen(false);
      reset();
      setAddProperty(false);

      const docRef = await addDoc(propertyCollectionRef, {
        account: data.account,
        account_type: account_type,
        balance: Number(data.balance),
      });
      await updateDoc(docRef, {
        id: docRef.id,
      });

      console.log("Document written with ID: ", docRef.id);
      setAlertMessage("新增成功");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  AddNewFunction.propTypes = {
    account_type: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    setIsAddNewOpen: PropTypes.func.isRequired,
    setAlertMessage: PropTypes.func.isRequired,
  };
  return (
    <>
      <Button
        variant={`${bgColor}`}
        className={`sticky bottom-0 right-0 w-full`}
      >
        <p
          onClick={handleAddProperty}
          className="flex items-center justify-center rounded-2xl"
        >
          新增{account_type}帳戶
        </p>

        {addProperty && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 text-black fade-in`}
            >
              <div className="relative flex w-[90%] max-w-lg flex-col gap-3 rounded-lg bg-white p-8 opacity-100">
                <Button
                  className="absolute right-3 top-3 mr-2"
                  onClick={handleCloseButton}
                >
                  取消
                </Button>
                <div className="flex items-center gap-3">
                  <div className="font-semibold">帳戶名稱</div>
                  <input
                    className="rounded-lg border border-gray-300 px-4 py-2"
                    type="text"
                    placeholder="帳戶名稱"
                    // maxLength={10}
                    {...register("account", {
                      required: "請輸入帳戶名稱",
                      maxLength: {
                        value: 10,
                        message: "名稱須小於 10 個字",
                      },
                    })}
                  />
                  {errors.account && (
                    <p className="text-red-500">{errors.account.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="font-semibold">初始金額</div>
                  <input
                    className="rounded-lg border border-gray-300 px-4 py-2"
                    type="number"
                    placeholder="初始金額"
                    {...register("balance", {
                      required: "請輸入初始金額",
                      valueAsNumber: true,
                      max: {
                        value: 100000000000,
                        message: "須小於一千億",
                      },
                      validate: (value) => !isNaN(value) || "請輸入有效的數字",
                    })}
                  />
                  {errors.balance && (
                    <p className="text-red-500">{errors.balance.message}</p>
                  )}
                </div>
                <Button type="submit" variant="add">
                  新增
                </Button>
              </div>
            </div>
          </form>
        )}
      </Button>
    </>
  );
}

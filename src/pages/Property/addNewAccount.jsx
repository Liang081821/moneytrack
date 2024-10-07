import { useState } from "react";
import { getFirestoreRefs } from "../../firebase/api";
import { addDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "@/context/GlobalContext";
import Alert from "@/components/Alert";
import PropTypes from "prop-types";
import Button from "../../components/Button/index";

export default function AddNewFunction({ account_type, bgColor }) {
  const [addProperty, setAddProperty] = useState(false);
  const { loginEmail } = useGlobalContext();
  const { propertyCollectionRef } = getFirestoreRefs(loginEmail);
  const [alertMessage, setAlertMessage] = useState(null);

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
  };

  const handleCloseButton = () => {
    setAddProperty(false);
    reset();
  };
  const onSubmit = async (data) => {
    try {
      reset();

      setAddProperty(false);
      setAlertMessage("新增成功");
      const docRef = await addDoc(propertyCollectionRef, {
        account: data.account,
        account_type: account_type,
        balance: Number(data.balance),
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <>
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
      <Button
        variant={`${bgColor}`}
        className={`absolute right-0 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all md:text-base`}
      >
        <p
          onClick={handleAddProperty}
          className="flex items-center justify-center rounded-2xl"
        >
          新增{account_type}帳戶
        </p>
        <div
          className={`z-50 ${addProperty ? "text-black" : "overflow-hidden"}`}
        >
          {addProperty && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
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
                      {...register("account", { required: "請輸入帳戶名稱" })}
                    />
                    {errors.account && (
                      <p className="text-red-500">{errors.account.message}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="font-semibold">初始金額</div>
                    <input
                      className="rounded-lg border border-gray-300 px-4 py-2"
                      type="text"
                      placeholder="初始金額"
                      {...register("balance", {
                        required: "請輸入初始金額",
                        valueAsNumber: true,
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
        </div>
      </Button>
    </>
  );
}
AddNewFunction.propTypes = {
  account_type: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
};

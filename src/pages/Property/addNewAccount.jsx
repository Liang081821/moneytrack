import { useState } from "react";
import { getFirestoreRefs } from "../../firebase/api";
import { addDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "@/context/GlobalContext";

export default function AddNewFunction() {
  const [addProperty, setAddProperty] = useState(false);
  const { loginEmail } = useGlobalContext();
  const { propertyCollectionRef } = getFirestoreRefs(loginEmail);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      account: "",
      account_type: "",
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
      alert("新增成功");
      setAddProperty(false);
      const docRef = await addDoc(propertyCollectionRef, {
        account: data.account,
        account_type: data.account_type,
        balance: Number(data.balance),
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <div
      className={`fixed right-0 top-40 z-50 rounded-xl bg-[#BABFD1] p-1 transition-all md:p-2 ${
        addProperty ? "" : "overflow-hidden text-sm text-white md:text-base"
      }`}
    >
      <button
        onClick={handleAddProperty}
        className="] flex items-center justify-center rounded-2xl"
      >
        新增帳戶
      </button>

      {addProperty && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="relative flex w-[90%] max-w-lg flex-col gap-3 rounded-lg bg-white p-8">
              <button
                className="absolute right-3 top-3 mr-2 rounded-xl bg-[#A7CCED] px-4 py-2 text-gray-800 transition duration-200 hover:bg-[#E8E9ED]"
                onClick={handleCloseButton}
              >
                取消
              </button>
              <div className="flex items-center gap-3">
                <div>帳戶名稱</div>
                <input
                  className="rounded-xl border border-gray-300 px-4 py-2"
                  type="text"
                  placeholder="帳戶名稱"
                  {...register("account", { required: "請輸入帳戶名稱" })}
                />
                {errors.account && (
                  <p className="text-red-500">{errors.account.message}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div>帳戶類型</div>
                <div className="flex space-x-4">
                  {/* 儲蓄選項 */}
                  <label
                    className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-2 ${
                      watch("account_type") === "儲蓄"
                        ? "bg-[#82A0BC] text-white"
                        : "border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      value="儲蓄"
                      {...register("account_type", {
                        required: "請選擇帳戶類型",
                      })}
                      className="hidden"
                    />
                    儲蓄
                  </label>

                  {/* 消費選項 */}
                  <label
                    className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-2 ${
                      watch("account_type") === "消費"
                        ? "bg-[#82A0BC] text-white"
                        : "border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      value="消費"
                      {...register("account_type", {
                        required: "請選擇帳戶類型",
                      })}
                      className="hidden"
                    />
                    消費
                  </label>

                  {/* 投資選項 */}
                  <label
                    className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-2 ${
                      watch("account_type") === "投資"
                        ? "bg-[#82A0BC] text-white"
                        : "border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      value="投資"
                      {...register("account_type", {
                        required: "請選擇帳戶類型",
                      })}
                      className="hidden"
                    />
                    投資
                  </label>
                </div>
                {errors.account_type && (
                  <p className="text-red-500">{errors.account_type.message}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div>初始金額</div>
                <input
                  className="rounded-xl border border-gray-300 px-4 py-2"
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
              <button
                type="submit"
                className="rounded-xl bg-[#82A0BC] p-2 text-white"
              >
                新增
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

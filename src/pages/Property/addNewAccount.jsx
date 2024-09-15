import { useState } from "react";
import { propertyCollectionRef } from "../../firebase/api";
import { addDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";

export default function AddNewFunction() {
  const [addProperty, setAddProperty] = useState(false);
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
      balance: 0,
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
      const docRef = await addDoc(propertyCollectionRef, {
        account: data.account,
        account_type: data.account_type,
        balance: Number(data.balance),
      });
      reset();
      alert("新增成功");

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <>
      <button
        onClick={handleAddProperty}
        className="mx-3 mb-3 mt-auto flex h-[64px] w-[360px] items-center justify-center rounded-2xl border bg-gradient-to-r from-[#3E79E5] to-[#01B8E3] text-white"
      >
        新增帳戶
      </button>

      {addProperty && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="relative flex w-[90%] max-w-lg flex-col gap-3 rounded-lg bg-white p-8">
              <button
                className="absolute right-3 top-3 rounded-xl bg-red-300 p-2"
                onClick={handleCloseButton}
              >
                關閉
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
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      value="儲蓄"
                      {...register("account_type", {
                        required: "請選擇帳戶類型",
                      })}
                      className="hidden" // 隱藏原生單選按鈕
                    />
                    儲蓄
                  </label>

                  {/* 消費選項 */}
                  <label
                    className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-2 ${
                      watch("account_type") === "消費"
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      value="消費"
                      {...register("account_type", {
                        required: "請選擇帳戶類型",
                      })}
                      className="hidden" // 隱藏原生單選按鈕
                    />
                    消費
                  </label>

                  {/* 投資選項 */}
                  <label
                    className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-2 ${
                      watch("account_type") === "投資"
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      value="投資"
                      {...register("account_type", {
                        required: "請選擇帳戶類型",
                      })}
                      className="hidden" // 隱藏原生單選按鈕
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
                    validate: (value) => value > 0 || "金額必須大於 0",
                  })}
                />
                {errors.balance && (
                  <p className="text-red-500">{errors.balance.message}</p>
                )}
              </div>
              <button type="submit" className="rounded-xl bg-[#9DBEBB] p-2">
                新增
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}

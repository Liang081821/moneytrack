import { useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getFirestoreRefs } from "../../firebase/api";
import { useForm } from "react-hook-form";
import Alert from "@/components/Alert";
import Confirm from "@/components/Confirm";

export default function AddNewClass() {
  const [newclassEditing, setNewClassEditing] = useState(false);
  const [newclass, setNewclass] = useState(false);
  const { loginEmail } = useGlobalContext();
  const { docRef } = getFirestoreRefs(loginEmail);
  const [alertMessage, setAlertMessage] = useState(null);
  const [confirmData, setConfirmData] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });
  const [selectedCategory, setSelectedCategory] = useState("收入");
  const { classData } = useGlobalContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      class: "",
    },
  });

  // 編輯模式切換
  const handleEditing = () => {
    setNewClassEditing(true);
  };
  const completeEdit = () => {
    setNewClassEditing(false);
  };

  // 提交新增分類
  const onSubmit = async (data) => {
    try {
      const fieldToUpdate = selectedCategory === "收入" ? "income" : "expense";
      reset();

      setNewclass(false);
      setAlertMessage("新增成功");
      await updateDoc(docRef, {
        [fieldToUpdate]: arrayUnion(data.class),
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // 點擊新增分類
  const handleAddNewClass = () => {
    setNewclass(true);
  };

  // 關閉新增分類
  const closeAddNewClass = () => {
    setNewclass(false);
    reset();
  };

  // 刪除分類
  const handleDeleteClass = async (item) => {
    try {
      const fieldToUpdate = selectedCategory === "收入" ? "income" : "expense";
      setAlertMessage("刪除成功");
      await updateDoc(docRef, {
        [fieldToUpdate]: arrayRemove(item),
      });
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const categoriesToDisplay =
    selectedCategory === "收入" ? classData.income : classData.expense;

  return (
    <div
      className={`self-end rounded-xl bg-[#BABFD1] p-1 text-center transition-all md:p-2 ${
        newclassEditing ? "" : "overflow-hidden text-sm md:text-base"
      }`}
    >
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
      {confirmData.isOpen && (
        <Confirm
          message={confirmData.message}
          onConfirm={() => {
            confirmData.onConfirm();
            setConfirmData({ ...confirmData, isOpen: false });
          }}
          onCancel={() => setConfirmData({ ...confirmData, isOpen: false })}
        />
      )}
      <button onClick={handleEditing}>管理分類</button>

      {newclassEditing && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="relative flex w-[90%] max-w-lg flex-col gap-3 rounded-lg bg-white p-8">
            {!newclass && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex w-full justify-evenly">
                  <div
                    className={`grow cursor-pointer rounded-xl p-1 text-center transition-all duration-300 ease-in-out ${
                      selectedCategory === "收入"
                        ? "bg-[#82A0BC] text-white"
                        : "bg-gray-100 opacity-70"
                    }`}
                    onClick={() => setSelectedCategory("收入")}
                  >
                    收入
                  </div>
                  <div
                    className={`grow cursor-pointer rounded-xl p-1 text-center transition-all duration-300 ease-in-out ${
                      selectedCategory === "支出"
                        ? "bg-[#82A0BC] text-white"
                        : "bg-gray-100 opacity-70"
                    }`}
                    onClick={() => setSelectedCategory("支出")}
                  >
                    支出
                  </div>
                </div>

                {/* 顯示分類 */}
                <div className="flex flex-wrap gap-3">
                  {Array.isArray(categoriesToDisplay) &&
                    categoriesToDisplay.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center rounded-xl border border-gray-300 p-2"
                      >
                        <p>{item}</p>
                        {/* 刪除按鈕 */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="ml-1 size-5 cursor-pointer"
                          onClick={() => {
                            setConfirmData({
                              isOpen: true,
                              message: `確定要刪除「${item}」嗎？ 刪除後該紀錄仍會保留`,
                              onConfirm: () => handleDeleteClass(item),
                            });
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </div>
                    ))}
                  <div
                    className="flex cursor-pointer items-center justify-center rounded-xl border border-gray-300 p-2 hover:bg-gray-100"
                    onClick={handleAddNewClass}
                  >
                    新增
                  </div>
                </div>
                <button
                  onClick={completeEdit}
                  className="mt-10 rounded-xl bg-[#82A0BC] p-2 text-white"
                >
                  編輯完成
                </button>
              </div>
            )}
          </div>
          {newclass && (
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="relative flex w-[90%] max-w-lg flex-col gap-3 rounded-lg bg-white p-2">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex items-center justify-between"
                >
                  <div className="ml-2 text-nowrap rounded-xl bg-[#82A0BC] p-2 text-white">
                    {selectedCategory}
                  </div>
                  <input
                    placeholder={
                      errors.class ? errors.class.message : "分類名稱"
                    }
                    className={`rounded-xl border border-gray-300 px-4 py-2 ${
                      errors.class ? "border-red-500" : ""
                    }`}
                    {...register("class", {
                      required: "請填寫分類名稱",
                    })}
                  />
                  <div>
                    <button
                      type="submit"
                      className="ml-2 rounded-xl bg-[#607196] p-2 text-white"
                    >
                      新增
                    </button>
                    <button
                      onClick={closeAddNewClass}
                      className="ml-2 rounded-xl bg-[#A7CCED] p-2 text-[#607196]"
                    >
                      返回
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

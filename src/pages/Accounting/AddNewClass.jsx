import { useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { updateDoc, arrayUnion } from "firebase/firestore";
import { docRef } from "../../firebase/api";
import { useForm } from "react-hook-form";
export default function AddNewClass() {
  const [newclassEditing, setNewClassEditing] = useState(false);
  const [newclass, setNewclass] = useState(false);

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
  const handleEditing = () => {
    setNewClassEditing(true);
  };
  const completeEdit = () => {
    setNewClassEditing(false);
  };
  const onSubmit = async (data) => {
    try {
      const fieldToUpdate = selectedCategory === "收入" ? "income" : "expense";

      await updateDoc(docRef, {
        [fieldToUpdate]: arrayUnion(data.class),
      });

      reset();
      alert("新增成功");
      setNewclass(false);

      console.log("Document updated with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const handleAddNewClass = () => {
    setNewclass(true);
  };
  const closeAddNewClass = () => {
    setNewclass(false);
    reset();
  };

  const categoriesToDisplay =
    selectedCategory === "收入" ? classData.income : classData.expense;

  return (
    <>
      <button
        onClick={handleEditing}
        className="absolute right-3 mx-3 mb-3 mt-auto flex items-center justify-center rounded-2xl border bg-gradient-to-r from-[#3E79E5] to-[#01B8E3] p-2 text-white"
      >
        編輯分類
      </button>

      {newclassEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="relative flex w-[90%] max-w-lg flex-col gap-3 rounded-lg bg-white p-8">
            {!newclass && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex w-full justify-evenly">
                  {/* 點擊時設置選中的類別 */}
                  <div
                    className={`grow cursor-pointer rounded-xl p-1 text-center transition-all duration-300 ease-in-out ${
                      selectedCategory === "收入"
                        ? "bg-[#77aca2] text-white"
                        : "bg-gray-100 opacity-70"
                    }`}
                    onClick={() => setSelectedCategory("收入")}
                  >
                    收入
                  </div>
                  <div
                    className={`grow cursor-pointer rounded-xl p-1 text-center transition-all duration-300 ease-in-out ${
                      selectedCategory === "支出"
                        ? "bg-[#77aca2] text-white"
                        : "bg-gray-100 opacity-70"
                    }`}
                    onClick={() => setSelectedCategory("支出")}
                  >
                    支出
                  </div>
                </div>

                {/* 顯示相應的類別數據 */}
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(categoriesToDisplay) &&
                    categoriesToDisplay.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center rounded-xl border border-gray-300 p-2"
                      >
                        {item}
                      </div>
                    ))}
                  <div
                    className="flex items-center justify-center rounded-xl border border-gray-300 p-2 hover:bg-gray-100"
                    onClick={handleAddNewClass}
                  >
                    新增
                  </div>
                </div>
                <button
                  onClick={completeEdit}
                  className="mt-10 rounded-xl bg-[#9dbebb] p-1"
                >
                  編輯完成
                </button>
              </div>
            )}
          </div>
          {newclass && (
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="relative flex w-[90%] max-w-lg flex-col gap-3 rounded-lg bg-white p-8">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex justify-between"
                >
                  <div className="ml-2 rounded-xl bg-[#9DBEBB] p-1">
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
                      className="ml-2 rounded-xl bg-[#9DBEBB] p-1"
                    >
                      新增
                    </button>
                    <button
                      onClick={closeAddNewClass}
                      className="ml-2 rounded-xl bg-[#77ACA2] p-1 text-white"
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
    </>
  );
}

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { storage } from "../../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestoreRefs } from "../../firebase/api";
import { useGlobalContext } from "@/context/GlobalContext";
import {
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

export default function ProjectLayoutGrid() {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectData, setselectedProjectData] = useState(null);
  const [totalamount, setTotalAmount] = useState();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginEmail } = useGlobalContext();
  const { transactionData } = useGlobalContext();
  const { projectCollectionRef, accountingCollectionRef } =
    getFirestoreRefs(loginEmail);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectname: "",
      projectimage: null,
    },
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(projectCollectionRef);
        const projectList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectList);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchProjects();
  }, [projectCollectionRef]);

  const startEditing = () => {
    setIsEditing(true);
  };

  // 新增專案
  const addNewBox = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (data.projectimage && data.projectimage[0]) {
        const imageFile = data.projectimage[0];
        const storageRef = ref(storage, `project-images/${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const newProject = {
        name: data.projectname,
        imageUrl: imageUrl,
        isediting: true,
      };
      setIsEditing(false);
      reset();
      alert("新增成功");
      setImagePreview(null);
      const docRef = await addDoc(projectCollectionRef, newProject);
      setProjects([...projects, { id: docRef.id, ...newProject }]);
    } catch (error) {
      console.error("Error adding project: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 處理圖片預覽
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
  };

  // 關閉編輯模式
  const closeEditing = () => {
    setIsEditing(false);
    setImagePreview(null);
    reset();
  };

  // 顯示專案詳情
  const showProjectDetails = (project, name) => {
    setSelectedProject(project);
    const filteredTransactions = transactionData.filter(
      (item) => item.project === name,
    );
    const sortfilteredTransactions = filteredTransactions.sort(
      (a, b) => b.time.toDate() - a.time.toDate(),
    );

    // 設定選中的專案
    setSelectedProject(project);
    setselectedProjectData(sortfilteredTransactions);

    const total = filteredTransactions.reduce((accumulate, value) => {
      if (value.record_type === "支出") {
        return accumulate - value.amount;
      } else if (value.record_type === "收入") {
        return accumulate + value.amount;
      } else {
        return accumulate;
      }
    }, 0);

    setTotalAmount(total);

    // 返回過濾後的列表
    return filteredTransactions;
  };

  // 刪除專案
  const deleteProject = async (deleteOption, id) => {
    try {
      if (deleteOption === "保留帳單") {
        setProjects(projects.filter((project) => project.id !== id));
        setSelectedProject(null);
        setselectedProjectData(null);
        alert("專案已刪除");
        showDeleteConfirm(false);
        await deleteDoc(doc(projectCollectionRef, id));
      } else if (deleteOption === "刪除帳單") {
        setProjects(projects.filter((project) => project.id !== id));
        setSelectedProject(null);
        setselectedProjectData(null);
        alert("專案已刪除");
        showDeleteConfirm(false);
        await deleteDoc(doc(projectCollectionRef, id));
        const q = query(
          accountingCollectionRef,
          where("project", "==", selectedProject.name),
        );
        const qSnapShot = await getDocs(q);
        qSnapShot.forEach(async (docSnap) => {
          await deleteDoc(doc(accountingCollectionRef, docSnap.id));
        });
      }
      // setProjects(projects.filter((project) => project.id !== id));
      // setSelectedProject(null);
      // setselectedProjectData(null);
      // alert("專案已刪除");
      // showDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  };

  // 關閉專案詳情
  const closeProjectDetails = () => {
    setSelectedProject(null);
    setselectedProjectData(null);
  };
  const closeProject = async (projectId) => {
    try {
      const projectDocRef = doc(projectCollectionRef, projectId);
      setSelectedProject(null);
      setselectedProjectData(null);
      alert("成功關閉專案");
      await updateDoc(projectDocRef, {
        isediting: false,
      });

      console.log("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  };

  return (
    <>
      <div className="w-full bg-gradient-to-r from-[#bbe0e1] via-[#ebf0f6] to-[#bbe0e1] py-10 pl-24 pr-8 md:pl-12">
        <div className="flex h-auto w-full flex-wrap items-start justify-start gap-3">
          {/* 新增專案按鈕 */}
          <div className="relative h-[200px] w-full md:h-[300px] md:w-[32%]">
            <div className="h-[200px] w-full rounded-xl border border-[#8b91a1] bg-[#8b91a1] p-4 opacity-20 md:h-[300px]"></div>
            <button
              onClick={startEditing}
              className="absolute left-1/2 top-1/2 flex h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-gray-400 pb-4 text-5xl font-semibold opacity-100 md:h-[100px] md:w-[100px] md:text-7xl"
            >
              +
            </button>
          </div>

          {/* 動態生成的專案 */}
          {projects.length === 0 ? (
            <div className="flex h-[200px] w-[420px] items-center justify-center rounded-lg border bg-slate-500 p-6 text-white opacity-40 md:h-[300px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mb-2 h-12 w-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              <p>新增第一個專案</p>
            </div>
          ) : (
            <>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`relative flex h-[200px] w-full flex-col items-center justify-center gap-4 rounded-xl md:h-[300px] md:w-[32%] ${project.isediting ? "bg-[#9DBEBB]" : "bg-[#E8E9ED]"} p-3 shadow-md`}
                  onClick={() => showProjectDetails(project, project.name)}
                >
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt="離線時無法載入圖片"
                      className="h-[70%] w-full overflow-hidden rounded-xl object-cover"
                    />
                  )}
                  <p className="text-xl font-semibold">{project.name}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* 編輯模式的彈出窗 */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="relative flex w-[90%] max-w-lg flex-col gap-3 rounded-lg bg-white p-8">
            <button
              onClick={closeEditing}
              className="self-end rounded-xl bg-[#F4E9CD] px-4 py-2 hover:bg-[#E8E9ED]"
            >
              取消
            </button>

            <form onSubmit={handleSubmit(addNewBox)} className="flex flex-col">
              <div className="flex items-center gap-3">
                <div className="font-semibold">專案名稱</div>
                <input
                  className="rounded-xl border border-gray-300 px-4 py-2"
                  type="text"
                  placeholder="專案名稱"
                  {...register("projectname", { required: "請輸入專案名稱" })}
                />
                {errors.projectname && (
                  <p className="text-red-500">{errors.projectname.message}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="font-semibold">專案圖片</div>
                <input
                  className="rounded-xl border border-gray-300 px-4 py-2"
                  type="file"
                  accept="image/*"
                  {...register("projectimage", { required: "上傳圖片" })}
                  onChange={handleImageChange}
                />
              </div>

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="mt-4 h-32 w-32 object-cover"
                />
              )}

              <button
                disabled={isSubmitting}
                type="submit"
                className="mt-4 self-center rounded-xl bg-[#607196] px-4 py-2 text-white"
              >
                新增專案
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 顯示專案詳情的彈出窗 */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="relative flex w-[2000px] max-w-lg flex-col gap-3 rounded-xl bg-white p-6">
            <button
              onClick={closeProjectDetails}
              className="self-end rounded-xl bg-[#F4E9CD] px-4 py-2 hover:bg-[#E8E9ED]"
            >
              取消
            </button>

            <div className="flex flex-col items-center gap-2 overflow-scroll">
              <p className="mt-4 text-xl font-semibold">
                {selectedProject.name}
              </p>
              <p className="font-base mb-4 mt-4 text-xl">
                總計 NT${totalamount}
              </p>
              {Array.isArray(selectedProjectData) &&
                selectedProjectData.map((item) => (
                  <div
                    key={item.id}
                    className={`w-full rounded-xl border p-3 transition-all duration-200 ${
                      item.record_type === "支出"
                        ? "bg-[#9DBEBB] text-gray-800"
                        : item.record_type === "轉帳"
                          ? "bg-[#F4E9CD] text-gray-800"
                          : "bg-[#E8E9ED] text-gray-800"
                    }`}
                  >
                    <div>{item.time.toDate().toLocaleDateString()}</div>
                    <div className="flex justify-between">
                      <div>{item.record_type}</div>
                      <div
                        className={
                          item.record_type === "支出"
                            ? "text-[#468189]"
                            : "text-[#9DBEBB]"
                        }
                      >
                        {item.record_type === "支出" ? "-" : ""}
                        NT${item.amount}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-gray-500">
                        {item.class ? item.class : `轉入 ${item.targetaccount}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.account}
                      </div>
                    </div>
                  </div>
                ))}
              <div className="flex gap-2">
                {selectedProject.isediting && (
                  <button
                    onClick={() => closeProject(selectedProject.id)}
                    className="mt-4 rounded-xl bg-[#9DBEBB] px-4 py-2 text-white"
                  >
                    結束專案
                  </button>
                )}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mt-4 rounded-xl bg-[#89023E] px-4 py-2 text-white transition duration-200 hover:bg-[#CC7178]"
                >
                  刪除專案
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 刪除確認彈窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-4">
            <h2 className="mb-4 text-xl font-bold">確認刪除所有的資料將移除</h2>
            <div className="flex justify-around">
              <button
                className="rounded-xl bg-[#9DBEBB] px-4 py-2 text-white"
                onClick={() => {
                  deleteProject("保留帳單", selectedProject.id);
                  setShowDeleteConfirm(false);
                }}
              >
                保留所有帳單
              </button>
              <button
                className="rounded-xl bg-[#89023E] px-4 py-2 text-white transition duration-200 hover:bg-[#CC7178]"
                onClick={() => {
                  deleteProject("刪除帳單", selectedProject.id);
                  setShowDeleteConfirm(false);
                }}
              >
                我要刪除
              </button>
              <button
                className="rounded-xl bg-[#F4E9CD] px-4 py-2 hover:bg-[#E8E9ED]"
                onClick={() => setShowDeleteConfirm(false)}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

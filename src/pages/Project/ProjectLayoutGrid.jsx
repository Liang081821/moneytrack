import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { storage } from "../../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestoreRefs } from "../../firebase/api";
import { useGlobalContext } from "@/context/GlobalContext";
import { addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default function ProjectLayoutGrid() {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectData, setselectedProjectData] = useState(null);
  const [totalamount, setTotalAmount] = useState();

  const { loginEmail } = useGlobalContext();
  const { transactionData, projectData } = useGlobalContext();
  const { projectCollectionRef } = getFirestoreRefs(loginEmail);

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

      const docRef = await addDoc(projectCollectionRef, newProject);
      setProjects([...projects, { id: docRef.id, ...newProject }]);

      setIsEditing(false);
      reset();
      alert("新增成功");
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding project: ", error);
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

    // 設定選中的專案
    setSelectedProject(project);
    setselectedProjectData(filteredTransactions);

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
  const deleteProject = async (id) => {
    try {
      await deleteDoc(doc(projectCollectionRef, id));
      setProjects(projects.filter((project) => project.id !== id));
      setSelectedProject(null);
      setselectedProjectData(null);
      alert("專案已刪除");
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

      await updateDoc(projectDocRef, {
        isediting: false,
      });

      setSelectedProject(null);
      setselectedProjectData(null);

      console.log("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  };

  return (
    <>
      <div>
        <div className="flex h-auto flex-wrap items-start justify-start gap-4 border border-black p-4">
          {/* 新增專案按鈕 */}
          <div className="relative h-[300px] w-[450px]">
            <div className="h-[300px] w-[450px] rounded-xl border border-[#8b91a1] bg-[#8b91a1] p-4 opacity-20"></div>
            <button
              onClick={startEditing}
              className="absolute left-1/2 top-1/2 flex h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-gray-400 pb-4 text-9xl opacity-100"
            >
              +
            </button>
          </div>

          {/* 動態生成的專案 */}
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative h-[300px] w-[450px] rounded-xl border border-[#8b91a1] p-4"
              onClick={() => showProjectDetails(project, project.name)}
            >
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt="Project"
                  className="h-full w-full rounded-xl object-cover"
                />
              )}
              <p>{project.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 編輯模式的彈出窗 */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="relative flex w-[90%] max-w-lg flex-col gap-3 rounded-lg bg-white p-8">
            <button onClick={closeEditing} className="self-end">
              關閉
            </button>

            <form onSubmit={handleSubmit(addNewBox)}>
              <div className="flex items-center gap-3">
                <div>專案名稱</div>
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
                <div>專案圖片</div>
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
                type="submit"
                className="mt-4 rounded-xl bg-blue-500 px-4 py-2 text-white"
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
          <div className="relative flex w-[2000px] max-w-lg flex-col gap-3 rounded-lg bg-white p-8">
            <button onClick={closeProjectDetails} className="self-end">
              關閉
            </button>

            <div className="flex flex-col items-center">
              {selectedProject.imageUrl && (
                <img
                  src={selectedProject.imageUrl}
                  alt="Project"
                  className="h-64 w-64 rounded-xl object-cover"
                />
              )}
              <p className="mt-4 text-xl font-semibold">
                {selectedProject.name}
              </p>
              <p className="mt-4 text-xl font-semibold">
                總計 NT${totalamount}
              </p>
              {Array.isArray(selectedProjectData) &&
                selectedProjectData.map((item) => (
                  <div
                    key={item.id}
                    className="w-full rounded-xl border border-black bg-gray-100 p-2"
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
                    className="mt-4 rounded-xl bg-green-500 px-4 py-2 text-white"
                  >
                    結束專案
                  </button>
                )}
                <button
                  onClick={() => deleteProject(selectedProject.id)}
                  className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-white"
                >
                  刪除專案
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

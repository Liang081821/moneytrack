import Alert from "@/components/Alert";
import Button from "@/components/Button";
import TransactionCard from "@/components/TransactionCard";
import { useGlobalContext } from "@/context/GlobalContext";
import { addDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ProjectJoyride from "../../components/JoyRide/ProjectJoyRide";
import { useJoyride } from "../../context/JoyrideContext";
import { getFirestoreRefs } from "../../firebase/api";
import { storage } from "../../firebase/firebaseConfig";

import {
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

export default function ProjectLayoutGrid() {
  const { setProjectRun } = useJoyride();

  useEffect(() => {
    const hasSeenProjectTutorial = localStorage.getItem(
      "hasSeenProjectTutorial",
    );
    if (!hasSeenProjectTutorial) {
      setProjectRun(true);
      localStorage.setItem("hasSeenProjectTutorial", "true");
    }
  }, [setProjectRun]);

  const startTutorial = () => {
    setProjectRun(true);
  };
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
  const [alertMessage, setAlertMessage] = useState(null);

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
        created_at: serverTimestamp(),
      };
      setIsEditing(false);
      reset();
      setAlertMessage("新增成功");
      setImagePreview(null);
      const docRef = await addDoc(projectCollectionRef, newProject);
      await updateDoc(docRef, {
        id: docRef.id,
      });
      setProjects([...projects, { id: docRef.id, ...newProject }]);
    } catch (error) {
      console.error("Error adding project: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
  };

  const closeEditing = () => {
    setIsEditing(false);
    setImagePreview(null);
    reset();
  };

  const showProjectDetails = (project, id) => {
    setSelectedProject(project);
    const filteredTransactions = transactionData.filter(
      (item) => item.projectid === id,
    );
    const sortfilteredTransactions = filteredTransactions.sort(
      (a, b) => b.time.toDate() - a.time.toDate(),
    );

    setSelectedProject(project);
    setselectedProjectData(sortfilteredTransactions);

    const total = filteredTransactions.reduce((accumulate, value) => {
      if (value.record_type === "支出") {
        return accumulate - value.convertedAmountTWD;
      } else if (value.record_type === "收入") {
        return accumulate + value.convertedAmountTWD;
      } else {
        return accumulate;
      }
    }, 0);

    setTotalAmount(total);

    return filteredTransactions;
  };

  const deleteProject = async (deleteOption, id) => {
    try {
      if (deleteOption === "保留帳單") {
        await deleteDoc(doc(projectCollectionRef, id));
      } else if (deleteOption === "刪除帳單") {
        await deleteDoc(doc(projectCollectionRef, id));
        const q = query(
          accountingCollectionRef,
          where("projectid", "==", selectedProject.id),
        );
        const qSnapShot = await getDocs(q);
        qSnapShot.forEach(async (docSnap) => {
          await deleteDoc(doc(accountingCollectionRef, docSnap.id));
        });
      }
      setProjects(projects.filter((project) => project.id !== id));
      setSelectedProject(null);
      setselectedProjectData(null);
      setAlertMessage("專案已刪除");
      showDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
    setselectedProjectData(null);
  };
  const closeProject = async (projectId) => {
    try {
      const projectDocRef = doc(projectCollectionRef, projectId);
      setSelectedProject(null);
      setselectedProjectData(null);
      setAlertMessage("已關閉專案");
      await updateDoc(projectDocRef, {
        isediting: false,
      });
      console.log("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  };
  const [showOnlyEditing, setShowOnlyEditing] = useState(true);

  return (
    <>
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
      <ProjectJoyride />
      <div className="w-[85%] py-5">
        <div className="flex h-auto flex-col flex-wrap items-start justify-start gap-4">
          {/* 新增專案按鈕 */}
          <div className="flex w-full justify-between gap-2 self-end rounded-lg bg-[#fcfcfc] p-4 shadow-lg">
            <div className="joyride-report flex gap-2 border-b border-gray-300">
              <div
                onClick={() => setShowOnlyEditing(true)}
                className={`transform cursor-pointer text-center text-sm font-semibold transition-all duration-300 md:text-base ${
                  showOnlyEditing
                    ? "scale-105 border-b-2 border-[#607196] text-[#607196]"
                    : "text-gray-400"
                } px-2 py-1 md:px-4 md:py-2`}
              >
                進行中
              </div>

              <div
                onClick={() => setShowOnlyEditing(false)}
                className={`transform cursor-pointer text-center text-sm font-semibold transition-all duration-300 md:text-base ${
                  !showOnlyEditing
                    ? "scale-105 border-b-2 border-[#607196] text-[#607196]"
                    : "text-gray-400"
                } px-2 py-1 md:px-4 md:py-2`}
              >
                已結束
              </div>
            </div>
            {showOnlyEditing ? (
              <>
                <Button
                  className="flex items-center justify-center gap-1 md:gap-2"
                  variant="grey"
                  onClick={() => startTutorial()}
                >
                  <p className="hidden text-sm md:block md:text-base">
                    使用教學
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="yellow"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4 md:size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                    />
                  </svg>
                </Button>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="joyride-project flex w-full flex-wrap gap-4">
            {showOnlyEditing ? (
              <>
                {" "}
                <div className="joyride-addproject relative h-[200px] w-full md:h-[300px] md:w-[32%]">
                  <div className="h-[200px] w-full rounded-lg bg-slate-500 p-4 opacity-20 md:h-[300px]"></div>
                  <button
                    onClick={startEditing}
                    className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center text-5xl font-semibold opacity-100 md:h-[100px] md:w-[100px] md:text-7xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1"
                      stroke="currentColor"
                      className="size-20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}

            {projects.length === 0 ? (
              <></>
            ) : (
              <>
                {projects
                  .filter((project) =>
                    showOnlyEditing ? project.isediting : !project.isediting,
                  )
                  .sort((a, b) => {
                    const aTime = a.created_at ? a.created_at.seconds : 0;
                    const bTime = b.created_at ? b.created_at.seconds : 0;
                    return bTime - aTime;
                  })
                  .map((project) => (
                    <div
                      key={project.id}
                      className={`border-1 relative flex h-[200px] w-full flex-col items-center justify-center gap-4 rounded-lg md:h-[300px] md:w-[32%] ${project.isediting ? "bg-[#82A0BC]" : "bg-[#A7CCED]"} p-3 shadow-md`}
                      onClick={() => showProjectDetails(project, project.id)}
                    >
                      {project.imageUrl && (
                        <img
                          src={project.imageUrl}
                          alt="離線時無法載入圖片"
                          className="w-full overflow-hidden rounded-lg object-cover"
                        />
                      )}
                      <p className="text-xl font-semibold">{project.name}</p>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 fade-in">
          <div className="relative flex w-[90%] max-w-lg flex-col gap-3 rounded-lg bg-white p-8">
            <Button onClick={closeEditing} className="self-end">
              取消
            </Button>

            <form
              onSubmit={handleSubmit(addNewBox)}
              className="flex flex-col gap-2"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex w-full items-center gap-3">
                  <div className="text-nowrap font-semibold">專案名稱</div>
                  <input
                    className="h-[48px] w-full rounded-lg border border-gray-300 px-4 py-2"
                    type="text"
                    placeholder="專案名稱"
                    {...register("projectname", {
                      required: "請輸入專案名稱",
                      maxLength: {
                        value: 10,
                        message: "專案名稱不能超過 10 個字",
                      },
                    })}
                  />
                </div>
                {errors.projectname && (
                  <p className="text-red-500">{errors.projectname.message}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="text-nowrap font-semibold">專案圖片</div>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
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
                className="mt-4 self-center rounded-lg bg-[#607196] px-4 py-2 text-white"
              >
                新增專案
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 p-2 fade-in md:p-0">
          <div className="relative flex w-[2000px] max-w-lg flex-col gap-3 rounded-lg bg-white p-6">
            <Button onClick={closeProjectDetails} className="self-end">
              取消
            </Button>

            <div className="flex flex-col items-center gap-2 overflow-scroll">
              <p className="mt-4 text-xl font-semibold">
                {selectedProject.name}
              </p>
              <p className="font-base mb-4 mt-4 text-xl">
                總計 NT${totalamount}
              </p>
              <div className="flex w-full flex-col gap-3">
                {Array.isArray(selectedProjectData) &&
                  selectedProjectData.map((item) => (
                    <TransactionCard
                      key={item.id}
                      item={item}
                      showProject={false}
                    />
                  ))}
              </div>
              <div className="flex gap-2">
                {selectedProject.isediting && (
                  <Button
                    onClick={() => closeProject(selectedProject.id)}
                    className="mt-4"
                    variant="dontdelete"
                  >
                    結束專案
                  </Button>
                )}
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="delete"
                  className="mt-4"
                >
                  刪除專案
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 p-4 fade-in">
          <div className="w-full max-w-md rounded-lg bg-white p-4">
            <h2 className="mb-4 text-xl font-bold">確認刪除所有的資料將移除</h2>
            <div className="flex justify-around">
              <Button
                variant="dontdelete"
                onClick={() => {
                  deleteProject("保留帳單", selectedProject.id);
                  setShowDeleteConfirm(false);
                }}
              >
                保留所有帳單
              </Button>
              <Button
                variant="delete"
                onClick={() => {
                  deleteProject("刪除帳單", selectedProject.id);
                  setShowDeleteConfirm(false);
                }}
              >
                我要刪除
              </Button>
              <Button onClick={() => setShowDeleteConfirm(false)}>取消</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

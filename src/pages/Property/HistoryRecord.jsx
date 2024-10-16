import AccountDetails from "@/components/AccountDetails";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import { useGlobalContext } from "@/context/GlobalContext";
import { getFirestoreRefs } from "@/firebase/api";
import { db } from "@/firebase/firebaseConfig";
import { addDoc, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Tooltip } from "react-tooltip";
import JoyrideGuide from "../../components/JoyRide/index";
import { useJoyride } from "../../context/JoyrideContext";
import PropertyTrendChart from "./PropertyTrendChart";

export default function HistoryRecord() {
  const { setRun } = useJoyride();

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    if (!hasSeenTutorial) {
      setRun(true);
      localStorage.setItem("hasSeenTutorial", "true");
    }
  }, [setRun]);

  const { property } = useGlobalContext();
  const { historyData } = useGlobalContext();
  const [alertMessage, setAlertMessage] = useState(null);

  const { loginEmail } = useGlobalContext();
  const { historyCollectionRef } = getFirestoreRefs(loginEmail);
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (Array.isArray(property) && property.length === 0 && isFirstLoad) {
      const timer = setTimeout(() => {
        setLoading(false);
        setIsFirstLoad(false);
      }, 2500);

      return () => clearTimeout(timer);
    } else if (Array.isArray(property) && property.length > 0) {
      setLoading(false);
      setIsFirstLoad(false);
    }
  }, [property]);

  const calculateProperty = async () => {
    if (property.length === 0) {
      setAlertMessage("尚未有資產，無法統計");
      return;
    }
    const types = {
      saving: "儲蓄",
      expense: "消費",
      investment: "投資",
    };

    const newTotals = Object.fromEntries(
      Object.entries(types).map(([key, type]) => [
        key,
        property
          .filter((item) => item.account_type === type)
          .reduce(
            (accumulator, currentValue) =>
              accumulator + (currentValue.balance || 0),
            0,
          ),
      ]),
    );

    const totalAssets = property.reduce(
      (accumulator, currentValue) => accumulator + (currentValue.balance || 0),
      0,
    );

    const totalAssetsAbsoluteValue = Object.values(newTotals).reduce(
      (accumulator, currentValue) => accumulator + Math.abs(currentValue),
      0,
    );

    try {
      setAlertMessage("添加成功");
      const docRef = await addDoc(historyCollectionRef, {
        saving: newTotals.saving,
        expense: newTotals.expense,
        investment: newTotals.investment,
        totalAssets: totalAssets,
        totalAssetsAbsoluteValue: totalAssetsAbsoluteValue,
        time: new Date(),
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deleteRecord = async (id) => {
    try {
      const docRef = doc(db, "record", loginEmail, "history", id);
      setAlertMessage("刪除成功");
      await deleteDoc(docRef);
    } catch (e) {
      console.error(e);
    }
  };

  const getPercentage = (amount, total) =>
    total ? (Math.abs(amount) / Math.abs(total)) * 100 : 0;

  const startTutorial = () => {
    setRun(true);
  };

  const [view, SetView] = useState(true);
  if (loading && isFirstLoad) {
    return (
      <div className="w-full pt-5">
        <div className="mx-auto mb-[10vh] flex w-[85%] flex-col pl-11 md:pl-0">
          <Skeleton height={72} width="100%" />

          <div className="mt-2 flex w-full flex-col gap-2 md:flex-row">
            <div className="h-[300px] w-full md:h-[595px]">
              <Skeleton height="100%" width="100%" />
            </div>
            <div className="h-[300px] w-full md:h-[595px]">
              <Skeleton height="100%" width="100%" />
            </div>
            <div className="h-[300px] w-full md:h-[595px]">
              <Skeleton height="100%" width="100%" />
            </div>
          </div>

          <Skeleton height={200} width="100%" className="mt-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-[#e3e3e3] via-[#efefef] to-[#e3e3e3] pl-11 pt-5 fade-in md:pl-0">
      <div className="mx-auto mb-[10vh] flex w-[85%] flex-col">
        {alertMessage && (
          <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
        )}
        <JoyrideGuide />

        <div className="mb-3 flex w-full justify-end rounded-lg bg-[#fcfcfc] p-4 shadow-lg">
          <Button
            className="mr-2 flex items-center justify-center gap-1 md:gap-2"
            variant="grey"
            onClick={() => startTutorial()}
          >
            <button className="hidden text-sm md:block md:text-base">
              使用教學
            </button>
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
          <Button
            variant="retain"
            onClick={calculateProperty}
            className="joyride-totalproperty flex items-center justify-center gap-1 md:gap-2"
          >
            <p className="hidden text-sm md:block md:text-base">統計最新資產</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4 md:size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </Button>
        </div>
        <div className="joyride-account flex h-full flex-col items-center justify-center gap-3 md:flex-row md:flex-nowrap">
          <div className="joyride-saving-account w-full">
            <AccountDetails
              title="儲蓄"
              imageSrc={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#e8e9ed"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                  />
                </svg>
              }
              accountType="儲蓄"
              bgColor="bg-[#e8e9ed]"
            />
          </div>
          <div className="joyride-expense-account w-full">
            <AccountDetails
              title="消費"
              imageSrc={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#9dbebb"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              }
              accountType="消費"
              bgColor="bg-[#9dbebb]"
              textColor="text-gray-800"
            />
          </div>
          <div className="joyride-investment-account w-full">
            <AccountDetails
              title="投資"
              imageSrc={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#babfd1"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
                  />
                </svg>
              }
              accountType="投資"
              bgColor="bg-[#babfd1]"
            />
          </div>
        </div>
        <div className="mx-auto w-full">
          {historyData.length !== 0 ? (
            <div className="mb-9 mt-3 flex h-auto w-full flex-col items-center overflow-y-scroll rounded-lg bg-[#fcfcfc] px-4 pb-7 shadow-lg lg:max-h-[750px]">
              <div className="sticky top-0 flex w-full items-center justify-center bg-[#fcfcfc] pb-2 pt-7">
                <div className="mr-2 text-lg font-semibold md:mr-0 md:text-xl">
                  資產紀錄
                </div>
                <div className="right-3 flex gap-2 border-b border-gray-300 md:absolute">
                  <button
                    onClick={() => SetView(true)}
                    className={`text-sm font-semibold md:text-base ${view ? "scale-105 border-b-2 border-[#607196] text-[#607196]" : "text-gray-400"} transform px-2 py-1 transition duration-300 ease-in-out md:px-4 md:py-2`}
                  >
                    列表檢視
                  </button>

                  <button
                    onClick={() => SetView(false)}
                    className={`text-sm font-semibold md:text-base ${!view ? "scale-105 border-b-2 border-[#607196] text-[#607196]" : "text-gray-400"} transform px-2 py-1 transition duration-300 ease-in-out md:px-4 md:py-2`}
                  >
                    圖表檢視
                  </button>
                </div>
              </div>
              <div className="flex h-[500px] w-full flex-col overflow-y-scroll lg:h-auto">
                {view ? (
                  historyData
                    .slice()
                    .sort((a, b) => b.time.toDate() - a.time.toDate())
                    .map((item) => (
                      <div
                        key={item.id}
                        className="m-1 flex h-fit w-full flex-col items-center gap-3 rounded-lg p-2 md:flex-row lg:min-h-[100px]"
                      >
                        <div className="w-[110px] rounded-lg p-2 text-center">
                          {item.time.toDate().toLocaleDateString()}
                        </div>
                        <div className="flex w-full items-center">
                          <div
                            className="flex h-6 items-center justify-center rounded-lg bg-[#e8e9ed] font-semibold"
                            style={{
                              width: `${getPercentage(item.saving, item.totalAssetsAbsoluteValue)}%`,
                            }}
                            data-tooltip-id="tooltip"
                            data-tooltip-content={`儲蓄帳戶 NT$${item.saving.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              },
                            )} (${getPercentage(item.saving, item.totalAssetsAbsoluteValue).toFixed(1)}%)`}
                          ></div>

                          <div
                            className="flex h-6 w-full items-center justify-center rounded-lg bg-[#9dbebb] font-semibold text-white"
                            style={{
                              width: `${getPercentage(item.expense, item.totalAssetsAbsoluteValue)}%`,
                            }}
                            data-tooltip-id="tooltip"
                            data-tooltip-content={`消費帳戶 NT$${item.expense.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              },
                            )} (${getPercentage(item.expense, item.totalAssetsAbsoluteValue).toFixed(1)}%)`}
                          ></div>

                          <div
                            className="flex h-6 items-center justify-center rounded-lg bg-[#babfd1] font-semibold"
                            style={{
                              width: `${getPercentage(item.investment, item.totalAssetsAbsoluteValue)}%`,
                            }}
                            data-tooltip-id="tooltip"
                            data-tooltip-content={`投資帳戶 NT$${item.investment.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              },
                            )} (${getPercentage(item.investment, item.totalAssetsAbsoluteValue).toFixed(1)}%)`}
                          ></div>

                          <Tooltip id="tooltip" />
                        </div>
                        <div className="flex flex-col items-center justify-end gap-2 lg:flex-row">
                          <div className="ml-2 flex h-[60px] min-w-[150px] flex-col items-center justify-center rounded-lg border-2 border-[#e8e9ed] p-3">
                            <div className="text-lg font-semibold">儲蓄</div>
                            <div>
                              NT$
                              {item.saving.toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })}
                            </div>
                          </div>
                          <div className="ml-2 flex h-[60px] min-w-[150px] flex-col items-center justify-center rounded-lg border-2 border-[#9dbebb] p-3">
                            <div className="text-lg font-semibold">消費</div>
                            <div>
                              NT$
                              {item.expense.toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })}
                            </div>
                          </div>
                          <div className="ml-2 flex h-[60px] min-w-[150px] flex-col items-center justify-center rounded-lg border-2 border-[#babfd1] p-3">
                            <div className="text-lg font-semibold">投資</div>
                            <div>
                              NT$
                              {item.investment.toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })}
                            </div>
                          </div>
                          <div className="ml-2 flex h-[60px] min-w-[150px] flex-col items-center justify-center rounded-lg p-3">
                            <div className="text-lg font-semibold">總資產</div>
                            <div>
                              NT$
                              {item.totalAssets.toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })}
                            </div>
                          </div>
                          <Button
                            onClick={() => deleteRecord(item.id)}
                            variant="delete"
                            className="flex-col items-center justify-center text-nowrap"
                          >
                            刪除
                          </Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <PropertyTrendChart />
                )}
              </div>
            </div>
          ) : (
            <div className="mb-4 mt-3 flex h-[200px] w-full items-center justify-center rounded-lg border bg-slate-500 text-white opacity-40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mb-2 size-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              <p
                className="ml-4 cursor-pointer font-semibold"
                onClick={calculateProperty}
              >
                統計資產，即可查看分析圖表
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

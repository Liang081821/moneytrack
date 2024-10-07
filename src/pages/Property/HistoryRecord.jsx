import { useGlobalContext } from "@/context/GlobalContext";
import { getFirestoreRefs } from "@/firebase/api";
import { addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import Alert from "@/components/Alert";
import { useState, useEffect } from "react";
import InvestPic from "../../../public/invest.png";
import ConsumePic from "../../../public/consume.png";
import SavingPic from "../../../public/saving.png";
import JoyrideGuide from "../../components/JoyRide/index";
import { useJoyride } from "../../context/JoyrideContext";
import Button from "@/components/Button";

import AccountDetails from "@/components/AccountDetails";

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
  const calculateProperty = async () => {
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
  return (
    <div className="w-full bg-gradient-to-r from-[#e3e3e3] via-[#efefef] to-[#e3e3e3] pl-11 pt-5 fade-in md:pl-0">
      <div className="mx-auto flex w-[85%] flex-col">
        {alertMessage && (
          <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
        )}
        <JoyrideGuide />

        <div className="mb-3 flex w-full justify-end rounded-lg bg-[#fcfcfc] p-4 shadow-lg">
          <Button
            className="mr-2 flex items-center justify-center gap-1 md:gap-2"
            variant="grey"
          >
            <button onClick={() => startTutorial()}>使用教學</button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="yellow"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
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
            className="joyride-totalproperty flex items-center justify-center gap-1 md:gap-2"
          >
            <p onClick={calculateProperty}>統計最新資產</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
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
              imageSrc={SavingPic}
              accountType="儲蓄"
              bgColor="bg-[#82A0BC]"
            />
          </div>
          <div className="joyride-expense-account w-full">
            <AccountDetails
              title="消費"
              imageSrc={ConsumePic}
              accountType="消費"
              bgColor="bg-[#545E75]"
              textColor="text-white"
            />
          </div>
          <div className="joyride-investment-account w-full">
            <AccountDetails
              title="投資"
              imageSrc={InvestPic}
              accountType="投資"
              bgColor="bg-[#A7CCED]"
            />
          </div>
        </div>
        <div className="mx-auto w-full">
          {historyData.length !== 0 ? (
            <div className="mb-9 mt-3 flex w-full flex-col items-center justify-center rounded-lg bg-[#fcfcfc] p-2 shadow-lg">
              <div className="text-xl font-semibold">資產紀錄</div>
              {historyData
                .slice()
                .sort((a, b) => b.time.toDate() - a.time.toDate())
                .map((item) => (
                  <div
                    key={item.id}
                    className="m-1 flex min-h-[100px] w-full flex-col items-center gap-3 rounded-lg p-2 md:flex-row"
                  >
                    <div className="w-[110px] rounded-lg p-2 text-center">
                      {item.time.toDate().toLocaleDateString()}
                    </div>
                    <div className="flex w-full">
                      <div
                        className="t flex h-8 w-14 items-center justify-center rounded-lg bg-[#82A0BC] font-semibold"
                        style={{
                          width: `${getPercentage(item.saving, item.totalAssetsAbsoluteValue)}%`,
                        }}
                      >
                        {getPercentage(
                          item.saving,
                          item.totalAssetsAbsoluteValue,
                        ) >= 4
                          ? `${getPercentage(item.saving, item.totalAssetsAbsoluteValue).toFixed(1)}%`
                          : ""}
                      </div>
                      <div
                        className="flex h-8 w-full items-center justify-center rounded-lg bg-[#545E75] font-semibold text-white"
                        style={{
                          width: `${getPercentage(item.expense, item.totalAssetsAbsoluteValue)}%`,
                        }}
                      >
                        {getPercentage(
                          item.expense,
                          item.totalAssetsAbsoluteValue,
                        ) >= 4
                          ? `${getPercentage(item.expense, item.totalAssetsAbsoluteValue).toFixed(1)}%`
                          : ""}
                      </div>
                      <div
                        className="flex h-8 w-14 items-center justify-center rounded-lg bg-[#A7CCED] font-semibold"
                        style={{
                          width: `${getPercentage(item.investment, item.totalAssetsAbsoluteValue)}%`,
                        }}
                      >
                        {getPercentage(
                          item.investment,
                          item.totalAssetsAbsoluteValue,
                        ) >= 4
                          ? `${getPercentage(item.investment, item.totalAssetsAbsoluteValue).toFixed(1)}%`
                          : ""}
                      </div>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row">
                      <div className="flex h-[60px] w-full flex-col items-center justify-center rounded-lg border-2 border-[#82A0BC] p-3">
                        <div className="text-lg font-semibold">儲蓄</div>
                        <div>
                          NT$
                          {item.saving.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                      <div className="flex h-[60px] w-full flex-col items-center justify-center rounded-lg border-2 border-[#545E75] p-3">
                        <div className="text-lg font-semibold">消費</div>
                        <div>
                          NT$
                          {item.expense.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                      <div className="flex h-[60px] w-full flex-col items-center justify-center rounded-lg border-2 border-[#A7CCED] p-3">
                        <div className="text-lg font-semibold">投資</div>
                        <div>
                          NT$
                          {item.investment.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                      <div className="flex h-[60px] w-full flex-col items-center justify-center rounded-lg bg-[#BABFD1] p-3">
                        <div className="text-lg font-semibold">總資產</div>
                        <div>
                          NT$
                          {item.totalAssets.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
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
                ))}
            </div>
          ) : (
            <div className="mb-4 mt-3 flex h-[100px] w-full items-center justify-center rounded-lg border bg-slate-500 text-white opacity-40">
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
              <p className="ml-4 font-semibold">統計資產，即可查看分析圖表</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

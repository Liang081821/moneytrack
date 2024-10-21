import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Confirm from "@/components/Confirm";
import { useEffect, useState } from "react";
import AnalysisJoyride from "../../components/JoyRide/AnalysisJoyRide";
import { useJoyride } from "../../context/JoyrideContext";
import BalanceSheet from "../Analysis/BalanceSheet";
import MonthlyData from "../Analysis/MonthlyData";
import HistoryReport from "./HistoryReport";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";

export default function Report() {
  const { setAnalysisRun } = useJoyride();

  useEffect(() => {
    const hasSeenAnalysisTutorial = localStorage.getItem(
      "hasSeenAnalysisTutorial",
    );
    if (!hasSeenAnalysisTutorial) {
      setAnalysisRun(true);
      localStorage.setItem("hasSeenAnalysisTutorial", "true");
    }
  }, [setAnalysisRun]);
  const startTutorial = () => {
    setAnalysisRun(true);
  };
  const [reportVisible, setReportVisible] = useState(false);
  const [step, setStep] = useState(1);

  const [monthexpense, setmonthExpense] = useState(0);
  const [monthincome, setmonthIncome] = useState(0);
  const [expenseRecords, setExpenseRecords] = useState({});

  const [totalProperty, setTotalProperty] = useState(0);
  const [savingRate, setSavingRate] = useState(0);

  const [expenseTotals, setExpenseTotals] = useState({});
  const [incomeTotals, setIncomeTotals] = useState({});
  const [netWorth, setNetWorth] = useState(0);

  const [selectedHouseCategory, setSelectedHouseCategory] = useState("");
  const [selectedInsureCategory, setSelectedInsureCategory] = useState("");

  const [preText, setPreText] = useState("");

  const [alertMessage, setAlertMessage] = useState(null);
  const [confirmData, setConfirmData] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
    cancelMessage: "取消",
    confirmMessage: "確認",
  });

  const [livestatic, setLiveStatic] = useState(true);

  const handleAddReport = () => {
    if (Number(monthexpense) === 0 && Number(monthincome) === 0) {
      setAlertMessage("上月無數據可進行分析");
    } else {
      setReportVisible(true);
    }
  };
  const handleNextStep = () => {
    if (step === 2) {
      if (!selectedHouseCategory || !selectedInsureCategory) {
        setAlertMessage("請選擇房屋類別和保險類別才能進入下一步！");
        return;
      }
    }
    if (step === 3) {
      setConfirmData({
        isOpen: true,
        message: "即將生成報表，確認後不可返回",
        onConfirm: () => {
          setConfirmData({ ...confirmData, isOpen: false });
          setStep((prevStep) => prevStep + 1);
        },
        cancelMessage: "取消",
        confirmMessage: "確認",
      });
      return;
    }
    if (step === 4) {
      setConfirmData({
        isOpen: true,
        message: "理財貓規劃師即將替您分析，進入後不可返回",
        onConfirm: () => {
          setPreText(
            `我的淨資產有 NT$${totalProperty}，上月總支出 NT$${monthexpense}、總收入 NT$${monthincome}，儲蓄率是 ${savingRate}%，大家都說緊急備用金要是生活費的 6 個月，我目前的狀況是這樣，請給我一些理財建議！`,
          );
          setConfirmData({ ...confirmData, isOpen: false });
          setStep((prevStep) => prevStep + 1);
        },
        cancelMessage: "取消",
        confirmMessage: "確認",
      });
      return;
    }
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleCloseReport = () => {
    setConfirmData({
      isOpen: true,
      message: "離開後需重新進入，確定離開嗎",
      cancelMessage: "取消",
      confirmMessage: "確認",
      onConfirm: () => {
        setConfirmData({ ...confirmData, isOpen: false });
        setReportVisible(false);
        setStep(1);
        setSelectedHouseCategory("");
        setSelectedInsureCategory("");
      },
    });

    return;
  };

  const handleComplete = () => {
    setConfirmData({
      isOpen: true,
      message: "離開視窗後將關閉諮詢室，確定離開嗎",
      onConfirm: () => {
        setConfirmData({ ...confirmData, isOpen: false });
        setReportVisible(false);
        setStep(1);
        setSelectedHouseCategory("");
        setSelectedInsureCategory("");
      },
      cancelMessage: "取消",
      confirmMessage: "確認",
    });

    return;
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Step1 />;
      case 2:
        return (
          <Step2
            setSelectedHouseCategory={setSelectedHouseCategory}
            setSelectedInsureCategory={setSelectedInsureCategory}
            selectedHouseCategory={selectedHouseCategory}
            selectedInsureCategory={selectedInsureCategory}
          />
        );
      case 3:
        return (
          <Step3
            expenseTotals={expenseTotals}
            incomeTotals={incomeTotals}
            netWorth={netWorth}
          />
        );
      case 4:
        return (
          <Step4
            monthexpense={monthexpense}
            monthincome={monthincome}
            selectedHouseCategory={selectedHouseCategory}
            expenseRecords={expenseRecords}
            selectedInsureCategory={selectedInsureCategory}
            setTotalProperty={setTotalProperty}
            setSavingRate={setSavingRate}
            savingRate={savingRate}
            totalProperty={totalProperty}
          />
        );
      case 5:
        return <Step5 preText={preText} setPreText={setPreText} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex w-[85%] flex-col items-center">
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
      <AnalysisJoyride />

      <div className="mb-3 flex w-full items-center justify-between gap-1 rounded-lg bg-[#fcfcfc] p-4 shadow-lg md:gap-2">
        <div className="relative flex gap-2 border-b border-gray-300">
          <button
            onClick={() => setLiveStatic(true)}
            className={`text-sm font-semibold md:text-base ${livestatic ? "scale-105 border-b-2 border-[#607196] text-[#607196]" : "text-gray-400"} transform px-2 py-1 transition duration-300 ease-in-out md:px-4 md:py-2`}
          >
            即時數據
          </button>

          <button
            onClick={() => setLiveStatic(false)}
            className={`joyride-report text-sm font-semibold md:text-base ${!livestatic ? "scale-105 border-b-2 border-[#607196] text-[#607196]" : "text-gray-400"} transform px-2 py-1 transition duration-300 ease-in-out md:px-4 md:py-2`}
          >
            歷史報告
          </button>
        </div>
        <div className="flex gap-2">
          {livestatic ? (
            <>
              <Button
                className="flex cursor-pointer items-center justify-center gap-1 md:gap-2"
                variant="grey"
                onClick={() => startTutorial()}
              >
                <p className="hidden text-sm md:block md:text-base">使用教學</p>
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

          <Button
            className="joyride-generatereport flex cursor-pointer items-center justify-center gap-1 md:gap-2"
            variant="retain"
            onClick={() => handleAddReport()}
          >
            <p className="hidden text-sm md:block md:text-base">我要進行分析</p>
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
                d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
              />
            </svg>
          </Button>
        </div>
      </div>
      {livestatic ? (
        <div className="mx-auto flex h-auto w-full flex-col justify-center gap-3 md:flex-row">
          <div className="joyride-monthlydata w-full">
            <MonthlyData
              setmonthExpense={setmonthExpense}
              setmonthIncome={setmonthIncome}
              expenseTotals={expenseTotals}
              setExpenseTotals={setExpenseTotals}
              incomeTotals={incomeTotals}
              setIncomeTotals={setIncomeTotals}
              netWorth={netWorth}
              setNetWorth={setNetWorth}
              setExpenseRecords={setExpenseRecords}
              expenseRecords={expenseRecords}
            />
          </div>
          <div className="joyride-balancesheet mb-[10vh] w-full md:mb-0">
            <BalanceSheet totalProperty={totalProperty} />
          </div>
        </div>
      ) : (
        <>
          <HistoryReport></HistoryReport>
        </>
      )}

      {reportVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 px-2">
          <div className="h-auto w-full max-w-6xl rounded-lg bg-white p-6 shadow-lg md:h-[720px]">
            <div className="mb-4">
              <div className="mb-2 flex justify-between">
                <h2 className="text-2xl font-bold">生成報表 - 步驟 {step}/5</h2>
                {alertMessage && (
                  <Alert
                    message={alertMessage}
                    onClose={() => setAlertMessage(null)}
                  />
                )}
                {confirmData.isOpen && (
                  <Confirm
                    message={confirmData.message}
                    onConfirm={() => {
                      confirmData.onConfirm();
                    }}
                    onCancel={() =>
                      setConfirmData({ ...confirmData, isOpen: false })
                    }
                    cancelMessage={confirmData.cancelMessage}
                    confirmMessage={confirmData.confirmMessage}
                  />
                )}
                <Button onClick={handleCloseReport}>取消</Button>
              </div>

              <div className="mb-4 flex justify-between">
                {Array.from({ length: 5 }, (_, index) => (
                  <div
                    key={index}
                    className={`mx-1 h-3 flex-1 rounded-lg ${
                      index + 1 <= step
                        ? "border-2 border-[#aaaaaa] bg-[#aaaaaa]"
                        : "border border-[#aaaaaa]"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="h-[540px] overflow-hidden rounded-lg border-2 border-gray-500">
              {renderStepContent()}
            </div>

            <div className="mt-6 flex justify-between">
              <Button
                onClick={handlePreviousStep}
                variant="prevstep"
                disabled={step === 1 || step === 4 || step === 5}
              >
                上一步
              </Button>
              {step === 5 ? (
                <Button onClick={handleComplete} variant="retain">
                  結束健檢分析
                </Button>
              ) : (
                <Button
                  onClick={handleNextStep}
                  variant="retain"
                  disabled={step === 5}
                >
                  下一步
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

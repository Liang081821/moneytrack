import MonthlyData from "../Analysis/MonthlyData";
import BalanceSheet from "../Analysis/BalanceSheet";
import Alert from "@/components/Alert";
import Confirm from "@/components/Confirm";

import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";

export default function Report() {
  const [reportVisible, setReportVisible] = useState(false);
  const [step, setStep] = useState(1);

  const [monthexpense, setmonthExpense] = useState(0);
  const [monthincome, setmonthIncome] = useState(0);
  const [expenseRecords, setExpenseRecords] = useState({});

  //step4 回傳
  const [totalProperty, setTotalProperty] = useState(0);
  const [savingRate, setSavingRate] = useState(0);

  //MothlyData
  const [expenseTotals, setExpenseTotals] = useState({});
  const [incomeTotals, setIncomeTotals] = useState({});
  const [netWorth, setNetWorth] = useState(0);

  const [selectedHouseCategory, setSelectedHouseCategory] = useState("");
  const [selectedInsureCategory, setSelectedInsureCategory] = useState("");

  //chatGpt
  const [preText, setPreText] = useState("");
  const handleAddReport = () => {
    setReportVisible(true);
  };

  const [alertMessage, setAlertMessage] = useState(null);
  const [confirmData, setConfirmData] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

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
          console.log("報表生成中...");
          setConfirmData({ ...confirmData, isOpen: false });
          setStep((prevStep) => prevStep + 1);
        },
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
    <div className="flex w-full flex-col items-center">
      <button
        onClick={() => handleAddReport()}
        className="md:w-25 fixed right-0 top-40 z-10 w-24 overflow-hidden rounded-xl bg-[#607196] p-1 text-sm text-white transition-all md:p-2 md:text-base"
      >
        我要進行分析
      </button>

      <div className="mx-auto flex w-[90%] flex-col justify-center gap-3 md:flex-row">
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
        <BalanceSheet />
      </div>
      {/* 步驟導航 */}
      {reportVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="h-[720px] w-full max-w-6xl rounded-lg bg-white p-6 shadow-lg">
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
                  />
                )}
                <button
                  onClick={handleCloseReport}
                  className="rounded-xl bg-[#89023E] px-4 py-2 text-white transition duration-200 hover:bg-[#CC7178]"
                >
                  關閉
                </button>
              </div>

              {/* 步驟指示器 */}
              <div className="mb-4 flex justify-between">
                {Array.from({ length: 5 }, (_, index) => (
                  <div
                    key={index}
                    className={`mx-1 h-2 flex-1 rounded-full ${
                      index + 1 <= step
                        ? "border-2 border-gray-500 bg-gray-500"
                        : "border border-gray-500"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* 步驟內容 */}
            <div className="h-[540px] rounded-xl border-2 border-gray-500">
              {renderStepContent()}
            </div>

            {/* 步驟導航按鈕 */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePreviousStep}
                className="rounded-xl bg-gray-200 p-2"
                disabled={step === 1 || step === 4 || step === 5}
              >
                上一步
              </button>
              {step === 5 ? (
                <button
                  onClick={handleComplete}
                  className="rounded-xl bg-[#607196] p-2 text-white"
                >
                  結束健檢分析
                </button>
              ) : (
                <button
                  onClick={handleNextStep}
                  className="rounded-xl bg-[#607196] p-2 text-white"
                  disabled={step === 5}
                >
                  下一步
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

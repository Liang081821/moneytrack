import MonthlyData from "../Analysis/MonthlyData";
import BalanceSheet from "../Analysis/BalanceSheet";

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

  //MothlyData
  const [expenseTotals, setExpenseTotals] = useState({});
  const [incomeTotals, setIncomeTotals] = useState({});
  const [netWorth, setNetWorth] = useState(0);

  const [selectedHouseCategory, setSelectedHouseCategory] = useState("");
  const [selectedInsureCategory, setSelectedInsureCategory] = useState("");

  const handleAddReport = () => {
    setReportVisible(true);
  };

  const handleNextStep = () => {
    if (step === 2) {
      if (!selectedHouseCategory || !selectedInsureCategory) {
        alert("請選擇房屋類別和保險類別才能進入下一步！");
        return;
      }
    }
    if (step === 3) {
      const confirmed = window.confirm("即將生成報表，確認後不可返回");
      if (!confirmed) {
        return;
      }
    }
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleCloseReport = () => {
    setReportVisible(false);
    setStep(1);
    setSelectedHouseCategory("");
    setSelectedInsureCategory("");
  };

  const handleComplete = () => {
    setReportVisible(false);
    setStep(1);
    setSelectedHouseCategory("");
    setSelectedInsureCategory("");
    alert("完成本月分析");
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
          />
        );
      case 5:
        return <Step5 />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-7 flex w-full flex-col items-center">
      <button
        onClick={() => handleAddReport()}
        className="mx-3 mb-3 flex h-[48px] w-[150px] items-center justify-center self-end rounded-2xl border bg-gradient-to-r from-[#3E79E5] to-[#01B8E3] text-white"
      >
        生成上月報表
      </button>
      <div className="mt-14 flex w-full justify-center">
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
                <button
                  onClick={handleCloseReport}
                  className="rounded-full bg-red-500 p-2 text-white"
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
                      index + 1 <= step ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* 步驟內容 */}
            <div className="h-[540px] rounded-xl border border-black">
              {renderStepContent()}
            </div>

            {/* 步驟導航按鈕 */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePreviousStep}
                className="rounded-md bg-gray-200 p-2"
                disabled={step === 1 || step === 4}
              >
                上一步
              </button>
              {step === 5 ? (
                <button
                  onClick={handleComplete}
                  className="rounded-md bg-green-500 p-2 text-white"
                >
                  完成
                </button>
              ) : (
                <button
                  onClick={handleNextStep}
                  className="rounded-md bg-blue-500 p-2 text-white"
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

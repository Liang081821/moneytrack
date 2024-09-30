import { useGlobalContext } from "@/context/GlobalContext";
import { useState } from "react";

export default function HistoryReport() {
  const { reportData } = useGlobalContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < reportData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!reportData || reportData.length === 0) {
    return (
      <div className="mb-4 mt-4 flex w-full items-center justify-center rounded-lg border bg-slate-500 p-6 text-white opacity-40">
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
        <p>無歷史報告數據</p>
      </div>
    );
  }

  const currentReport = reportData[currentIndex] || {};

  return (
    <div className="mt-3 w-full">
      <div className="mx-auto mb-4 w-full rounded-xl bg-white p-6 shadow-md">
        <h3 className="mb-6 text-center font-semibold">
          {currentReport.reportMonth.year} 年 {currentReport.reportMonth.month}{" "}
          月 報告
        </h3>

        {/* 卡片風格報表 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-[#F4E9CD] p-4 shadow-sm">
            <h4 className="text-base font-semibold">建議緊急備用金</h4>
            <p className="text-xl font-bold">
              {currentReport.emergynumberrecommend || "N/A"}
            </p>
          </div>

          <div className="rounded-lg bg-[#F4E9CD] p-4 shadow-sm">
            <h4 className="text-base font-semibold">房租率</h4>
            <p className="text-xl font-bold">
              {currentReport.houseingRate || "N/A"}%
            </p>
          </div>

          <div className="rounded-lg bg-[#E8E9ED] p-4 shadow-sm">
            <h4 className="text-base font-semibold">保險率</h4>
            <p className="text-xl font-bold">
              {currentReport.insureRate || "N/A"}%
            </p>
          </div>

          <div className="rounded-lg bg-[#E8E9ED] p-4 shadow-sm">
            <h4 className="text-base font-semibold">每月支出</h4>
            <p className="text-xl font-bold">
              {currentReport.monthexpense || "N/A"}
            </p>
          </div>

          <div className="rounded-lg bg-[#F4E9CD] p-4 shadow-sm">
            <h4 className="text-base font-semibold">每月收入</h4>
            <p className="text-xl font-bold">
              {currentReport.monthincome || "N/A"}
            </p>
          </div>

          <div className="rounded-lg bg-[#F4E9CD] p-4 shadow-sm">
            <h4 className="text-base font-semibold">淨收入</h4>
            <p className="text-xl font-bold">{currentReport.net || "N/A"}</p>
          </div>

          <div className="rounded-lg bg-[#E8E9ED] p-4 shadow-sm">
            <h4 className="text-base font-semibold">儲蓄率</h4>
            <p className="text-xl font-bold">
              {currentReport.savingRate || "N/A"}%
            </p>
          </div>

          <div className="rounded-lg bg-[#E8E9ED] p-4 shadow-sm">
            <h4 className="text-base font-semibold">總資產</h4>
            <p className="text-xl font-bold">
              {currentReport.totalProperty || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* 翻頁按鈕區域 */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="rounded bg-blue-500 px-2 py-2 text-sm text-white disabled:bg-gray-300 md:px-4 md:text-base"
        >
          上一頁
        </button>

        <span className="text-sm md:text-base">
          第{currentIndex + 1}頁 / 共{reportData.length}頁
        </span>

        <button
          onClick={handleNext}
          disabled={currentIndex === reportData.length - 1}
          className="rounded bg-blue-500 px-2 py-2 text-sm text-white disabled:bg-gray-300 md:px-4 md:text-base"
        >
          下一頁
        </button>
      </div>
    </div>
  );
}

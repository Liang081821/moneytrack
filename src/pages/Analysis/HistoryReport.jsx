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
    <div className="mx-auto mt-3 w-[90%]">
      <div className="mx-auto mb-4 w-full rounded-xl border-2 border-gray-500 bg-white p-6 shadow-md">
        <h3 className="mb-6 text-center text-xl font-semibold">
          {currentReport.reportMonth.year} 年 {currentReport.reportMonth.month}
          月 報告
        </h3>

        {/* 卡片風格報表 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-[#BABFD1] p-4 shadow-sm">
            <h4 className="text-lg font-semibold">建議緊急備用金</h4>
            <p className="text-xl">
              NT$
              {currentReport.emergynumberrecommend.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }) || "無數據"}
            </p>
          </div>

          <div className="rounded-lg bg-[#BABFD1] p-4 shadow-sm">
            <h4 className="text-lg font-semibold">房租率</h4>
            <p className="text-xl">{currentReport.houseingRate || "無數據"}%</p>
          </div>

          <div className="rounded-lg bg-[#E8E9ED] p-4 shadow-sm">
            <h4 className="text-lg font-semibold">保險率</h4>
            <p className="text-xl">{currentReport.insureRate || "無數據"}%</p>
          </div>

          <div className="rounded-lg bg-[#E8E9ED] p-4 shadow-sm">
            <h4 className="text-lg font-semibold">每月支出</h4>
            <p className="text-xl">
              NT$
              {currentReport.monthexpense.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }) || "無數據"}
            </p>
          </div>

          <div className="rounded-lg bg-[#BABFD1] p-4 shadow-sm">
            <h4 className="text-lg font-semibold">每月收入</h4>
            <p className="text-xl">
              NT$
              {currentReport.monthincome.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }) || "無數據"}
            </p>
          </div>

          <div className="rounded-lg bg-[#BABFD1] p-4 shadow-sm">
            <h4 className="text-lg font-semibold">淨收入</h4>
            <p className="text-xl">
              NT$
              {currentReport.net.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }) || "N/A"}
            </p>
          </div>

          <div className="rounded-lg bg-[#E8E9ED] p-4 shadow-sm">
            <h4 className="text-lg font-semibold">儲蓄率</h4>
            <p className="text-xl">{currentReport.savingRate || "無數據"}%</p>
          </div>

          <div className="rounded-lg bg-[#E8E9ED] p-4 shadow-sm">
            <h4 className="text-lg font-semibold">總資產</h4>
            <p className="text-xl">
              NT$
              {currentReport.totalProperty.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }) || "無數據"}
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

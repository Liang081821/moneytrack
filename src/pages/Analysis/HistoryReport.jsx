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
      <div className="mb-4 mt-4 flex w-[840px] items-center justify-center rounded-lg border bg-slate-500 p-6 text-white opacity-40">
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
        <p>無歷史報告數據，等待解鎖...</p>
      </div>
    );
  }

  const currentReport = reportData[currentIndex] || {};

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="mb-4 w-[840px] rounded-lg border border-black p-6">
        <h3 className="mb-4 text-center text-3xl font-bold text-[#468189]">
          {currentReport.reportMonth.year} 年 {currentReport.reportMonth.month}
          月 報告
        </h3>

        {/* 卡片風格報表 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-blue-100 p-4 shadow">
            <h4 className="text-lg font-semibold">建議緊急備用金</h4>
            <p className="text-2xl font-bold">
              {currentReport.emergynumberrecommend || "N/A"}
            </p>
          </div>

          <div className="rounded-lg bg-red-100 p-4 shadow">
            <h4 className="text-lg font-semibold">房租率</h4>
            <p className="text-2xl font-bold">
              {currentReport.houseingRate || "N/A"}%
            </p>
          </div>

          <div className="rounded-lg bg-green-100 p-4 shadow">
            <h4 className="text-lg font-semibold">保險率</h4>
            <p className="text-2xl font-bold">
              {currentReport.insureRate || "N/A"}%
            </p>
          </div>

          <div className="rounded-lg bg-yellow-100 p-4 shadow">
            <h4 className="text-lg font-semibold">每月支出</h4>
            <p className="text-2xl font-bold">
              {currentReport.monthexpense || "N/A"}
            </p>
          </div>

          <div className="rounded-lg bg-purple-100 p-4 shadow">
            <h4 className="text-lg font-semibold">每月收入</h4>
            <p className="text-2xl font-bold">
              {currentReport.monthincome || "N/A"}
            </p>
          </div>

          <div className="rounded-lg bg-indigo-100 p-4 shadow">
            <h4 className="text-lg font-semibold">淨收入</h4>
            <p className="text-2xl font-bold">{currentReport.net || "N/A"}</p>
          </div>

          <div className="rounded-lg bg-pink-100 p-4 shadow">
            <h4 className="text-lg font-semibold">儲蓄率</h4>
            <p className="text-2xl font-bold">
              {currentReport.savingRate || "N/A"}%
            </p>
          </div>

          <div className="rounded-lg bg-teal-100 p-4 shadow">
            <h4 className="text-lg font-semibold">總資產</h4>
            <p className="text-2xl font-bold">
              {currentReport.totalProperty || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* 修正的翻頁按鈕區域，頁碼從 1 開始 */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
        >
          上一頁
        </button>

        <span>
          第 {currentIndex + 1} 頁 / 共 {reportData.length} 頁
        </span>

        <button
          onClick={handleNext}
          disabled={currentIndex === reportData.length - 1}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
        >
          下一頁
        </button>
      </div>
    </div>
  );
}

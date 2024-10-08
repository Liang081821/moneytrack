import { useGlobalContext } from "@/context/GlobalContext";
import { useState } from "react";
import Button from "@/components/Button";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

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
      <div className="mb-4 mt-4 flex h-[70vh] w-full items-center justify-center rounded-lg border bg-slate-500 p-6 text-white opacity-40">
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

  const renderDoughnutChart = (label, value) => {
    const data = {
      labels: [label, ""],
      datasets: [
        {
          data: [value, 100 - value],
          backgroundColor: ["#9DBEBB", "#d6d6d6"],
          hoverBackgroundColor: ["#9DBEBB", "#eeeeee"],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      cutout: "60%",
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.label}: ${tooltipItem.raw}%`;
            },
          },
        },
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
          color: "#333",
          font: {
            weight: "bold",
            size: 16,
          },
          formatter: (value) => `${value}`,
        },
      },
    };

    return <Doughnut data={data} options={options} />;
  };
  const stackedBarData = {
    labels: ["財務狀況"],
    datasets: [
      {
        label: "每月收入",
        data: [currentReport.monthincome || 0],
        backgroundColor: "#9DBEBB",
      },
      {
        label: "每月支出",
        data: [currentReport.monthexpense || 0],
        backgroundColor: "#E8E9ED",
      },
      {
        label: "淨收入",
        data: [currentReport.net || 0],
        backgroundColor: "#BABFD1",
      },
    ],
  };

  const stackedBarOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
        ticks: {
          font: {
            size: 16,
          },
        },
      },
      x: {
        stacked: true,
        ticks: {
          font: {
            size: 16,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        color: "#333",
        font: {
          weight: "bold",
          size: 18,
        },
        formatter: (value) => `NT$${value}`,
      },
    },
  };
  const emergencyFund = currentReport.emergynumberrecommend || 0;
  const totalProperty = currentReport.totalProperty || 0;

  const data = {
    labels: ["建議緊急備用金", "總資產"],
    datasets: [
      {
        label: "NT$",
        data: [emergencyFund, totalProperty],
        backgroundColor: ["#BABFD1", "#E8E9ED"],
        borderColor: ["#A0A6B0", "#D1D3D6"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    layout: {
      padding: {
        right: 120, // 增加右邊距
      },
    },
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 16,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 16,
          },
        },
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "#333",
        font: {
          weight: "bold",
          size: 16,
        },
        anchor: "end",
        align: "right",
        clip: false,
        offset: 10,
        formatter: (value) => `NT$${value}`,
      },
    },
  };
  return (
    <div className="mb-[5vh] w-full">
      <div className="mx-auto mb-4 flex w-full flex-col gap-3">
        <div className="rounded-lg bg-[#fcfcfc] shadow-lg">
          <h3 className="p-7 text-center text-xl font-semibold">
            {currentReport.reportMonth.year} 年{" "}
            {currentReport.reportMonth.month} 月分析結果
          </h3>

          <div className="flex w-full gap-3 p-7">
            {/* 房租率圖表 */}
            <div className="relative flex w-full items-center justify-center">
              <div className="absolute">
                <h4 className="text-center text-lg font-semibold">房租率</h4>
                <p className="text-3xl font-semibold text-[#9DBEBB]">
                  {isNaN(currentReport.houseingRate)
                    ? "無數據"
                    : `${currentReport.houseingRate}%`}
                </p>
              </div>
              <div className="mx-auto h-56 w-56">
                {renderDoughnutChart(
                  "房租率",
                  isNaN(currentReport.houseingRate)
                    ? 0
                    : currentReport.houseingRate,
                )}
              </div>
            </div>
            <div className="relative flex w-full items-center justify-center">
              <div className="absolute">
                <h4 className="text-center text-lg font-semibold">保險率</h4>
                <p className="text-3xl font-semibold text-[#9DBEBB]">
                  {isNaN(currentReport.insureRate)
                    ? "無數據"
                    : `${currentReport.insureRate}%`}
                </p>
              </div>
              <div className="mx-auto h-56 w-56">
                {renderDoughnutChart(
                  "房租率",
                  isNaN(currentReport.insureRate)
                    ? 0
                    : currentReport.insureRate,
                )}
              </div>
            </div>

            {/* 儲蓄率圖表 */}
            <div className="relative flex w-full items-center justify-center">
              <div className="absolute">
                {" "}
                <h4 className="text-center text-lg font-semibold">儲蓄率</h4>
                <p className="text-3xl font-semibold text-[#9DBEBB]">
                  {isNaN(currentReport.savingRate)
                    ? "無數據"
                    : currentReport.savingRate > 30
                      ? `${currentReport.savingRate}%`
                      : currentReport.savingRate < 0
                        ? "支出超支"
                        : currentReport.savingRate > 0
                          ? `${currentReport.savingRate}%`
                          : ""}
                </p>
              </div>
              <div className="mx-auto h-56 w-56">
                {renderDoughnutChart(
                  "儲蓄率",
                  isNaN(currentReport.savingRate)
                    ? 0
                    : currentReport.savingRate > 30
                      ? currentReport.savingRate
                      : currentReport.savingRate < 0
                        ? 0
                        : currentReport.savingRate,
                )}
              </div>
            </div>
          </div>
        </div>
        {/* 堆疊條形圖 */}
        <div className="flex w-full gap-3">
          <div className="flex w-full flex-col rounded-lg bg-[#fcfcfc] p-7 shadow-lg">
            <h4 className="mb-14 text-center text-xl font-semibold">
              收支概況
            </h4>
            <div className="flex justify-center lg:h-auto">
              <Bar data={stackedBarData} options={stackedBarOptions} />
            </div>
          </div>

          <div className="flex w-full flex-col rounded-lg bg-[#fcfcfc] p-7 shadow-lg">
            <h4 className="mb-14 text-center text-xl font-semibold">
              財務數據
            </h4>
            <div className="flex justify-center lg:h-auto">
              <Bar data={data} options={options} />
            </div>
          </div>
        </div>
      </div>

      {/* 翻頁按鈕區域 */}
      <div className="mt-4 flex items-center justify-between">
        <Button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          variant="grey"
          className="disabled:bg-gray-300 disabled:text-white"
        >
          上一頁
        </Button>

        <span className="text-sm md:text-base">
          第{currentIndex + 1}頁 / 共{reportData.length}頁
        </span>

        <Button
          onClick={handleNext}
          disabled={currentIndex === reportData.length - 1}
          variant="retain"
          className="disabled:bg-gray-300"
        >
          下一頁
        </Button>
      </div>
    </div>
  );
}

import { Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useGlobalContext } from "@/context/GlobalContext";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
// import { color } from "framer-motion";

Chart.register(...registerables, ChartDataLabels);

export default function IncomePieChart({
  firstDayOfSelectedMonth,
  lastDayOfSelectedMonth,
}) {
  const { transactionData, setAccounting } = useGlobalContext();
  const [incomeRecord, setIncomeRecord] = useState([]);

  useEffect(() => {
    const fetchRecords = () => {
      try {
        const filteredTransactions = transactionData.filter((transaction) => {
          const isIncome = transaction.record_type === "收入";

          const transactionTime = transaction.time.toDate();
          const isInDateRange =
            transactionTime >= firstDayOfSelectedMonth &&
            transactionTime <= lastDayOfSelectedMonth;

          return isIncome && isInDateRange;
        });

        const incomeGroupedTotals = filteredTransactions.reduce(
          (acc, record) => {
            const { class: recordClass, convertedAmountTWD } = record;
            if (!acc[recordClass]) {
              acc[recordClass] = 0;
            }
            acc[recordClass] += convertedAmountTWD;
            return acc;
          },
          {},
        );

        const pieChartData = Object.entries(incomeGroupedTotals).map(
          ([key, value]) => ({
            label: key,
            value: value,
          }),
        );

        setIncomeRecord(pieChartData);
      } catch (e) {
        console.error("查詢錯誤：", e);
      }
    };

    fetchRecords();
  }, [transactionData, firstDayOfSelectedMonth, lastDayOfSelectedMonth]);

  IncomePieChart.propTypes = {
    firstDayOfSelectedMonth: PropTypes.instanceOf(Date).isRequired,
    lastDayOfSelectedMonth: PropTypes.instanceOf(Date).isRequired,
  };

  if (incomeRecord.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border bg-slate-500 p-6 text-white opacity-40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="mb-2 mr-2 size-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
        <p onClick={() => setAccounting(true)} className="cursor-pointer">
          開始記帳，即可觀看收入圖表
        </p>
      </div>
    );
  }

  // const getContrastColor = (hexColor) => {
  //   // 去掉 # 號
  //   hexColor = hexColor.replace("#", "");

  //   // 將 3 位數的顏色代碼擴展為 6 位數
  //   if (hexColor.length === 3) {
  //     hexColor = hexColor
  //       .split("")
  //       .map((hex) => hex + hex)
  //       .join("");
  //   }

  //   // 將 RGB 值提取出來
  //   const r = parseInt(hexColor.substring(0, 2), 16);
  //   const g = parseInt(hexColor.substring(2, 4), 16);
  //   const b = parseInt(hexColor.substring(4, 6), 16);

  //   // 計算亮度值
  //   const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  //   // 根據亮度選擇黑色或白色
  //   return brightness > 128 ? "black" : "white";
  // };

  const data = {
    labels: incomeRecord.map((record) => record.label),
    datasets: [
      {
        data: incomeRecord.map((record) => record.value),
        backgroundColor: [
          "#9dbebb",
          "#e8e9ed",
          "#babfd1",
          "#d6d6d6",
          "#A7CCED",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    layout: {
      padding: {
        right: 75,
        left: 75,
      },
    },
    maintainAspectRatio: true,
    responsive: true,
    devicePixelRatio: window.devicePixelRatio,
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            const total = tooltipItem.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0,
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `金額: $${value} (${percentage}%)`;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 18,
        },
        bodyFont: {
          size: 16,
        },
        titleColor: "#fff",
        bodyColor: "#fff",
      },
      datalabels: {
        anchor: "end",
        align: "end",

        font: {
          color: "#333",
          size: 16,
          weight: "bold",
        },
        offset: 10,
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (a, b) => a + b,
            0,
          );
          const percentage = (value / total) * 100;

          return percentage < 5
            ? ""
            : `${context.chart.data.labels[context.dataIndex]}\n$${value.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                },
              )}`;
        },
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="flex flex-1 items-center justify-center rounded-lg p-4">
      <div className="flex w-[300px] justify-center lg:w-[400px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

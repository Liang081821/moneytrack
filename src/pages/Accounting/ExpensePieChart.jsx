import { Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useGlobalContext } from "@/context/GlobalContext";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(...registerables, ChartDataLabels);

export default function ExpensePieChart({
  firstDayOfSelectedMonth,
  lastDayOfSelectedMonth,
}) {
  const { transactionData } = useGlobalContext();
  const [expenseRecord, setExpenseRecord] = useState([]);

  useEffect(() => {
    const fetchRecords = () => {
      try {
        const filteredTransactions = transactionData.filter((transaction) => {
          const isExpense = transaction.record_type === "支出";

          const transactionTime = transaction.time.toDate();
          const isInDateRange =
            transactionTime >= firstDayOfSelectedMonth &&
            transactionTime <= lastDayOfSelectedMonth;

          return isExpense && isInDateRange;
        });

        const expenseGroupedTotals = filteredTransactions.reduce(
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

        const pieChartData = Object.entries(expenseGroupedTotals).map(
          ([key, value]) => ({
            label: key,
            value: value,
          }),
        );

        setExpenseRecord(pieChartData);
      } catch (e) {
        console.error("查詢錯誤：", e);
      }
    };

    fetchRecords();
  }, [transactionData, firstDayOfSelectedMonth, lastDayOfSelectedMonth]);

  ExpensePieChart.propTypes = {
    firstDayOfSelectedMonth: PropTypes.instanceOf(Date).isRequired,
    lastDayOfSelectedMonth: PropTypes.instanceOf(Date).isRequired,
  };

  if (expenseRecord.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg bg-slate-500 p-6 text-white opacity-40">
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
        <p>計入本月支出，即可觀看分析圖表</p>
      </div>
    );
  }

  const getContrastColor = (hexColor) => {
    // 去掉 # 號
    hexColor = hexColor.replace("#", "");

    // 將 3 位數的顏色代碼擴展為 6 位數
    if (hexColor.length === 3) {
      hexColor = hexColor
        .split("")
        .map((hex) => hex + hex)
        .join("");
    }

    // 將 RGB 值提取出來
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    // 計算亮度值
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // 根據亮度選擇黑色或白色
    return brightness > 128 ? "black" : "white";
  };

  const data = {
    labels: expenseRecord.map((record) => record.label),
    datasets: [
      {
        data: expenseRecord.map((record) => record.value),
        backgroundColor: [
          "#304D6D",
          "#A7CCED",
          "#63ADF2",
          "#82A0BC",
          "#545E75",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
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
        anchor: "center",
        align: "center",
        color: (context) => {
          const backgroundColor =
            context.dataset.backgroundColor[context.dataIndex];
          return getContrastColor(backgroundColor);
        },
        font: {
          size: 18,
          weight: "bold",
        },
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (a, b) => a + b,
            0,
          );
          const percentage = (value / total) * 100;

          return percentage < 5
            ? ""
            : `${context.chart.data.labels[context.dataIndex]}: $${value.toLocaleString(
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
    <div className="flex flex-1 items-center justify-center rounded-lg bg-white p-4 shadow-lg">
      <div className="flex w-[300px] justify-center lg:w-[400px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

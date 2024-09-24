import { Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useGlobalContext } from "@/context/GlobalContext";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // 引入插件

Chart.register(...registerables, ChartDataLabels); // 注册插件

export default function IncomePieChart({
  firstDayOfLastMonth,
  lastDayOfLastMonth,
}) {
  const { transactionData } = useGlobalContext();
  const [incomeRecord, setIncomeRecord] = useState([]);

  useEffect(() => {
    const fetchRecords = () => {
      try {
        const filteredTransactions = transactionData.filter((transaction) => {
          const isIncome = transaction.record_type === "收入";

          const transactionTime = transaction.time.toDate();
          const isInDateRange =
            transactionTime >= firstDayOfLastMonth &&
            transactionTime <= lastDayOfLastMonth;

          return isIncome && isInDateRange;
        });

        const incomeGroupedTotals = filteredTransactions.reduce(
          (acc, record) => {
            const { class: recordClass, amount } = record;
            if (!acc[recordClass]) {
              acc[recordClass] = 0;
            }
            acc[recordClass] += amount;
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
  }, [transactionData, firstDayOfLastMonth, lastDayOfLastMonth]);

  IncomePieChart.propTypes = {
    firstDayOfLastMonth: PropTypes.instanceOf(Date).isRequired,
    lastDayOfLastMonth: PropTypes.instanceOf(Date).isRequired,
  };

  if (incomeRecord.length === 0) {
    return (
      <div className="flex h-[450px] w-[500px] items-center justify-center rounded-lg border bg-slate-500 p-6 text-white opacity-40">
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
        <p>計入本月收入，解鎖分析圖表</p>
      </div>
    );
  }

  const data = {
    labels: incomeRecord.map((record) => record.label),
    datasets: [
      {
        data: incomeRecord.map((record) => record.value),
        backgroundColor: [
          "#E8E9ED",
          "#9DBEBB",
          "#F4E9CD",
          "#8BB174",
          "#468189",
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
          size: 16,
        },
        bodyFont: {
          size: 14,
        },
        titleColor: "#fff",
        bodyColor: "#fff",
      },
      datalabels: {
        anchor: "center",
        align: "center",
        color: "black",
        font: {
          size: 14,
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
            : `${context.chart.data.labels[context.dataIndex]}: $${value}`;
        },
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="flex h-[450px] w-[500px] flex-col items-center rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      <div className="text-base font-medium">本月收入分佈</div>
      <div className="flex h-full w-full justify-center p-10">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

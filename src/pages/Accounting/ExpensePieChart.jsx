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
        <p>計入本月支出，解鎖分析圖表</p>
      </div>
    );
  }

  const data = {
    labels: expenseRecord.map((record) => record.label),
    datasets: [
      {
        data: expenseRecord.map((record) => record.value),
        backgroundColor: [
          "#9DBEBB",
          "#F4E9CD",
          "#8BB174",
          "#468189",
          "#E8E9ED",
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
        anchor: "center", // 修改为 "center"
        align: "center", // 修改为 "center"
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

          // 如果百分比小于 5，则返回空字符串，仍然占据位置
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
    <div className="flex flex-1 items-center justify-center rounded-xl bg-white p-4 shadow-lg">
      <div className="flex w-[300px] justify-center lg:w-[400px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

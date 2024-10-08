import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default function BarChart({
  firstDayOfSelectedMonth,
  lastDayOfSelectedMonth,
}) {
  const { transactionData } = useGlobalContext();
  const [dailyExpenses, setDailyExpenses] = useState([]);

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

        const expensesByDate = filteredTransactions.reduce(
          (acc, transaction) => {
            const dateKey = transaction.time
              .toDate()
              .toLocaleDateString("zh-TW");
            if (!acc[dateKey]) {
              acc[dateKey] = 0;
            }
            acc[dateKey] += transaction.convertedAmountTWD;
            return acc;
          },
          {},
        );

        const formattedData = Object.entries(expensesByDate)
          .map(([date, amount]) => ({
            x: new Date(date).toLocaleDateString("zh-TW", {
              month: "numeric",
              day: "numeric",
            }),
            y: amount,
          }))
          .sort((a, b) => new Date(a.x) - new Date(b.x));

        setDailyExpenses(formattedData);
      } catch (e) {
        console.error("查詢錯誤：", e);
      }
    };

    fetchRecords();
  }, [transactionData, firstDayOfSelectedMonth, lastDayOfSelectedMonth]);

  BarChart.propTypes = {
    firstDayOfSelectedMonth: PropTypes.instanceOf(Date).isRequired,
    lastDayOfSelectedMonth: PropTypes.instanceOf(Date).isRequired,
  };

  if (dailyExpenses.length === 0) {
    return (
      <div className="flex w-full flex-1 items-center justify-center rounded-lg border bg-slate-500 p-6 text-white opacity-40">
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
        <p>計入本月支出，即可觀看支出變化圖表</p>
      </div>
    );
  }

  const data = {
    labels: dailyExpenses.map((entry) => entry.x),
    datasets: [
      {
        label: "每日支出 (NT$)",
        data: dailyExpenses.map((entry) => entry.y),
        fill: false,
        borderColor: "#babfd1",
        borderWidth: 3,
        backgroundColor: "#304D6D",
        pointRadius: 5,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `NT$ ${context.parsed.y}`;
          },
        },
        titleFont: {
          size: 18,
        },
        bodyFont: {
          size: 16,
        },
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: true,
        color: "black",
        backgroundColor: "#e8e9ed",
        borderRadius: 4,
        padding: 6,
        font: {
          size: 16,
          weight: "bold",
        },
        anchor: "end", // 將標籤錨點設置在數據點的上方或下方
        align: "top", // 將標籤對齊到數據點的上方
        offset: 10,
        formatter: (value) => ` NT$ ${value}`,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          enabled: true,
          mode: "x",
          speed: 0.1,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "日期",
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          font: {
            size: 16,
          },
        },
        grid: {
          drawBorder: false,
          offset: true,
        },
      },
      y: {
        title: {
          display: true,
          text: "支出 (NT$)",
        },
        beginAtZero: true,
        ticks: {
          font: {
            size: 16,
          },
        },
      },
    },
    layout: {
      padding: {
        right: 60,
      },
    },
  };

  return (
    <div className="flex flex-1 items-center justify-center rounded-lg p-4">
      <div className="w-full overflow-x-auto">
        <div className="h-[400px] min-w-[800px]">
          <Line
            data={data}
            options={options}
            plugins={[ChartDataLabels, zoomPlugin]}
          />
        </div>
      </div>
    </div>
  );
}

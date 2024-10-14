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
  const { transactionData, setAccounting } = useGlobalContext();
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
          className="mb-2 mr-2 size-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
        <p onClick={() => setAccounting(true)} className="cursor-pointer">
          前往記帳，即可觀看支出變化圖表
        </p>
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
        formatter: (value) =>
          ` NT$ ${value.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}`,
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
        top: 40,
      },
    },
  };

  return (
    <div className="flex flex-1 items-center justify-center rounded-lg p-4">
      <div className="w-full overflow-x-auto">
        <div
          className="h-[400px]"
          style={{ width: `${dailyExpenses.length * 100}px` }}
        >
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

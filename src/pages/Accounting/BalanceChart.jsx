import { Doughnut } from "react-chartjs-2";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useGlobalContext } from "@/context/GlobalContext";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function BalanceDoughnutChart({
  firstDayOfSelectedMonth,
  lastDayOfSelectedMonth,
}) {
  const { transactionData, setAccounting } = useGlobalContext();
  const [balanceData, setBalanceData] = useState([]);
  const [surplus, setSurplus] = useState(0);
  const [incomeRecord, setIncomeRecord] = useState();
  const [expenseRecord, setExpenseRecord] = useState();

  useEffect(() => {
    const fetchBalanceData = () => {
      try {
        const filteredTransactions = transactionData.filter((transaction) => {
          const transactionTime = transaction.time.toDate();
          return (
            transactionTime >= firstDayOfSelectedMonth &&
            transactionTime <= lastDayOfSelectedMonth
          );
        });

        const totalIncome = filteredTransactions
          .filter((transaction) => transaction.record_type === "收入")
          .reduce((acc, record) => acc + record.convertedAmountTWD, 0);
        setIncomeRecord(totalIncome);

        const totalExpense = filteredTransactions
          .filter((transaction) => transaction.record_type === "支出")
          .reduce((acc, record) => acc + record.convertedAmountTWD, 0);
        setExpenseRecord(totalExpense);

        const surplusValue = totalIncome - totalExpense;
        setSurplus(surplusValue);

        const chartData = [
          { label: "收入", value: totalIncome },
          { label: "支出", value: totalExpense },
        ];

        setBalanceData(chartData);
      } catch (e) {
        console.error("查詢錯誤：", e);
      }
    };

    fetchBalanceData();
  }, [transactionData, firstDayOfSelectedMonth, lastDayOfSelectedMonth]);

  BalanceDoughnutChart.propTypes = {
    firstDayOfSelectedMonth: PropTypes.instanceOf(Date).isRequired,
    lastDayOfSelectedMonth: PropTypes.instanceOf(Date).isRequired,
  };

  if (
    (incomeRecord === 0 || incomeRecord === undefined) &&
    (expenseRecord === 0 || expenseRecord === undefined)
  ) {
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
          前往記帳，即可觀看本月盈餘
        </p>
      </div>
    );
  }

  const data = {
    labels: balanceData.map((record) => record.label),
    datasets: [
      {
        data: balanceData.map((record) => record.value),
        backgroundColor: ["#9DBEBB", "#d6d6d6"],
        hoverBackgroundColor: ["#9DBEBB", "#eeeeee"],
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
    cutout: "60%",
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const total = tooltipItem.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0,
            );
            const percentage = ((tooltipItem.raw / total) * 100).toFixed(1);
            const value = tooltipItem.raw;

            return `${tooltipItem.label}: $${value.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })} (${percentage}%)`;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
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
        anchor: "end",
        align: "end",
        offset: 10,

        font: {
          color: "#333",
          size: 16,
          weight: "bold",
        },
        formatter: (value, context) => {
          if (value === 0) {
            return "";
          }
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}\n$${value.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}`;
        },
      },
    },
  };

  return (
    <div className="flex flex-1 items-center justify-center rounded-lg p-4">
      <div className="relative flex w-[300px] items-center justify-center lg:w-[400px]">
        <Doughnut data={data} options={options} />
        {/* 在中間顯示盈餘 */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center text-center">
          <div className="text-xl font-semibold">
            月結餘 <br />$
            {surplus.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

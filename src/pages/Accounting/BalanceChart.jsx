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
  const { transactionData } = useGlobalContext();
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
          className="mb-2 h-12 w-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
        <p>無法載入數據</p>
      </div>
    );
  }

  const data = {
    labels: balanceData.map((record) => record.label),
    datasets: [
      {
        data: balanceData.map((record) => record.value),
        backgroundColor: ["#77ACA2", "#E8E9ED"],
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
          label: (tooltipItem) => {
            const total = tooltipItem.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0,
            );
            const percentage = ((tooltipItem.raw / total) * 100).toFixed(1);
            return `${tooltipItem.label}: ${percentage}%`;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
      legend: {
        display: false,
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
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}: $${value.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}`;
        },
      },
    },
  };

  return (
    <div className="flex flex-1 items-center justify-center rounded-xl bg-white p-4 shadow-lg">
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

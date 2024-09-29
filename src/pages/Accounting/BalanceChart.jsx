import { Doughnut } from "react-chartjs-2";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useGlobalContext } from "@/context/GlobalContext";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function BalanceDoughnutChart({
  firstDayOfLastMonth,
  lastDayOfLastMonth,
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
            transactionTime >= firstDayOfLastMonth &&
            transactionTime <= lastDayOfLastMonth
          );
        });

        const totalIncome = filteredTransactions
          .filter((transaction) => transaction.record_type === "收入")
          .reduce((acc, record) => acc + record.amount, 0);
        setIncomeRecord(totalIncome);

        const totalExpense = filteredTransactions
          .filter((transaction) => transaction.record_type === "支出")
          .reduce((acc, record) => acc + record.amount, 0);
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
  }, [transactionData, firstDayOfLastMonth, lastDayOfLastMonth]);

  BalanceDoughnutChart.propTypes = {
    firstDayOfLastMonth: PropTypes.instanceOf(Date).isRequired,
    lastDayOfLastMonth: PropTypes.instanceOf(Date).isRequired,
  };

  if (
    (incomeRecord === 0 || incomeRecord === undefined) &&
    (expenseRecord === 0 || expenseRecord === undefined)
  ) {
    return (
      <div className="flex h-[300px] w-[280px] items-center justify-center rounded-lg border bg-slate-500 p-6 text-white opacity-40 md:h-[450px] md:w-[500px]">
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
          return `${label}: $${value}`;
        },
      },
    },
  };

  return (
    <div className="relative flex h-[300px] w-[280px] flex-col items-center rounded-xl border border-gray-200 bg-white p-4 shadow-lg md:h-[450px] md:w-[500px]">
      <div className="text-base font-medium">本月盈餘</div>
      <div className="flex h-full w-full justify-center p-10">
        <Doughnut data={data} options={options} />
        {/* 在中間顯示盈餘 */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center pt-10 text-center">
          <div className="text-xl font-semibold">
            月結餘 <br />${surplus}
          </div>
        </div>
      </div>
    </div>
  );
}

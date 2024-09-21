import { VictoryPie } from "victory";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

export default function BalancePieChart({
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
          { x: "收入", y: totalIncome },
          { x: "支出", y: totalExpense },
        ];

        setBalanceData(chartData);
      } catch (e) {
        console.error("查詢錯誤：", e);
      }
    };

    fetchBalanceData();
  }, [transactionData, firstDayOfLastMonth, lastDayOfLastMonth]);

  BalancePieChart.propTypes = {
    firstDayOfLastMonth: PropTypes.instanceOf(Date).isRequired,
    lastDayOfLastMonth: PropTypes.instanceOf(Date).isRequired,
  };

  if (
    (incomeRecord === 0 || incomeRecord === undefined) &&
    (expenseRecord === 0 || expenseRecord === undefined)
  ) {
    return (
      <div className="flex h-[380px] w-[500px] items-center justify-center rounded-lg border bg-slate-500 p-6 text-white opacity-40">
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

  return (
    <div className="relative flex h-[380px] w-[500px] flex-col items-center rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      <div className="text-base font-medium">本月盈餘</div>
      <VictoryPie
        colorScale={["#77ACA2", "#9DBEBB"]}
        labels={({ datum }) => `${datum.x}: $${datum.y} `}
        style={{
          labels: { fontSize: 14, fontWeight: "bold" },
        }}
        data={balanceData.length > 0 ? balanceData : [{ x: "無資料", y: 1 }]}
        width={320}
        height={320}
        innerRadius={80}
      />
      {/* 在中間顯示盈餘 */}
      <div className="right-1/2flex absolute top-1/2 h-[300px] w-[300px] items-center justify-center text-center">
        <div className="text-xl font-semibold">
          月結餘 <br />${surplus}
        </div>
      </div>
    </div>
  );
}

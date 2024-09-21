import { VictoryPie } from "victory";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

export default function ExpensePieChart({
  firstDayOfLastMonth,
  lastDayOfLastMonth,
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
            transactionTime >= firstDayOfLastMonth &&
            transactionTime <= lastDayOfLastMonth;

          return isExpense && isInDateRange;
        });

        console.log(filteredTransactions);

        const expenseGroupedTotals = filteredTransactions.reduce(
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

        const pieChartData = Object.entries(expenseGroupedTotals).map(
          ([key, value]) => ({
            x: key,
            y: value,
          }),
        );
        setExpenseRecord(pieChartData);
      } catch (e) {
        console.error("查詢錯誤：", e);
      }
    };

    fetchRecords();
  }, [transactionData, firstDayOfLastMonth, lastDayOfLastMonth]);

  ExpensePieChart.propTypes = {
    firstDayOfLastMonth: PropTypes.instanceOf(Date).isRequired,
    lastDayOfLastMonth: PropTypes.instanceOf(Date).isRequired,
  };
  if (expenseRecord.length === 0) {
    return (
      <div className="flex h-[380px] w-[650px] items-center justify-center rounded-lg border bg-slate-500 p-6 text-white opacity-40">
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
  return (
    <div className="flex h-[380px] w-[650px] flex-col items-center rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      <div className="text-base font-medium">本月支出分佈</div>
      <VictoryPie
        colorScale={["tomato", "orange", "gold", "cyan", "navy"]}
        labels={({ datum }) =>
          `${datum.x}: $${datum.y} (${((datum.y / expenseRecord.reduce((acc, cur) => acc + cur.y, 0)) * 100).toFixed(1)}%)`
        }
        style={{
          labels: { fontSize: 14, fontWeight: "bold" },
        }}
        data={
          expenseRecord.length > 0 ? expenseRecord : [{ x: "無資料", y: 1 }]
        }
        width={320}
        height={320}
      />
    </div>
  );
}

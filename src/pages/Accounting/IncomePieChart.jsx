import { VictoryPie } from "victory";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

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
          const isExpense = transaction.record_type === "收入";

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
  return (
    <div className="flex h-[380px] w-[650px] flex-col items-center rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      <div className="text-base font-medium">本月收入分佈</div>
      <VictoryPie
        colorScale={["navy", "lightgrey", "gold", "cyan", "tomato"]}
        labels={({ datum }) =>
          `${datum.x}: $${datum.y} (${((datum.y / incomeRecord.reduce((acc, cur) => acc + cur.y, 0)) * 100).toFixed(1)}%)`
        }
        style={{
          labels: { fontSize: 14, fontWeight: "bold" },
        }}
        data={incomeRecord.length > 0 ? incomeRecord : [{ x: "無資料", y: 1 }]}
        width={320}
        height={320}
      />
    </div>
  );
}

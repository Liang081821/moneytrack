import { useGlobalContext } from "@/context/GlobalContext";
import {
  VictoryLine,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
  VictoryZoomContainer,
  VictoryAxis,
} from "victory";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

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
        console.log(filteredTransactions);
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

        console.log(formattedData);
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
        <p>計入本月支出，解鎖支出變化圖表</p>
      </div>
    );
  }
  return (
    <div className="flex flex-1 items-center justify-center rounded-xl bg-white p-4 shadow-lg">
      <div className="w-[300px] lg:w-[400px]">
        <VictoryChart
          theme={VictoryTheme.material}
          containerComponent={
            <VictoryZoomContainer
              zoomDimension="x"
              allowZoom
              allowPan
              voronoiDimension="x"
              labels={({ datum }) =>
                `${datum.x.toLocaleDateString("zh-TW")}: $${datum.y}`
              }
              labelComponent={<VictoryTooltip />}
            />
          }
        >
          {/* X軸 */}
          <VictoryAxis
            tickFormat={(x) =>
              new Date(x).toLocaleDateString("zh-TW", {
                month: "numeric",
                day: "numeric",
              })
            }
          />
          {/* Y軸 */}
          <VictoryAxis dependentAxis tickFormat={(y) => `$${y}`} />

          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={dailyExpenses}
          />
        </VictoryChart>
      </div>
    </div>
  );
}

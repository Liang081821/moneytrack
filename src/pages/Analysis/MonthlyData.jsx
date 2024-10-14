import { useEffect, useState } from "react";
import { getFirestoreRefs } from "../../firebase/api";
import { getDocs, query, where } from "firebase/firestore";
import { useGlobalContext } from "@/context/GlobalContext";

import PropTypes from "prop-types";

export default function MonthlyData({
  setmonthExpense,
  setmonthIncome,
  expenseTotals,
  setExpenseTotals,
  incomeTotals,
  setIncomeTotals,
  netWorth,
  setNetWorth,
  setExpenseRecords,
}) {
  const { loginEmail } = useGlobalContext();
  const { accountingCollectionRef } = getFirestoreRefs(loginEmail);
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const now = new Date();
        const firstDayOfLastMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
        );
        const lastDayOfLastMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
          23,
          59,
          59,
        );

        console.log("查詢日期範圍：", firstDayOfLastMonth, lastDayOfLastMonth);

        // 查詢支出
        const expenseQuery = query(
          accountingCollectionRef,
          where("record_type", "==", "支出"),
          where("time", ">=", firstDayOfLastMonth),
          where("time", "<=", lastDayOfLastMonth),
        );

        // 查詢收入
        const incomeQuery = query(
          accountingCollectionRef,
          where("record_type", "==", "收入"),
          where("time", ">=", firstDayOfLastMonth),
          where("time", "<=", lastDayOfLastMonth),
        );

        // 獲取支出數據
        const expenseSnapShot = await getDocs(expenseQuery);
        const expenseRecords = expenseSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenseRecords(expenseRecords);

        // 獲取收入數據
        const incomeSnapShot = await getDocs(incomeQuery);
        const incomeRecords = incomeSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 分組並計算支出總和
        const expenseGroupedTotals = expenseRecords.reduce((acc, record) => {
          const { class: recordClass, convertedAmountTWD } = record;
          if (!acc[recordClass]) {
            acc[recordClass] = 0;
          }
          acc[recordClass] += convertedAmountTWD;
          return acc;
        }, {});

        // 分組並計算收入總和
        const incomeGroupedTotals = incomeRecords.reduce((acc, record) => {
          const { class: recordClass, convertedAmountTWD } = record;
          if (!acc[recordClass]) {
            acc[recordClass] = 0;
          }
          acc[recordClass] += convertedAmountTWD;
          return acc;
        }, {});

        console.log("支出分組總和：", expenseGroupedTotals);
        console.log("收入分組總和：", incomeGroupedTotals);

        setExpenseTotals(expenseGroupedTotals);
        setIncomeTotals(incomeGroupedTotals);

        const totalExpenses = Object.values(expenseGroupedTotals).reduce(
          (acc, amount) => acc + amount,
          0,
        );
        setmonthExpense(totalExpenses);
        const totalIncome = Object.values(incomeGroupedTotals).reduce(
          (acc, amount) => acc + amount,
          0,
        );
        setmonthIncome(totalIncome);
        const calculatedNetWorth = totalIncome - totalExpenses;
        setNetWorth(calculatedNetWorth);
      } catch (e) {
        console.error("查詢錯誤：", e);
      }
    };

    fetchRecords();
  }, []);

  // const [previousMonthExpense, setPreviousMonthExpense] = useState(0);
  // const [previousMonthIncome, setPreviousMonthIncome] = useState(0);
  // const [previousExpenseRecords, setPreviousExpenseRecords] = useState([]);
  // const [previousIncomeRecords, setPreviousIncomeRecords] = useState([]);
  const [previousExpenseTotals, setPreviousExpenseTotals] = useState({});
  const [previousIncomeTotals, setPreviousIncomeTotals] = useState({});
  const [previousNetWorth, setPreviousNetWorth] = useState(0);

  useEffect(() => {
    const fetchRecordsForPreviousMonth = async () => {
      try {
        const now = new Date();
        // 取得上上個月的第一天和最後一天
        const firstDayOfPreviousMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 2,
          1,
        );
        const lastDayOfPreviousMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          0,
          23,
          59,
          59,
        );

        console.log(
          "查詢前一個月的日期範圍：",
          firstDayOfPreviousMonth,
          lastDayOfPreviousMonth,
        );

        // 查詢支出
        const expenseQuery = query(
          accountingCollectionRef,
          where("record_type", "==", "支出"),
          where("time", ">=", firstDayOfPreviousMonth),
          where("time", "<=", lastDayOfPreviousMonth),
        );

        // 查詢收入
        const incomeQuery = query(
          accountingCollectionRef,
          where("record_type", "==", "收入"),
          where("time", ">=", firstDayOfPreviousMonth),
          where("time", "<=", lastDayOfPreviousMonth),
        );

        // 獲取支出數據
        const expenseSnapShot = await getDocs(expenseQuery);
        const expenseRecords = expenseSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // setPreviousExpenseRecords(expenseRecords);

        // 獲取收入數據
        const incomeSnapShot = await getDocs(incomeQuery);
        const incomeRecords = incomeSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // setPreviousIncomeRecords(incomeRecords);

        // 分組並計算支出總和
        const expenseGroupedTotals = expenseRecords.reduce((acc, record) => {
          const { class: recordClass, convertedAmountTWD } = record;
          if (!acc[recordClass]) {
            acc[recordClass] = 0;
          }
          acc[recordClass] += convertedAmountTWD;
          return acc;
        }, {});
        setPreviousExpenseTotals(expenseGroupedTotals);

        // 分組並計算收入總和
        const incomeGroupedTotals = incomeRecords.reduce((acc, record) => {
          const { class: recordClass, convertedAmountTWD } = record;
          if (!acc[recordClass]) {
            acc[recordClass] = 0;
          }
          acc[recordClass] += convertedAmountTWD;
          return acc;
        }, {});
        setPreviousIncomeTotals(incomeGroupedTotals);

        console.log("前一個月支出分組總和：", expenseGroupedTotals);
        console.log("前一個月收入分組總和：", incomeGroupedTotals);

        // 計算總支出和總收入
        const totalExpenses = Object.values(expenseGroupedTotals).reduce(
          (acc, amount) => acc + amount,
          0,
        );
        // setPreviousMonthExpense(totalExpenses);

        const totalIncome = Object.values(incomeGroupedTotals).reduce(
          (acc, amount) => acc + amount,
          0,
        );
        // setPreviousMonthIncome(totalIncome);

        // 計算淨值
        const calculatedNetWorth = totalIncome - totalExpenses;
        setPreviousNetWorth(calculatedNetWorth);
      } catch (e) {
        console.error("查詢錯誤：", e);
      }
    };

    fetchRecordsForPreviousMonth();
  }, []);
  const calculateChange = (current, previous) => {
    const changeAmount = current - previous;
    const changePercentage =
      previous !== 0 ? ((changeAmount / previous) * 100).toFixed(2) : "N/A";

    return { changeAmount, changePercentage };
  };
  const expenseWithChanges = Object.entries(expenseTotals).map(
    ([recordClass, totalAmount]) => {
      const previousTotalAmount = previousExpenseTotals[recordClass] || 0;

      const { changeAmount, changePercentage } = calculateChange(
        totalAmount,
        previousTotalAmount,
      );

      return {
        recordClass,
        totalAmount,
        changeAmount,
        changePercentage,
      };
    },
  );
  const incomeWithChanges = Object.entries(incomeTotals).map(
    ([recordClass, totalAmount]) => {
      const previousTotalAmount = previousIncomeTotals[recordClass] || 0;

      const { changeAmount, changePercentage } = calculateChange(
        totalAmount,
        previousTotalAmount,
      );

      return {
        recordClass,
        totalAmount,
        changeAmount,
        changePercentage,
      };
    },
  );
  const { changeAmount, changePercentage } = calculateChange(
    netWorth,
    previousNetWorth,
  );
  const now = new Date();
  MonthlyData.propTypes = {
    setmonthExpense: PropTypes.func.isRequired,
    setmonthIncome: PropTypes.func.isRequired,
    expenseTotals: PropTypes.func.isRequired,
    setExpenseTotals: PropTypes.func.isRequired,
    incomeTotals: PropTypes.func.isRequired,
    setIncomeTotals: PropTypes.func.isRequired,
    netWorth: PropTypes.func.isRequired,
    setNetWorth: PropTypes.func.isRequired,
    setExpenseRecords: PropTypes.func.isRequired,
  };
  if (
    Object.keys(expenseTotals).length === 0 &&
    Object.keys(incomeTotals).length === 0
  ) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border bg-slate-500 p-6 text-white opacity-40">
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
        <p className="ml-2">無上月記帳數據</p>
      </div>
    );
  }
  return (
    <div className="flex max-h-[100vh] w-full flex-col items-center overflow-scroll rounded-lg">
      <div className="flex h-[700px] w-full flex-col gap-2 overflow-scroll bg-[#fcfcfc] px-4 pb-7 shadow-lg">
        <h2 className="sticky top-0 w-full rounded-lg bg-[#fcfcfc] pb-2 pt-7 text-center text-xl font-semibold">
          {`${now.getFullYear()} 年 ${now.getMonth()} 月收支數據`}
        </h2>
        <div className="flex flex-col items-center gap-2 rounded-lg px-4">
          {/* <p className="text-sm font-semibold sm:text-base lg:text-lg">支出</p> */}

          {expenseWithChanges.map(
            ({ recordClass, totalAmount, changeAmount, changePercentage }) => (
              <div
                key={recordClass}
                className="flex h-20 w-full items-center justify-between rounded-lg bg-[#9dbebb] px-4"
              >
                <div>
                  {changeAmount >= 0 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#9DBEBB"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
                      />
                    </svg>
                  )}

                  {/* 類別名稱 */}
                  <div className="text-sm font-semibold text-gray-800 sm:text-sm lg:text-lg">
                    {recordClass}
                  </div>
                </div>

                {/* 當月總額 */}
                <div className="flex flex-col items-end">
                  <p className="flex text-sm font-semibold sm:text-lg lg:text-xl">
                    NT$
                    {totalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </p>

                  {/* 變化量和百分比 */}
                  <div
                    className={`text-sm font-semibold ${
                      changeAmount >= 0 ? "text-gray-600" : "text-gray-600"
                    }`}
                  >
                    {changeAmount >= 0 ? "+" : ""}
                    {changeAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {changePercentage !== "N/A"
                      ? ` ${changePercentage}%`
                      : "0%"}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg px-4">
          {/* <p className="text-sm font-semibold sm:text-base lg:text-lg">收入</p> */}

          {incomeWithChanges.map(
            ({ recordClass, totalAmount, changeAmount, changePercentage }) => (
              <div
                key={recordClass}
                className="flex h-20 w-full items-center justify-between rounded-lg bg-[#e8e9ed] p-4"
              >
                <div>
                  {changeAmount >= 0 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#9DBEBB"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
                      />
                    </svg>
                  )}

                  {/* 類別名稱 */}
                  <div className="text-sm font-semibold text-gray-800 sm:text-sm lg:text-lg">
                    {recordClass}
                  </div>
                </div>

                {/* 當月總額 */}
                <div className="flex flex-col items-end">
                  <p className="flex text-sm font-semibold text-gray-800 sm:text-lg lg:text-xl">
                    NT$
                    {totalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </p>

                  {/* 變化量和百分比 */}
                  <div
                    className={`text-sm font-semibold ${
                      changeAmount >= 0 ? "text-gray-600" : "text-gray-600"
                    }`}
                  >
                    {changeAmount >= 0 ? "+" : ""}
                    {changeAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {changePercentage !== "N/A"
                      ? ` ${changePercentage}%`
                      : "0%"}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
        <div className="flex flex-col items-center gap-2 px-4">
          {/* <p className="text-sm font-semibold sm:text-base lg:text-lg">
            淨現金流
          </p> */}
          <div className="flex h-20 w-full items-center justify-between rounded-lg bg-[#babfd1] px-4 text-gray-800">
            <div className="flex flex-col">
              {/* 根據變化量顯示上升或下降圖標 */}
              {changeAmount >= 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#9DBEBB"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
                  />
                </svg>
              )}

              {/* 類別名稱 */}
              <div className="text-sm font-semibold text-gray-800 sm:text-sm lg:text-lg">
                淨現金流
              </div>
            </div>

            {/* 當月總額及變化量 */}
            <div className="flex flex-col items-end">
              {/* 當月淨現金流總額 */}
              <p className="flex text-sm font-semibold sm:text-lg lg:text-xl">
                NT$
                {netWorth.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </p>

              {/* 變化量 */}
              <div
                className={`text-sm font-semibold ${
                  changeAmount >= 0 ? "text-gray-600" : "text-gray-600"
                }`}
              >
                {changeAmount >= 0 ? "+" : ""}
                {changeAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </div>

              {/* 變化百分比 */}
              <div className="text-sm text-gray-600">
                {changePercentage !== "N/A" ? ` ${changePercentage}%` : "0%"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

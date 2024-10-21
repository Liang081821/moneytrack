import { useGlobalContext } from "@/context/GlobalContext";
import { getDocs, query, where } from "firebase/firestore";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getFirestoreRefs } from "../../firebase/api";

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

        const expenseQuery = query(
          accountingCollectionRef,
          where("record_type", "==", "支出"),
          where("time", ">=", firstDayOfLastMonth),
          where("time", "<=", lastDayOfLastMonth),
        );
        const incomeQuery = query(
          accountingCollectionRef,
          where("record_type", "==", "收入"),
          where("time", ">=", firstDayOfLastMonth),
          where("time", "<=", lastDayOfLastMonth),
        );

        const expenseSnapShot = await getDocs(expenseQuery);
        const expenseRecords = expenseSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenseRecords(expenseRecords);

        const incomeSnapShot = await getDocs(incomeQuery);
        const incomeRecords = incomeSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const expenseGroupedTotals = expenseRecords.reduce((acc, record) => {
          const { class: recordClass, convertedAmountTWD } = record;
          if (!acc[recordClass]) {
            acc[recordClass] = 0;
          }
          acc[recordClass] += convertedAmountTWD;
          return acc;
        }, {});

        const incomeGroupedTotals = incomeRecords.reduce((acc, record) => {
          const { class: recordClass, convertedAmountTWD } = record;
          if (!acc[recordClass]) {
            acc[recordClass] = 0;
          }
          acc[recordClass] += convertedAmountTWD;
          return acc;
        }, {});

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

  const [previousExpenseTotals, setPreviousExpenseTotals] = useState({});
  const [previousIncomeTotals, setPreviousIncomeTotals] = useState({});
  const [previousNetWorth, setPreviousNetWorth] = useState(0);

  useEffect(() => {
    const fetchRecordsForPreviousMonth = async () => {
      try {
        const now = new Date();
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

        const expenseQuery = query(
          accountingCollectionRef,
          where("record_type", "==", "支出"),
          where("time", ">=", firstDayOfPreviousMonth),
          where("time", "<=", lastDayOfPreviousMonth),
        );

        const incomeQuery = query(
          accountingCollectionRef,
          where("record_type", "==", "收入"),
          where("time", ">=", firstDayOfPreviousMonth),
          where("time", "<=", lastDayOfPreviousMonth),
        );

        const expenseSnapShot = await getDocs(expenseQuery);
        const expenseRecords = expenseSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const incomeSnapShot = await getDocs(incomeQuery);
        const incomeRecords = incomeSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const expenseGroupedTotals = expenseRecords.reduce((acc, record) => {
          const { class: recordClass, convertedAmountTWD } = record;
          if (!acc[recordClass]) {
            acc[recordClass] = 0;
          }
          acc[recordClass] += convertedAmountTWD;
          return acc;
        }, {});
        setPreviousExpenseTotals(expenseGroupedTotals);

        const incomeGroupedTotals = incomeRecords.reduce((acc, record) => {
          const { class: recordClass, convertedAmountTWD } = record;
          if (!acc[recordClass]) {
            acc[recordClass] = 0;
          }
          acc[recordClass] += convertedAmountTWD;
          return acc;
        }, {});
        setPreviousIncomeTotals(incomeGroupedTotals);

        const totalExpenses = Object.values(expenseGroupedTotals).reduce(
          (acc, amount) => acc + amount,
          0,
        );

        const totalIncome = Object.values(incomeGroupedTotals).reduce(
          (acc, amount) => acc + amount,
          0,
        );

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

                  <div className="text-sm font-semibold text-gray-800 sm:text-sm lg:text-lg">
                    {recordClass}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <p className="flex text-sm font-semibold sm:text-lg lg:text-xl">
                    NT$
                    {totalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>

                  <div
                    className={`text-sm font-semibold ${
                      changeAmount >= 0 ? "text-gray-600" : "text-gray-600"
                    }`}
                  >
                    {changeAmount >= 0 ? "+" : ""}
                    {changeAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
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

                  <div className="text-sm font-semibold text-gray-800 sm:text-sm lg:text-lg">
                    {recordClass}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <p className="flex text-sm font-semibold text-gray-800 sm:text-lg lg:text-xl">
                    NT$
                    {totalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>

                  <div
                    className={`text-sm font-semibold ${
                      changeAmount >= 0 ? "text-gray-600" : "text-gray-600"
                    }`}
                  >
                    {changeAmount >= 0 ? "+" : ""}
                    {changeAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
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
          <div className="flex h-20 w-full items-center justify-between rounded-lg bg-[#babfd1] px-4 text-gray-800">
            <div className="flex flex-col">
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

              <div className="text-sm font-semibold text-gray-800 sm:text-sm lg:text-lg">
                淨現金流
              </div>
            </div>

            <div className="flex flex-col items-end">
              <p className="flex text-sm font-semibold sm:text-lg lg:text-xl">
                NT$
                {netWorth.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>

              <div
                className={`text-sm font-semibold ${
                  changeAmount >= 0 ? "text-gray-600" : "text-gray-600"
                }`}
              >
                {changeAmount >= 0 ? "+" : ""}
                {changeAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>

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

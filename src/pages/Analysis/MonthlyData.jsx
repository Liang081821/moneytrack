import { useEffect } from "react";
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
          const { class: recordClass, amount } = record;
          if (!acc[recordClass]) {
            acc[recordClass] = 0;
          }
          acc[recordClass] += amount;
          return acc;
        }, {});

        // 分組並計算收入總和
        const incomeGroupedTotals = incomeRecords.reduce((acc, record) => {
          const { class: recordClass, amount } = record;
          if (!acc[recordClass]) {
            acc[recordClass] = 0;
          }
          acc[recordClass] += amount;
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
      <div className="flex h-[595px] w-[420px] items-center justify-center rounded-lg border bg-slate-500 p-6 text-white opacity-40">
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
        <p>前月份沒有記帳資料，無法帶入..</p>
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col items-center rounded-xl bg-white p-3 sm:min-h-[595px]">
      <h2 className="mb-4 font-semibold">上月數據</h2>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        {Object.entries(expenseTotals).map(([recordClass, totalAmount]) => (
          <div
            key={recordClass}
            className="xs:h-28 xs:w-28 m-1 flex h-20 w-20 flex-col items-center justify-center rounded-xl border bg-[#9DBEBB] p-2 sm:p-4 lg:h-32 lg:w-32 xl:h-48 xl:w-48"
          >
            <div className="text-xs font-semibold sm:text-sm">
              {recordClass}
            </div>
            <div className="text-sm sm:text-lg">
              NT${totalAmount.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600 sm:text-base">支出</div>
          </div>
        ))}

        {Object.entries(incomeTotals).map(([recordClass, totalAmount]) => (
          <div
            key={recordClass}
            className="xs:h-28 xs:w-28 m-1 flex h-20 w-20 flex-col items-center justify-center rounded-xl border bg-[#E8E9ED] p-2 sm:p-4 lg:h-32 lg:w-32 xl:h-48 xl:w-48"
          >
            <div className="text-xs font-semibold sm:text-sm">
              {recordClass}
            </div>
            <div className="text-sm sm:text-lg">
              NT${totalAmount.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600 sm:text-base">收入</div>
          </div>
        ))}

        <div className="xs:h-28 xs:w-28 m-1 flex h-20 w-20 flex-col items-center justify-center rounded-xl border bg-[#F4E9CD] p-2 sm:p-4 lg:h-32 lg:w-32 xl:h-48 xl:w-48">
          <div className="text-xs font-semibold sm:text-sm">投資&儲蓄</div>
          <div className="text-xs font-semibold sm:text-sm">NT${netWorth}</div>
          <div className="text-sm text-gray-600 sm:text-base">淨現金流</div>
        </div>
      </div>
    </div>
  );
}

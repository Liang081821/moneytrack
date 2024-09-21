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
  expenseRecords,
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
    <div className="flex h-[595px] w-[420px] flex-col items-center rounded-2xl border border-black">
      <h2 className="mb-10">上月數據</h2>
      <div className="flex flex-wrap justify-center">
        {Object.entries(expenseTotals).map(([recordClass, totalAmount]) => (
          <div
            key={recordClass}
            className="m-2 w-28 rounded-xl border bg-[#F4E9CD] p-2"
          >
            <div>{recordClass}</div>
            <div>NT${totalAmount.toFixed(0)}</div>
            <div className="text-xl">支出</div>
          </div>
        ))}

        {Object.entries(incomeTotals).map(([recordClass, totalAmount]) => (
          <div
            key={recordClass}
            className="m-2 w-28 rounded-xl border bg-[#468189] p-2 text-white"
          >
            <div>{recordClass}</div>
            <div>NT${totalAmount.toFixed(0)}</div>
            <div className="text-xl">收入</div>
          </div>
        ))}
        <div className="m-2 w-28 rounded-xl border bg-[#031926] p-2 text-white">
          <div className="h-6"></div>
          <div>NT${netWorth}</div>
          <div className="text-xl">投資&儲蓄</div>
        </div>
      </div>
    </div>
  );
}

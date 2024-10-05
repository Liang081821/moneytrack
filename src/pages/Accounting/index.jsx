import { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
// import DailyAccounting from "./DailyAccounting";
import DailyRecord from "./DailyRecord";
import ExpensePieChart from "./ExpensePieChart";
import IncomePieChart from "./IncomePieChart";
import BalanceChart from "./BalanceChart";
import BarChart from "./BarChart";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Accounting() {
  const defaultLayouts = {
    lg: [
      { i: "a", x: 0, y: 0, w: 4, h: 50, minH: 50, minW: 4 },
      // { i: "b", x: 4, y: 0, w: 4, h: 50, minH: 50, minW: 4 },
      { i: "c", x: 8, y: 0, w: 4, h: 50, minH: 50, minW: 4 },
      { i: "d", x: 0, y: 1, w: 4, h: 50, minH: 50, minW: 4 },
      { i: "e", x: 4, y: 1, w: 4, h: 50, minH: 50, minW: 4 },
      { i: "f", x: 8, y: 1, w: 4, h: 50, minH: 50, minW: 4 },
      { i: "g", x: 0, y: 2, w: 8, h: 50, minH: 50, minW: 8 },
    ],
    md: [
      { i: "a", x: 0, y: 0, w: 5, h: 60, minH: 60, minW: 4 },
      // { i: "b", x: 5, y: 0, w: 5, h: 60, minH: 60, minW: 4 },
      { i: "c", x: 0, y: 1, w: 5, h: 60, minH: 60, minW: 4 },
      { i: "d", x: 0, y: 2, w: 5, h: 50, minH: 50, minW: 4 },
      { i: "e", x: 5, y: 2, w: 5, h: 50, minH: 50, minW: 4 },
      { i: "f", x: 0, y: 3, w: 5, h: 50, minH: 50, minW: 4 },
      { i: "g", x: 5, y: 3, w: 5, h: 50, minH: 50, minW: 8 },
    ],
    sm: [
      { i: "a", x: 0, y: 0, w: 6, h: 50, minH: 50, minW: 6 },
      // { i: "b", x: 0, y: 1, w: 6, h: 50, minH: 50, minW: 6 },
      { i: "c", x: 0, y: 2, w: 6, h: 80, minH: 80, minW: 6 },
      { i: "d", x: 0, y: 4, w: 6, h: 40, minH: 40, minW: 6 },
      { i: "e", x: 0, y: 5, w: 6, h: 40, minH: 40, minW: 6 },
      { i: "f", x: 0, y: 6, w: 6, h: 40, minH: 40, minW: 6 },
      { i: "g", x: 0, y: 7, w: 6, h: 20, minH: 20, minW: 6 },
    ],
  };

  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem("accountingLayouts");
    return savedLayouts ? JSON.parse(savedLayouts) : defaultLayouts;
  });
  const handleLayoutChange = (currentLayout, allLayouts) => {
    localStorage.setItem("accountingLayouts", JSON.stringify(allLayouts));
    setLayouts(allLayouts);
  };

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const handleMonthChange = (direction) => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "next") {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        return new Date();
      }
      return newDate;
    });
  };

  const firstDayOfSelectedMonth = new Date(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth(),
    1,
  );
  const lastDayOfSelectedMonth = new Date(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth() + 1,
    0,
    23,
    59,
    59,
  );

  return (
    <div className="flex w-full flex-col items-center justify-center bg-gradient-to-r from-[#e3e3e3] via-[#efefef] to-[#e3e3e3] pb-[10vh] fade-in">
      <div className="mt-5 w-[90%]">
        <div className="flex w-full justify-center">
          <span className="text-xl font-bold">
            {`${selectedMonth.getFullYear()}年 ${selectedMonth.getMonth() + 1}月`}
          </span>
        </div>
        <div className="flex items-center justify-between p-3">
          <div
            className="flex cursor-pointer items-center justify-center gap-1 rounded-xl border-2 border-gray-500 p-1 text-sm font-semibold md:gap-2 md:p-2 md:text-base"
            onClick={() => handleMonthChange("prev")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
              />
            </svg>
            <button>上個月</button>
          </div>
          <div className="flex gap-2">
            {/* <div
              className="flex cursor-pointer items-center justify-center gap-1 rounded-xl border-2 border-gray-500 p-1 text-sm font-semibold md:gap-2 md:p-2 md:text-base"
              onClick={() => startAccounting()}
            >
              <button>我要記帳</button>
            </div> */}
            <div
              className="flex cursor-pointer items-center justify-center gap-1 rounded-xl border-2 border-gray-500 p-1 text-sm font-semibold md:gap-2 md:p-2 md:text-base"
              onClick={() => handleMonthChange("")}
            >
              <button>回本月</button>
            </div>
          </div>
          <div
            className="flex cursor-pointer items-center justify-center gap-1 rounded-xl border-2 border-gray-500 p-1 text-sm font-semibold md:gap-2 md:p-2 md:text-base"
            onClick={() => handleMonthChange("next")}
          >
            <button>下個月</button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </div>
      </div>
      <div style={{ width: "90%", margin: "0 auto", borderRadius: "8px" }}>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768 }}
          cols={{ lg: 12, md: 10, sm: 6 }}
          rowHeight={1}
          draggableHandle=".drag-handle"
          onLayoutChange={(currentLayout, allLayouts) =>
            handleLayoutChange(currentLayout, allLayouts)
          }
        >
          <div
            key="a"
            className="flex flex-col rounded-xl border-2 border-gray-500 bg-white"
          >
            <div className="drag-handle cursor-move rounded-lg p-4 text-center text-xl font-semibold">
              本月支出變化表
            </div>
            <BarChart
              firstDayOfSelectedMonth={firstDayOfSelectedMonth}
              lastDayOfSelectedMonth={lastDayOfSelectedMonth}
            />
          </div>
          {/* <div
            key="b"
            className="flex flex-col rounded-xl border-2 border-gray-500 bg-white"
          >
            <div className="drag-handle cursor-move rounded-lg p-4 text-center text-xl font-semibold">
              每日紀錄
            </div>
            <DailyAccounting />
          </div> */}
          <div
            key="c"
            className="flex flex-col rounded-xl border-2 border-gray-500 bg-white"
          >
            <div className="drag-handle cursor-move rounded-lg p-4 text-center text-xl font-semibold">
              交易紀錄
            </div>
            <DailyRecord
              firstDayOfSelectedMonth={firstDayOfSelectedMonth}
              lastDayOfSelectedMonth={lastDayOfSelectedMonth}
            />
          </div>
          <div
            key="d"
            className="flex flex-col rounded-xl border-2 border-gray-500 bg-white"
          >
            <div className="drag-handle cursor-move rounded-lg p-4 text-center text-xl font-semibold">
              本月支出分佈
            </div>
            <ExpensePieChart
              firstDayOfSelectedMonth={firstDayOfSelectedMonth}
              lastDayOfSelectedMonth={lastDayOfSelectedMonth}
            />
          </div>
          <div
            key="e"
            className="flex flex-col rounded-xl border-2 border-gray-500 bg-white"
          >
            <div className="drag-handle cursor-move rounded-lg p-4 text-center text-xl font-semibold">
              本月收入分佈
            </div>
            <IncomePieChart
              firstDayOfSelectedMonth={firstDayOfSelectedMonth}
              lastDayOfSelectedMonth={lastDayOfSelectedMonth}
            />
          </div>
          <div
            key="f"
            className="flex flex-col rounded-xl border-2 border-gray-500 bg-white"
          >
            <div className="drag-handle cursor-move rounded-lg p-4 text-center text-xl font-semibold">
              本月盈餘
            </div>
            <BalanceChart
              firstDayOfSelectedMonth={firstDayOfSelectedMonth}
              lastDayOfSelectedMonth={lastDayOfSelectedMonth}
            />
          </div>
          {/* <div
            key="g"
            className="flex flex-col rounded-xl border-2 border-gray-500"
          >
            <div className="drag-handle rounded-lg p-4 text-xl font-semibold">
              g (拖動我)
            </div>
          </div> */}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
}

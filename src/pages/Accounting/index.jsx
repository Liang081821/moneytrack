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
import { useJoyride } from "../../context/JoyrideContext";
import DataJoyride from "../../components/JoyRide/DataJoyRide";
import { useEffect } from "react";
import Button from "@/components/Button";
const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Accounting() {
  const { setDataRun } = useJoyride();
  useEffect(() => {
    const hasSeenDataTutorial = localStorage.getItem("hasSeenDataTutorial");
    if (!hasSeenDataTutorial) {
      setDataRun(true);
      localStorage.setItem("hasSeenDataTutorial", "true");
    }
  }, [setDataRun]);
  const defaultLayouts = {
    lg: [
      { i: "a", x: 0, y: 0, w: 4, h: 50, minH: 50, minW: 4 },
      // { i: "b", x: 4, y: 0, w: 4, h: 50, minH: 50, minW: 4 },
      { i: "c", x: 8, y: 0, w: 4, h: 50, minH: 50, minW: 4 },
      { i: "d", x: 0, y: 1, w: 4, h: 50, minH: 50, minW: 4 },
      { i: "e", x: 4, y: 1, w: 4, h: 50, minH: 50, minW: 4 },
      { i: "f", x: 8, y: 1, w: 4, h: 50, minH: 50, minW: 4 },
      // {
      //   i: "g",
      //   x: 0,
      //   y: 0,
      //   w: 8,
      //   h: 50,
      //   minH: 50,
      //   minW: 8,
      //   isDraggable: false,
      //   isResizable: false,
      // },
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
  const startTutorial = () => {
    setDataRun(true);
  };
  return (
    <div className="flex w-full flex-col items-center justify-center bg-gradient-to-r from-[#e3e3e3] via-[#efefef] to-[#e3e3e3] pb-[10vh] fade-in">
      <DataJoyride />
      <div className="mt-5 w-[85%] px-3">
        <div className="joyride-changemonth flex items-center justify-between rounded-lg bg-[#fcfcfc] p-4 shadow-lg">
          <div className="flex w-[228px]">
            <Button
              variant="retain"
              className="flex items-center justify-center gap-1 md:gap-2"
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
              <p>上個月</p>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-full w-full items-center justify-center rounded-lg p-1 md:p-2">
              <div className="flex h-full items-center text-xl font-semibold">
                {`${selectedMonth.getFullYear()}年 ${selectedMonth.getMonth() + 1}月`}
              </div>
            </div>
            <Button
              variant="retain"
              className="flex items-center justify-center gap-1 md:gap-2"
              onClick={() => handleMonthChange("")}
            >
              <p className="text-nowrap">回本月</p>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              className="mr-2 flex items-center justify-center gap-1 md:gap-2"
              variant="grey"
            >
              <p onClick={() => startTutorial()}>使用教學</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="yellow"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />
              </svg>
            </Button>
            <Button
              variant="retain"
              className="flex items-center justify-center gap-1 md:gap-2"
              onClick={() => handleMonthChange("next")}
            >
              <p>下個月</p>
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
            </Button>
          </div>
        </div>
      </div>
      <div style={{ width: "85%", margin: "0 auto", borderRadius: "8px" }}>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768 }}
          cols={{ lg: 12, md: 10, sm: 6 }}
          rowHeight={1}
          // margin={[10, 10]}
          draggableHandle=".drag-handle"
          onLayoutChange={(currentLayout, allLayouts) =>
            handleLayoutChange(currentLayout, allLayouts)
          }
        >
          <div
            key="a"
            className="joyride-datachange flex flex-col rounded-lg bg-[#fcfcfc] shadow-lg"
          >
            <div className="joyride-drag drag-handle cursor-move rounded-lg p-4 text-center text-xl font-semibold">
              本月支出變化表
            </div>
            <BarChart
              firstDayOfSelectedMonth={firstDayOfSelectedMonth}
              lastDayOfSelectedMonth={lastDayOfSelectedMonth}
            />
          </div>

          <div
            key="c"
            className="joyride-transaction flex flex-col rounded-lg bg-[#fcfcfc] shadow-lg"
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
            className="joyride-expense flex flex-col rounded-lg bg-[#fcfcfc] shadow-lg"
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
            className="joyride-income flex flex-col rounded-lg bg-[#fcfcfc] shadow-lg"
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
            className="joyride-balance flex flex-col rounded-lg bg-[#fcfcfc] shadow-lg"
          >
            <div className="drag-handle cursor-move rounded-lg p-4 text-center text-xl font-semibold">
              本月盈餘
            </div>
            <BalanceChart
              firstDayOfSelectedMonth={firstDayOfSelectedMonth}
              lastDayOfSelectedMonth={lastDayOfSelectedMonth}
            />
          </div>
        </ResponsiveGridLayout>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import DailyAccounting from "./DailyAccounting";
import DailyRecord from "./DailyRecord";
import ExpensePieChart from "./ExpensePieChart";
import IncomePieChart from "./IncomePieChart";
import BalanceChart from "./BalanceChart";
import BarChart from "./BarChart";
// import CustomBudget from "./CustomBudget";
import AddNewClass from "./AddNewClass";

export default function Accounting() {
  const initialItemObj = JSON.parse(localStorage.getItem("itemObj")) || {
    candidate: {
      items: [
        { content: "DailyAccounting", id: nanoid(), priority: "3" },
        { content: "DailyRecord", id: nanoid(), priority: "2" },
        { content: "ExpensePieChart", id: nanoid(), priority: "1" },
        { content: "IncomePieChart", id: nanoid(), priority: "1" },
        { content: "BarChart", id: nanoid(), priority: "6" },
        { content: "BalanceChart", id: nanoid(), priority: "4" },
      ],
    },
    productBacklog: {
      items: [],
    },
  };

  const [itemObj, setItemObj] = useState(initialItemObj);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    localStorage.setItem("itemObj", JSON.stringify(itemObj));
  }, [itemObj]);

  const handleDragEnd = (event) => {
    const { source, destination } = event;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const newItemObj = JSON.parse(JSON.stringify(itemObj));

    const [removed] = newItemObj[source.droppableId].items.splice(
      source.index,
      1,
    );

    newItemObj[destination.droppableId].items.splice(
      destination.index,
      0,
      removed,
    );

    setItemObj(newItemObj);
  };

  const handleMonthChange = (direction) => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "next") {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
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

  const renderContent = (content) => {
    switch (content) {
      case "DailyAccounting":
        return <DailyAccounting />;
      case "DailyRecord":
        return <DailyRecord />;
      case "ExpensePieChart":
        return (
          <ExpensePieChart
            firstDayOfLastMonth={firstDayOfSelectedMonth}
            lastDayOfLastMonth={lastDayOfSelectedMonth}
          />
        );
      case "IncomePieChart":
        return (
          <IncomePieChart
            firstDayOfLastMonth={firstDayOfSelectedMonth}
            lastDayOfLastMonth={lastDayOfSelectedMonth}
          />
        );
      case "BalanceChart":
        return (
          <BalanceChart
            firstDayOfLastMonth={firstDayOfSelectedMonth}
            lastDayOfLastMonth={lastDayOfSelectedMonth}
          />
        );
      case "BarChart":
        return (
          <BarChart
            firstDayOfLastMonth={firstDayOfSelectedMonth}
            lastDayOfLastMonth={lastDayOfSelectedMonth}
          />
        );
      default:
        return <div>未知內容</div>;
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#bbe0e1] via-[#ebf0f6] to-[#bbe0e1] pl-11 md:pl-0">
      <div>
        <div className="flex items-center justify-between p-3">
          <div
            className="flex cursor-pointer items-center justify-center gap-1 rounded-xl bg-[#607196] p-1 text-sm text-white md:gap-2 md:p-2 md:text-base"
            onClick={() => handleMonthChange("prev")}
          >
            <button>上個月</button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z"
              />
            </svg>
          </div>
          <span className="font-bold">
            {`${selectedMonth.getFullYear()}年 ${selectedMonth.getMonth() + 1}月`}
          </span>
          <div
            className="flex cursor-pointer items-center justify-center gap-1 rounded-xl bg-[#607196] p-1 text-sm text-white md:gap-2 md:p-2 md:text-base"
            onClick={() => handleMonthChange("next")}
          >
            <button>下個月</button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
              />
            </svg>
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="candidate">
          {(provided) => (
            <div
              className="flex flex-wrap items-start justify-center gap-4 md:p-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {itemObj.candidate.items.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                  isDragDisabled={itemObj.candidate.items.length === 1}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="rounded-md py-3 pr-3 md:p-4"
                    >
                      {renderContent(item.content)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {/* <CustomBudget /> */}
      <AddNewClass />
    </div>
  );
}

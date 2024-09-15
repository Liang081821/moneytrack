import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import DailyAccounting from "./DailyAccounting";
import DailyRecord from "./DailyRecord";
import PieChart from "./PieChart";
import MonthlyRecord from "./MonthlyRecord";
import LineChart from "./LineChart";
import BarChart from "./BarChart";

export default function Accounting() {
  const initialItemObj = JSON.parse(localStorage.getItem("itemObj")) || {
    candidate: {
      items: [
        { content: "DailyAccounting", id: nanoid(), priority: "3" },
        { content: "DailyRecord", id: nanoid(), priority: "2" },
        { content: "PieChart", id: nanoid(), priority: "1" },
        { content: "BarChart", id: nanoid(), priority: "6" },
        { content: "MonthlyRecord", id: nanoid(), priority: "4" },
        { content: "LineChart", id: nanoid(), priority: "5" },
      ],
    },
    productBacklog: {
      items: [
        { content: "MonthlyRecord", id: nanoid(), priority: "4" },
        { content: "LineChart", id: nanoid(), priority: "5" },
      ],
    },
  };

  const [itemObj, setItemObj] = useState(initialItemObj);

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

  const renderContent = (content) => {
    switch (content) {
      case "DailyAccounting":
        return <DailyAccounting />;
      case "DailyRecord":
        return <DailyRecord />;
      case "PieChart":
        return <PieChart />;
      case "MonthlyRecord":
        return <MonthlyRecord />;
      case "LineChart":
        return <LineChart />;
      case "BarChart":
        return <BarChart />;
      default:
        return <div>未知內容</div>;
    }
  };

  return (
    <div className="bg-[#F5F5F5]">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="candidate">
          {(provided) => (
            <div
              className="flex flex-wrap items-start justify-center gap-4 p-4"
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
                      className="rounded-md p-4"
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
    </div>
  );
}
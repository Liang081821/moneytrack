import Saving from "./Saving";
import Consume from "./Consume";
import Invest from "./Invest";
import HistoryRecord from "./HistoryRecord";
import AddNewFunction from "./addNewAccount";

export default function Property() {
  return (
    <>
      <div className="flex w-full flex-col">
        <div className="flex w-full justify-end">
          <AddNewFunction></AddNewFunction>
        </div>
        <div className="flex flex-wrap items-center justify-center">
          <Saving />
          <Consume />
          <Invest />
        </div>
        <HistoryRecord />
      </div>
    </>
  );
}

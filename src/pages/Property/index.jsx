import Saving from "./Saving";
import Consume from "./Consume";
import Invest from "./Invest";
import HistoryRecord from "./HistoryRecord";

export default function Property() {
  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-center">
          <Saving />
          <Consume />
          <Invest />
        </div>
        <HistoryRecord />
      </div>
    </>
  );
}

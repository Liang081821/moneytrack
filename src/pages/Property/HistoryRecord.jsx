import Saving from "./Saving";
import Consume from "./Consume";
import Invest from "./Invest";
import AddNewFunction from "./addNewAccount";

export default function HistoryRecord() {
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
        <div className="m-14 flex h-[100px] items-center gap-4 border border-black">
          <div>11/24</div>
          <div className="flex w-full">
            <div className="h-2 w-14 bg-[#222E50]"></div>
            <div className="h-2 w-full bg-[#9DBEBB]"></div>
            <div className="h-2 w-14 bg-[#E6A602]"></div>
          </div>
          <div className="flex h-[60px] w-[110px] flex-col items-center justify-center border">
            <div>儲蓄</div>
            <div>55,785</div>
          </div>
          <div className="flex h-[60px] w-[110px] flex-col items-center justify-center border">
            <div>消費</div>
            <div>55,785</div>
          </div>
          <div className="flex h-[60px] w-[110px] flex-col items-center justify-center border">
            <div>投資</div>
            <div>55,785</div>
          </div>
          <div className="flex h-[60px] w-[110px] flex-col items-center justify-center border">
            <div>總資產</div>
            <div>55,785</div>
          </div>
        </div>
      </div>
    </>
  );
}

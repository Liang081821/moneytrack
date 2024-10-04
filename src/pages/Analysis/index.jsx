import Report from "./Report";
import HistoryReport from "./HistoryReport";

export default function Analysis() {
  return (
    <div className="flex w-full flex-col items-center bg-gradient-to-r from-[#e3e3e3] via-[#efefef] pt-5">
      <Report />
      <HistoryReport />
    </div>
  );
}

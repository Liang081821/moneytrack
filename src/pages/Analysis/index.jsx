import Report from "./Report";
import HistoryReport from "./HistoryReport";

export default function Analysis() {
  return (
    <div className="flex w-full flex-col items-center bg-gradient-to-r from-[#e3e3e3] via-[#efefef] to-[#e3e3e3] pt-5 fade-in">
      <Report />
      <HistoryReport />
    </div>
  );
}

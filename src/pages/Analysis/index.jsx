import Report from "./Report";
import HistoryReport from "./HistoryReport";

export default function Analysis() {
  return (
    <div className="flex w-full flex-col items-center bg-gradient-to-r from-[#bbe0e1] via-[#ebf0f6] to-[#bbe0e1] p-10">
      <Report />
      <HistoryReport />
    </div>
  );
}

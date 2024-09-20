import Report from "./Report";
import HistoryReport from "./HistoryReport";

export default function Analysis() {
  return (
    <div className="flex w-full flex-col items-center">
      <Report />
      <HistoryReport />
    </div>
  );
}

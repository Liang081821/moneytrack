import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <div className="flex min-h-screen min-w-48 flex-col gap-8 bg-[#dff1f772] px-5 pt-6 shadow-lg shadow-slate-100">
      <div className="sticky top-[84px] flex flex-col gap-6">
        <Link to="/accounting">記帳區</Link>
        <Link to="/property">資產整合</Link>
        <Link to="/analysis">財務健檢</Link>
        <Link to="/project">理財專案</Link>
        <Link to="/personalinformation">帳號管理</Link>
      </div>
    </div>
  );
}

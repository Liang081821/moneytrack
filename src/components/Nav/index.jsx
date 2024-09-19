import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <div className="flex min-h-screen min-w-48 flex-col gap-8 px-5 pt-6 shadow-lg shadow-slate-100">
      <div className="sticky top-[84px] flex flex-col gap-6">
        <NavLink
          to="/accounting"
          className={({ isActive, isPending, isTransitioning }) =>
            ` ${isActive ? "font-base rounded-xl bg-[#9DBEBB]" : "bg-transparent font-normal"} ${isPending ? "text-red-500" : "text-black"} ${isTransitioning ? "transition-transform duration-300" : ""} p-2`
          }
        >
          記帳區
        </NavLink>
        <NavLink
          to="/property"
          className={({ isActive, isPending, isTransitioning }) =>
            ` ${isActive ? "font-base rounded-xl bg-[#9DBEBB]" : "bg-transparent font-normal"} ${isPending ? "text-red-500" : "text-black"} ${isTransitioning ? "transition-transform duration-300" : ""} p-2`
          }
        >
          資產整合
        </NavLink>
        <NavLink
          to="/analysis"
          className={({ isActive, isPending, isTransitioning }) =>
            ` ${isActive ? "font-base rounded-xl bg-[#9DBEBB]" : "bg-transparent font-normal"} ${isPending ? "text-red-500" : "text-black"} ${isTransitioning ? "transition-transform duration-300" : ""} p-2`
          }
        >
          財務健檢
        </NavLink>
        <NavLink
          to="/project"
          className={({ isActive, isPending, isTransitioning }) =>
            ` ${isActive ? "font-base rounded-xl bg-[#9DBEBB]" : "bg-transparent font-normal"} ${isPending ? "text-red-500" : "text-black"} ${isTransitioning ? "transition-transform duration-300" : ""} p-2`
          }
        >
          理財專案
        </NavLink>
        <NavLink
          to="/personalinformation"
          className={({ isActive, isPending, isTransitioning }) =>
            ` ${isActive ? "font-base rounded-xl bg-[#9DBEBB]" : "bg-transparent font-normal"} ${isPending ? "text-red-500" : "text-black"} ${isTransitioning ? "transition-transform duration-300" : ""} p-2`
          }
        >
          帳號管理
        </NavLink>
      </div>
    </div>
  );
}

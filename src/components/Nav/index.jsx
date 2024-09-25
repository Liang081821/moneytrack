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
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
            <h1>記帳區</h1>
          </div>
        </NavLink>
        <NavLink
          to="/property"
          className={({ isActive, isPending, isTransitioning }) =>
            ` ${isActive ? "font-base rounded-xl bg-[#9DBEBB]" : "bg-transparent font-normal"} ${isPending ? "text-red-500" : "text-black"} ${isTransitioning ? "transition-transform duration-300" : ""} p-2`
          }
        >
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
              />
            </svg>
            <h1>帳戶整合</h1>
          </div>
        </NavLink>
        <NavLink
          to="/analysis"
          className={({ isActive, isPending, isTransitioning }) =>
            ` ${isActive ? "font-base rounded-xl bg-[#9DBEBB]" : "bg-transparent font-normal"} ${isPending ? "text-red-500" : "text-black"} ${isTransitioning ? "transition-transform duration-300" : ""} p-2`
          }
        >
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
              />
            </svg>
            <h1>財務分析</h1>
          </div>
        </NavLink>
        <NavLink
          to="/project"
          className={({ isActive, isPending, isTransitioning }) =>
            ` ${isActive ? "font-base rounded-xl bg-[#9DBEBB]" : "bg-transparent font-normal"} ${isPending ? "text-red-500" : "text-black"} ${isTransitioning ? "transition-transform duration-300" : ""} p-2`
          }
        >
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            <h1>理財專案</h1>
          </div>
        </NavLink>
        {/* <NavLink
          to="/personalinformation"
          className={({ isActive, isPending, isTransitioning }) =>
            ` ${isActive ? "font-base rounded-xl bg-[#9DBEBB]" : "bg-transparent font-normal"} ${isPending ? "text-red-500" : "text-black"} ${isTransitioning ? "transition-transform duration-300" : ""} p-2`
          }
        >
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <h1>帳號管理</h1>
          </div>
        </NavLink> */}
      </div>
    </div>
  );
}

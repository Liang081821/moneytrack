import { useGlobalContext } from "@/context/GlobalContext";

export default function BalanceSheet() {
  const { property } = useGlobalContext();

  const groupProperty = property.filter((item) => item.balance > 0);
  const groupPropertyLiability = property.filter((item) => item.balance < 0);
  if (property.length === 0) {
    return (
      <div className="flex w-full items-center justify-center rounded-lg border bg-slate-500 p-6 text-white opacity-40 md:h-[595px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="mb-2 h-12 w-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
        <p>新增資產或負債</p>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center rounded-lg border-2 border-gray-500 bg-white p-3">
      <h2 className="mb-4 text-xl font-semibold">資產負債表</h2>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        {groupProperty.map((item) => (
          <div
            key={item.account}
            className="m-1 flex h-20 w-20 flex-col items-center justify-center rounded-lg border bg-[#A7CCED] p-2 xs:h-28 xs:w-28 sm:p-4 lg:h-32 lg:w-32 xl:h-48 xl:w-48"
          >
            <div className="text-xs sm:text-sm lg:text-xl">{item.account}</div>
            <div className="text-xs sm:text-sm lg:text-xl">
              NT$
              {item.balance.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-sm sm:text-base lg:text-xl">
              {item.account_type}帳
            </div>
          </div>
        ))}

        {groupPropertyLiability.map((item) => (
          <div
            key={item.account}
            className="m-1 flex h-20 w-20 flex-col items-center justify-center rounded-lg border bg-[#545E75] p-2 xs:h-28 xs:w-28 sm:p-4 lg:h-32 lg:w-32 xl:h-48 xl:w-48"
          >
            <div className="text-xs text-gray-200 sm:text-sm lg:text-xl">
              {item.account}
            </div>
            <div className="text-xs text-gray-200 sm:text-sm lg:text-xl">
              NT$
              {item.balance.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-sm text-gray-200 sm:text-base lg:text-xl">
              {item.account_type}帳
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

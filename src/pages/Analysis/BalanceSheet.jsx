import { useGlobalContext } from "@/context/GlobalContext";

export default function BalanceSheet() {
  const { property } = useGlobalContext();

  const groupProperty = property.filter((item) => item.balance > 0);
  const groupPropertyLiability = property.filter((item) => item.balance < 0);
  if (property.length === 0) {
    return (
      <div className="flex h-[595px] w-[420px] items-center justify-center rounded-lg border bg-slate-500 p-6 text-white opacity-40">
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
    <div className="flex h-auto w-full flex-col items-center rounded-xl bg-white p-3">
      <h2 className="mb-4 font-semibold">資產負債表</h2>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        {groupProperty.map((item) => (
          <div
            key={item.account}
            className="xs:h-28 xs:w-28 m-1 flex h-20 w-20 flex-col items-center justify-center rounded-xl border bg-[#9DBEBB] p-2 sm:p-4 lg:h-32 lg:w-32 xl:h-48 xl:w-48"
          >
            <div className="text-xs font-semibold sm:text-sm">
              {item.account}
            </div>
            <div className="text-xs font-semibold sm:text-sm">
              NT${item.balance}
            </div>
            <div className="text-sm text-gray-600 sm:text-base">
              {item.account_type}帳
            </div>
          </div>
        ))}

        {groupPropertyLiability.map((item) => (
          <div
            key={item.account}
            className="xs:h-28 xs:w-28 m-1 flex h-20 w-20 flex-col items-center justify-center rounded-xl border bg-[#E8E9ED] p-2 sm:p-4 lg:h-32 lg:w-32 xl:h-48 xl:w-48"
          >
            <div className="text-xs font-semibold sm:text-sm">
              {item.account}
            </div>
            <div className="text-xs font-semibold sm:text-sm">
              NT${item.balance}
            </div>
            <div className="text-sm text-gray-600 sm:text-base">
              {item.account_type}帳
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

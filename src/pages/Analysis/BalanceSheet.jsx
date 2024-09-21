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
    <div className="flex h-[595px] w-[420px] flex-col items-center rounded-2xl border border-black">
      <h2 className="mb-10">資產負債表</h2>
      <div className="flex flex-wrap justify-center">
        <div>
          {groupProperty.map((item) => (
            <div
              key={item.account}
              className="m-2 w-28 rounded-xl border bg-[#468189] p-2 text-white"
            >
              <div>{item.account}</div>
              <div>NT${item.balance}</div>
              <div className="text-xl">{item.account_type}帳</div>
            </div>
          ))}
        </div>
        <div>
          {groupPropertyLiability.map((item) => (
            <div
              key={item.account}
              className="m-2 w-28 rounded-xl border bg-[#b85925] p-2 text-white"
            >
              <div>{item.account}</div>
              <div>NT${item.balance}</div>
              <div className="text-xl">{item.account_type}帳</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useGlobalContext } from "@/context/GlobalContext";

export default function BalanceSheet() {
  const { property } = useGlobalContext();

  const groupProperty = property.filter((item) => item.balance > 0);
  const groupPropertyLiability = property.filter((item) => item.balance < 0);

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

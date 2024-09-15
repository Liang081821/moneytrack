import { useGlobalContext } from "../../context/GlobalContext";
export default function Consume() {
  const { property } = useGlobalContext();
  const consumeAccounts = Array.isArray(property)
    ? property.filter((item) => item.account_type === "消費")
    : [];

  return (
    <div className="flex h-[595px] w-[420px] flex-col items-center rounded-2xl border border-black">
      <div className="mt-3">消費</div>

      {/* 動態渲染篩選後的帳戶 */}
      {consumeAccounts.map((account) => (
        <div
          key={account.id}
          className="m-3 flex h-[88px] w-[360px] flex-col justify-center rounded-2xl border border-[#01B8E3] p-3"
        >
          <div className="text-xs">{account.account}</div>
          <div className="text-2xl">${account.balance}</div>
        </div>
      ))}
    </div>
  );
}

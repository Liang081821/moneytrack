import { useGlobalContext } from "@/context/GlobalContext";
import PropTypes from "prop-types";

export default function Step3({ expenseTotals, incomeTotals, netWorth }) {
  const { property } = useGlobalContext();

  const groupProperty = property.filter((item) => item.balance > 0);
  const groupPropertyLiability = property.filter((item) => item.balance < 0);

  Step3.propTypes = {
    expenseTotals: PropTypes.object.isRequired,
    incomeTotals: PropTypes.object.isRequired,
    netWorth: PropTypes.object.isRequired,
  };

  return (
    <div className="flex flex-col items-center rounded-2xl p-4 fade-in">
      <h2 className="mb-10 text-3xl">上月數據</h2>

      <div className="border-red flex flex-wrap justify-center border">
        {Object.entries(expenseTotals).map(([recordClass, total]) => (
          <div
            key={recordClass}
            className="m-2 w-28 rounded-xl border bg-[#F4E9CD] p-2"
          >
            <div>{recordClass}</div>
            <div className="text-xl">支出 NT${total}</div>
          </div>
        ))}

        {Object.entries(incomeTotals).map(([recordClass, total]) => (
          <div
            key={recordClass}
            className="m-2 w-28 rounded-xl border bg-[#468189] p-2 text-white"
          >
            <div>{recordClass}</div>
            <div className="text-xl">收入 NT${total}</div>
          </div>
        ))}

        <div className="m-2 w-28 rounded-xl border bg-[#031926] p-2 text-white">
          <div>儲蓄&投資</div>
          <div className="text-xl">NT${netWorth}</div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center">
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
  );
}

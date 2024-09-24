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
    <div className="flex flex-col items-center rounded-2xl pt-10 fade-in">
      <h2 className="mb-10 text-2xl font-semibold">數據報表</h2>

      {/* Flex 容器，將左右兩邊分開 */}
      <div className="flex w-full justify-center space-x-3">
        {/* 左邊：支出與收入 */}
        <div className="flex flex-1 flex-col items-center">
          <h2 className="mb-5 text-xl font-semibold">支出和收入數據</h2>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(expenseTotals).map(([recordClass, totalAmount]) => (
              <div
                key={recordClass}
                className="m-1 flex flex-col items-center justify-center rounded-xl border bg-[#9DBEBB] p-4"
              >
                <div className="text-sm font-semibold">{recordClass}</div>
                <div className="text-lg">NT${totalAmount.toFixed(0)}</div>
                <div className="text-base text-gray-600">支出</div>
              </div>
            ))}

            {Object.entries(incomeTotals).map(([recordClass, totalAmount]) => (
              <div
                key={recordClass}
                className="m-1 flex flex-col items-center justify-center rounded-xl border bg-[#E8E9ED] p-4"
              >
                <div className="text-sm font-semibold">{recordClass}</div>
                <div className="text-lg">NT${totalAmount.toFixed(0)}</div>
                <div className="text-base text-gray-600">收入</div>
              </div>
            ))}

            <div className="m-1 flex flex-col items-center justify-center rounded-xl border bg-[#F4E9CD] p-4">
              <div className="h-6 text-sm font-semibold">投資&儲蓄</div>
              <div className="text-lg">NT${netWorth}</div>
              <div className="text-base text-gray-600">淨現金流</div>
            </div>
          </div>
        </div>

        {/* 右邊：淨資產 */}
        <div className="flex flex-1 flex-col items-center">
          <h2 className="mb-5 text-xl font-semibold">淨資產數據</h2>
          <div className="grid grid-cols-3 gap-2">
            {groupProperty.map((item) => (
              <div
                key={item.account}
                className="m-1 flex flex-col items-center justify-center rounded-xl border bg-[#C4CAD0] p-4"
              >
                <div className="text-sm">{item.account}</div>
                <div className="text-lg">NT${item.balance}</div>
                <div className="text-base">{item.account_type}帳</div>
              </div>
            ))}
            {groupPropertyLiability.map((item) => (
              <div
                key={item.account}
                className="m-1 flex flex-col items-center justify-center rounded-xl border bg-[#D4BEBE] p-4"
              >
                <div className="text-sm">{item.account}</div>
                <div className="text-lg">NT${item.balance}</div>
                <div className="text-base">{item.account_type}帳</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

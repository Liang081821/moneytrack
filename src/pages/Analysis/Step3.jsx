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
    <div className="flex flex-col items-center rounded-2xl px-2 pt-10 fade-in">
      <h2 className="mb-10 text-2xl font-semibold">記帳數據</h2>

      <div className="flex h-72 w-full flex-col justify-center space-x-3 overflow-scroll pt-[450px] md:h-auto md:flex-row md:pt-0">
        <div className="flex flex-1 flex-col items-center">
          <h2 className="mb-5 text-xl font-semibold">支出和收入</h2>
          <div className="h-[360px] w-full overflow-scroll">
            {Object.entries(expenseTotals).map(([recordClass, totalAmount]) => (
              <div
                key={recordClass}
                className="m-1 flex items-center justify-between rounded-lg border bg-[#9dbebb] p-4 text-gray-800"
              >
                <div className="text-lg">{recordClass}</div>
                <div className="flex flex-col">
                  <div className="text-lg">
                    NT$
                    {totalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="self-end text-base">支出</div>
                </div>
              </div>
            ))}

            {Object.entries(incomeTotals).map(([recordClass, totalAmount]) => (
              <div
                key={recordClass}
                className="m-1 flex items-center justify-between rounded-lg border bg-[#e8e9ed] p-4 text-gray-800"
              >
                <div className="text-lg">{recordClass}</div>
                <div className="flex flex-col">
                  <div className="text-lg">
                    NT$
                    {totalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="self-end text-base">收入</div>
                </div>
              </div>
            ))}

            <div className="m-1 flex items-center justify-between rounded-lg border bg-[#babfd1] p-4 text-gray-800">
              <div className="h-6 text-lg">投資&儲蓄</div>
              <div className="flex flex-col">
                <div className="text-lg">
                  NT$
                  {netWorth.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="self-end text-base">淨現金流</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center">
          <h2 className="mb-5 text-xl font-semibold">淨資產</h2>
          <div className="h-[360px] w-full overflow-scroll">
            {groupProperty.map((item) => (
              <div
                key={item.account}
                className="m-1 flex items-center justify-between rounded-lg border bg-[#e8e9ed] p-4 text-gray-800"
              >
                <div className="text-lg">{item.account}</div>
                <div className="flex flex-col">
                  <div className="text-lg">
                    NT$
                    {item.balance.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="self-end text-base">
                    {item.account_type}帳
                  </div>
                </div>
              </div>
            ))}
            {groupPropertyLiability.map((item) => (
              <div
                key={item.account}
                className="m-1 flex items-center justify-between rounded-lg border bg-[#aaaaaa] p-4 text-white"
              >
                <div className="text-lg">{item.account}</div>
                <div className="flex flex-col">
                  <div className="text-lg">
                    NT$
                    {item.balance.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="self-end text-base">
                    {item.account_type}帳
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

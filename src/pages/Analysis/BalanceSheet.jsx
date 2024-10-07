import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect, useState } from "react";
export default function BalanceSheet() {
  const { property } = useGlobalContext();
  const [totalProperty, setTotalProperty] = useState(0);
  const groupProperty = property.filter((item) => item.balance > 0);
  const groupPropertyLiability = property.filter((item) => item.balance < 0);
  useEffect(() => {
    const totalPropertyCaculate = property.reduce(
      (accumulate, value) => accumulate + value.balance,
      0,
    );
    setTotalProperty(totalPropertyCaculate);
  }, [setTotalProperty, property]);

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
    <div className="flex max-h-[100vh] w-full flex-col items-center overflow-scroll rounded-lg">
      <h2 className="mb-2 w-full rounded-lg bg-[#fcfcfc] p-4 text-center text-xl font-semibold shadow-lg">
        資產負債表
      </h2>
      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-col items-center gap-2 rounded-lg bg-[#fcfcfc] px-7 py-4 shadow-lg">
          <p className="text-sm font-semibold sm:text-base lg:text-lg">資產</p>
          {groupProperty.map((item) => (
            <div
              key={item.account}
              className="flex h-20 w-full items-center justify-between rounded-lg border bg-[#9DBEBB] p-4 text-white"
            >
              <div className="flex flex-col gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                  />
                </svg>
                <div className="text-xs font-semibold sm:text-sm lg:text-lg">
                  {item.account}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="self-end text-xs font-semibold sm:text-sm lg:text-xl">
                  NT$
                  {item.balance.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="lg:text-md self-end text-sm sm:text-base">
                  {item.account_type}帳
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg bg-[#fcfcfc] px-7 py-4 shadow-lg">
          <p className="text-sm font-semibold sm:text-base lg:text-lg">負債</p>
          {groupPropertyLiability.map((item) => (
            <div
              key={item.account}
              className="flex h-20 w-full items-center justify-between rounded-lg border bg-[#CC7178] p-4 text-white"
            >
              <div className="flex flex-col gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                  />
                </svg>

                <div className="text-xs font-semibold sm:text-sm lg:text-lg">
                  {item.account}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="self-end text-xs font-semibold sm:text-sm lg:text-xl">
                  NT$
                  {item.balance.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="lg:text-md self-end text-sm sm:text-base">
                  {item.account_type}帳
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg bg-[#fcfcfc] px-7 py-4 shadow-lg">
          <p className="text-sm font-semibold sm:text-base lg:text-lg">
            淨資產
          </p>
          <div className="flex h-20 w-full items-center justify-between rounded-lg border bg-[#aaaaaa] p-4 text-white">
            <div className="flex flex-col gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                />
              </svg>

              <div className="text-xs font-semibold sm:text-sm lg:text-lg">
                淨資產{" "}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="self-end text-xs font-semibold sm:text-sm lg:text-xl">
                NT$
                {totalProperty.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="lg:text-md self-end text-sm sm:text-base"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

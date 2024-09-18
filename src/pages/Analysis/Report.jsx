import MonthlyData from "../Analysis/MonthlyData";
import BalanceSheet from "../Analysis/BalanceSheet";
import { useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

export default function Report() {
  const { property } = useGlobalContext();

  const [reportVisible, setReportVisible] = useState(false);
  const [monthexpense, setmonthExpense] = useState(0);
  const [monthincome, setmonthIncome] = useState(0);
  const [houseExpense, setHouseExpense] = useState(0);

  const emergyAccounts = property
    .filter((item) => item.account_type === "儲蓄")
    .reduce((accumulate, value) => {
      return accumulate + value.balance;
    }, 0);
  const totalProperty = property.reduce((accumulate, value) => {
    return accumulate + value.balance;
  }, 0);

  const savingRate = (
    ((monthincome - monthexpense) / monthincome) *
    100
  ).toFixed(0);
  const houseingRate = ((houseExpense / monthincome) * 100).toFixed(0);

  const handleAddReport = () => {
    setReportVisible(true);
  };

  const handleCloseReport = () => {
    setReportVisible(false);
  };
  return (
    <div className="mt-7 flex w-full flex-col items-center">
      <button
        onClick={() => handleAddReport()}
        className="mx-3 mb-3 flex h-[48px] w-[150px] items-center justify-center self-end rounded-2xl border bg-gradient-to-r from-[#3E79E5] to-[#01B8E3] text-white"
      >
        生成報表
      </button>
      <div className="mt-14 flex w-full justify-center">
        <MonthlyData
          setmonthExpense={setmonthExpense}
          setmonthIncome={setmonthIncome}
          setHouseExpense={setHouseExpense}
        />
        <BalanceSheet />
      </div>
      {/* 報表顯示 */}
      {reportVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">報表</h2>
              <button
                onClick={handleCloseReport}
                className="rounded-full bg-red-500 p-2 text-white"
              >
                關閉
              </button>
            </div>

            {/* 報表內容 */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">數據總覽</h3>
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      健檢項目
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      總金額
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      說明
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">淨資產</td>
                    <td className="border border-gray-300 px-4 py-2">
                      NT${totalProperty}
                    </td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">總支出</td>
                    <td className="border border-gray-300 px-4 py-2">
                      -NT${monthexpense}
                    </td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">總收入</td>
                    <td className="border border-gray-300 px-4 py-2">
                      NT${monthincome}
                    </td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      每月淨現金流
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      NT${monthincome - monthexpense}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      您每月可以存下的錢
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">儲蓄率</td>

                    {savingRate > 30 ? (
                      <>
                        <td className="border border-gray-300 px-4 py-2">
                          {savingRate}%
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-green-500">
                          達標，高於30%
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border border-gray-300 px-4 py-2 text-red-600">
                          {savingRate}%
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-red-600">
                          未達標，建議高於 30%
                        </td>
                      </>
                    )}
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      房貸/房租率
                    </td>
                    {houseingRate < 30 ? (
                      <>
                        <td className="border border-gray-300 px-4 py-2">
                          {houseingRate}%
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          達標，低於30%
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border border-gray-300 px-4 py-2 text-red-600">
                          {houseingRate}%
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-red-600">
                          太高了，建議低於 30%
                        </td>
                      </>
                    )}
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      緊急預備金應有
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      NT${monthexpense * 6}
                    </td>
                    {emergyAccounts > monthexpense * 6 ? (
                      <td className="border border-gray-300 px-4 py-2 text-green-500">
                        達標，手上儲蓄超過這金額
                      </td>
                    ) : (
                      <td className="border border-gray-300 px-4 py-2 text-red-600">
                        太低了，手上目前儲蓄有 NT$ {emergyAccounts}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      一年約能存
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      NT${(monthincome - monthexpense) * 12}
                    </td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

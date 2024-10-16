import Alert from "@/components/Alert";
import { useGlobalContext } from "@/context/GlobalContext";
import { addDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getFirestoreRefs } from "../../firebase/api";

export default function Step4({
  monthexpense,
  monthincome,
  expenseRecords,
  selectedHouseCategory,
  selectedInsureCategory,
  totalProperty,
  setTotalProperty,
  setSavingRate,
  savingRate,
}) {
  const { property, loginEmail } = useGlobalContext();
  const { reportCollectionRef } = getFirestoreRefs(loginEmail);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const emergyAccounts = property
    .filter((item) => item.account_type === "儲蓄")
    .reduce((accumulate, value) => accumulate + value.balance, 0);

  useEffect(() => {
    const totalProperty = property.reduce(
      (accumulate, value) => accumulate + value.balance,
      0,
    );
    setTotalProperty(totalProperty);
    const savingRate = (
      ((monthincome - monthexpense) / monthincome) *
      100
    ).toFixed(0);
    setSavingRate(savingRate);
  }, [monthexpense, monthincome, setSavingRate, setTotalProperty, property]);

  const expensetype = expenseRecords
    .filter((item) => item.class === selectedHouseCategory)
    .reduce((accumulate, value) => accumulate + value.amount, 0);

  const insuretype = expenseRecords
    .filter((item) => item.class === selectedInsureCategory)
    .reduce((accumulate, value) => accumulate + value.amount, 0);

  const insureRate = ((insuretype / monthincome) * 100).toFixed(0);
  const houseingRate = ((expensetype / monthincome) * 100).toFixed(0);

  const handleSaveReport = async () => {
    const rows = [
      ["健檢項目", "總金額", "說明"],
      [
        "淨資產",
        `NT$${totalProperty.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`,
        "",
      ],
      [
        "總支出",
        `-NT$${monthexpense.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`,
        "",
      ],
      [
        "總收入",
        `NT$${monthincome.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`,
        "",
      ],
      [
        "每月淨現金流",
        `NT$${monthincome - monthexpense}`,
        "您每月可以存下的錢",
      ],
      [
        "儲蓄率",
        `${savingRate}%`,
        savingRate > 30 ? "達標，高於30%" : "未達標，建議高於 30%",
      ],
      [
        "房貸/房租率",
        `${houseingRate}%`,
        houseingRate < 30 ? "達標，低於30%" : "太高了，建議低於 30%",
      ],
      [
        "保險比例",
        `${insureRate}%`,
        insureRate < 10 ? "達標，低於10%" : "太高了，建議低於 10%",
      ],
      [
        "緊急預備金應有",
        `NT$${monthexpense * 6}`,
        emergyAccounts > monthexpense * 6
          ? "達標，手上儲蓄超過這金額"
          : `太低了，手上目前儲蓄有 NT$ ${emergyAccounts}`,
      ],
      ["一年約能存", `NT$${(monthincome - monthexpense) * 12}`, ""],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveToFirebase = async () => {
    const currentDate = new Date();
    const lastMonth = new Date(
      currentDate.setMonth(currentDate.getMonth() - 1),
    );
    const year = lastMonth.getFullYear();
    const month = lastMonth.getMonth() + 1;

    try {
      await addDoc(reportCollectionRef, {
        totalProperty,
        monthexpense,
        monthincome,
        savingRate,
        houseingRate,
        insureRate,
        emergynumberrecommend: monthexpense * 6,
        net: monthincome - monthexpense,
        reportMonth: {
          year: year,
          month: month,
        },
        timestamp: new Date(),
      });
      setAlertMessage("成功儲存");
    } catch (error) {
      console.error("儲存到 Firebase 時發生錯誤：", error);
      alert("儲存時發生錯誤");
    } finally {
      setLoading(false);
    }
  };

  Step4.propTypes = {
    preText: PropTypes.func.isRequired,
    setPreText: PropTypes.func.isRequired,
    totalProperty: PropTypes.func.isRequired,
    setTotalProperty: PropTypes.func.isRequired,
    setSavingRate: PropTypes.func.isRequired,
    savingRate: PropTypes.func.isRequired,
    monthexpense: PropTypes.number.isRequired,
    monthincome: PropTypes.number.isRequired,
    expenseRecords: PropTypes.array.isRequired,
    selectedHouseCategory: PropTypes.string.isRequired,
    selectedInsureCategory: PropTypes.string.isRequired,
  };

  return (
    <div className="flex h-full flex-col items-center justify-center py-5 fade-in">
      <h2 className="pb-2 text-2xl font-bold">報表</h2>
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
      {loading && (
        <div className="flex items-center justify-center">載入中 ...</div>
      )}

      {!loading && (
        <div className="w-full fade-in">
          <div className="mb-1 h-80 overflow-scroll">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">健檢項目</th>
                  <th className="border border-gray-300 px-4 py-2">總金額</th>
                  <th className="border border-gray-300 px-4 py-2">說明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">淨資產</td>
                  <td className="border border-gray-300 px-4 py-2">
                    NT$
                    {totalProperty.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">總支出</td>
                  <td className="border border-gray-300 px-4 py-2">
                    -NT$
                    {monthexpense.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">總收入</td>
                  <td className="border border-gray-300 px-4 py-2">
                    NT$
                    {monthincome.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    每月淨現金流
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    NT$
                    {(monthincome - monthexpense).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    您每月可以存下的錢
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">儲蓄率</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {isNaN(savingRate)
                      ? ""
                      : savingRate > 30
                        ? `${savingRate}%`
                        : savingRate < 0
                          ? "支出超支"
                          : savingRate > 0
                            ? `${savingRate}%`
                            : "無儲蓄"}
                  </td>
                  <td
                    className={`border border-gray-300 px-4 py-2 ${savingRate > 30 ? "text-green-500" : "text-red-600"}`}
                  >
                    {savingRate > 30 ? "達標，高於30%" : "未達標，建議高於 30%"}
                  </td>
                </tr>
                {selectedHouseCategory !== "無" ? (
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      房貸/房租率
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {isNaN(houseingRate) ? "無數據" : `${houseingRate}%`}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 ${houseingRate < 30 ? "text-green-500" : "text-red-600"}`}
                    >
                      {houseingRate < 30
                        ? "達標，低於30%"
                        : "太高了，建議低於 30%"}
                    </td>
                  </tr>
                ) : (
                  <></>
                )}
                {selectedInsureCategory !== "無" ? (
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      保險比例
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {isNaN(insureRate) ? "無數據" : `${insureRate}%`}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 ${insureRate < 10 ? "text-green-500" : "text-red-600"}`}
                    >
                      {insureRate < 10
                        ? "達標，低於10%"
                        : "太高了，建議低於 10%"}
                    </td>
                  </tr>
                ) : (
                  <></>
                )}
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    緊急預備金應有
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    NT${monthexpense * 6}
                  </td>
                  <td
                    className={`border border-gray-300 px-4 py-2 ${emergyAccounts > monthexpense * 6 ? "text-green-500" : "text-red-600"}`}
                  >
                    {emergyAccounts > monthexpense * 6
                      ? "達標，手上儲蓄超過這金額"
                      : `太低了，手上目前儲蓄有 NT$ ${emergyAccounts.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          },
                        )}`}
                  </td>
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
          <div className="flex justify-center">
            <button
              onClick={handleSaveReport}
              className="mt-1 rounded-lg bg-[#9DBEBB] p-2 text-white"
            >
              下載 CSV
            </button>
            <button
              onClick={handleSaveToFirebase}
              className="ml-4 mt-1 rounded-lg bg-[#607196] p-2 text-white"
            >
              儲存報表
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

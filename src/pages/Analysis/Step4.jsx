import PropTypes from "prop-types";
import { useGlobalContext } from "@/context/GlobalContext";
import { getFirestoreRefs } from "../../firebase/api";
import { addDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function Step4({
  monthexpense,
  monthincome,
  expenseRecords,
  selectedHouseCategory,
  selectedInsureCategory,
}) {
  const { property, loginEmail } = useGlobalContext();
  const { reportCollectionRef } = getFirestoreRefs(loginEmail);
  const [loading, setLoading] = useState(true); // 初始設置為 true

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // 三秒後設置為 false
    }, 2000);

    return () => clearTimeout(timer); // 清除定時器
  }, []);

  const emergyAccounts = property
    .filter((item) => item.account_type === "儲蓄")
    .reduce((accumulate, value) => accumulate + value.balance, 0);

  const totalProperty = property.reduce(
    (accumulate, value) => accumulate + value.balance,
    0,
  );

  const savingRate = (
    ((monthincome - monthexpense) / monthincome) *
    100
  ).toFixed(0);

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
      ["淨資產", `NT$${totalProperty}`, ""],
      ["總支出", `-NT$${monthexpense}`, ""],
      ["總收入", `NT$${monthincome}`, ""],
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

    // 生成 CSV 格式
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
      alert("成功儲存");
    } catch (error) {
      console.error("儲存到 Firebase 時發生錯誤：", error);
      alert("儲存時發生錯誤");
    } finally {
      setLoading(false); // 停止加載
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center fade-in">
      <h2 className="text-2xl font-bold">報表</h2>

      {loading && (
        <div className="flex items-center justify-center">載入中 ...</div>
      )}

      {!loading && (
        <div className="w-full fade-in">
          {/* 報表內容 */}
          <div className="mb-4">
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
                  <td className="border border-gray-300 px-4 py-2">
                    {savingRate}%
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
                      {houseingRate}%
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
                      {insureRate}%
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
                      : `太低了，手上目前儲蓄有 NT$ ${emergyAccounts}`}
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
              className="mt-4 rounded-md bg-green-500 p-2 text-white"
            >
              下載 CSV
            </button>
            <button
              onClick={handleSaveToFirebase}
              className="ml-4 mt-4 rounded-md bg-blue-500 p-2 text-white"
            >
              儲存報表
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

Step4.propTypes = {
  monthexpense: PropTypes.number.isRequired,
  monthincome: PropTypes.number.isRequired,
  expenseRecords: PropTypes.array.isRequired,
  selectedHouseCategory: PropTypes.string.isRequired,
  selectedInsureCategory: PropTypes.string.isRequired,
};

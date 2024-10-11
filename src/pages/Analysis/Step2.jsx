import { useGlobalContext } from "@/context/GlobalContext";
import PropTypes from "prop-types";

export default function Step2({
  setSelectedHouseCategory,
  setSelectedInsureCategory,
  selectedInsureCategory,
  selectedHouseCategory,
}) {
  const { classData } = useGlobalContext();

  // 處理分類選擇
  const handleHouseCategoryClick = (category) => {
    setSelectedHouseCategory(category);
    console.log("計算出的房屋支出：", category);
  };

  const handleInsureCategoryClick = (category) => {
    setSelectedInsureCategory(category);
  };

  Step2.propTypes = {
    setSelectedHouseCategory: PropTypes.func.isRequired,
    setSelectedInsureCategory: PropTypes.func.isRequired,
    selectedInsureCategory: PropTypes.string.isRequired,
    selectedHouseCategory: PropTypes.string.isRequired,
  };

  return (
    <div className="flex h-full flex-col items-center justify-center pt-10 fade-in">
      <h2 className="text-2xl font-semibold">設定統計數據</h2>
      <div>
        <h2 className="mb-1 mt-7 text-xl font-semibold">
          1. 選擇您記帳使用的「房貸/房租」分類
        </h2>
        <p className="text-lg text-gray-500">
          後續步驟會為您計算房貸/租相關比率，因此您需要選擇記帳時自定義的分類！
        </p>

        {/* 渲染按鈕組合 */}
        <div className="mt-4 flex space-x-2">
          {classData.expense &&
            classData.expense.map((category, index) => (
              <button
                key={index}
                onClick={() => handleHouseCategoryClick(category)}
                className={`rounded-lg border px-4 py-2 ${
                  selectedHouseCategory === category
                    ? "bg-[#545E75] text-gray-200"
                    : "bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          <button
            onClick={() => handleHouseCategoryClick("無")}
            className={`rounded-lg border px-4 py-2 ${
              selectedHouseCategory === "無"
                ? "bg-[#545E75] text-gray-200"
                : "bg-gray-200"
            }`}
          >
            無
          </button>
        </div>

        <h2 className="mb-1 mt-7 text-xl font-semibold">
          2. 選擇您紀錄「保險」支出的分類
        </h2>
        <p className="text-lg text-gray-500">
          後續步驟會為您計算保險相關比率，因此您需要選擇記帳時自定義的分類！
        </p>

        {/* 渲染按鈕組合 */}
        <div className="mt-4 flex space-x-2">
          {classData.expense &&
            classData.expense.map((category, index) => (
              <button
                key={index}
                onClick={() => handleInsureCategoryClick(category)}
                className={`rounded-lg border px-4 py-2 ${
                  selectedInsureCategory === category
                    ? "bg-[#545E75] text-gray-200"
                    : "bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          <button
            onClick={() => handleInsureCategoryClick("無")}
            className={`rounded-lg border px-4 py-2 ${
              selectedInsureCategory === "無"
                ? "bg-[#545E75] text-gray-200"
                : "bg-gray-200"
            }`}
          >
            無
          </button>
        </div>
      </div>
    </div>
  );
}

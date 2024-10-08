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
    <div className="flex h-full flex-col items-center pt-10 fade-in">
      <h2 className="mb-10 text-2xl font-semibold">設定統計數據</h2>
      <div>
        <h2 className="mt-7 text-xl">1. 選擇您房貸/房租使用的支出分類</h2>

        {/* 渲染按鈕組合 */}
        <div className="mt-4 flex space-x-2">
          {classData.expense.map((category, index) => (
            <button
              key={index}
              onClick={() => handleHouseCategoryClick(category)}
              className={`rounded-md border p-2 ${
                selectedHouseCategory === category
                  ? "bg-[#F4E9CD]"
                  : "bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
          <button
            onClick={() => handleHouseCategoryClick("無")}
            className={`rounded-md border p-2 ${
              selectedHouseCategory === "無" ? "bg-[#F4E9CD]" : "bg-gray-200"
            }`}
          >
            無
          </button>
        </div>

        <h2 className="mt-7 text-xl">2. 選擇您保險使用的支出分類</h2>

        {/* 渲染按鈕組合 */}
        <div className="mt-4 flex space-x-2">
          {classData.expense.map((category, index) => (
            <button
              key={index}
              onClick={() => handleInsureCategoryClick(category)}
              className={`rounded-md border p-2 ${
                selectedInsureCategory === category
                  ? "bg-[#F4E9CD]"
                  : "bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
          <button
            onClick={() => handleInsureCategoryClick("無")}
            className={`rounded-md border p-2 ${
              selectedInsureCategory === "無" ? "bg-[#F4E9CD]" : "bg-gray-200"
            }`}
          >
            無
          </button>
        </div>
      </div>
    </div>
  );
}

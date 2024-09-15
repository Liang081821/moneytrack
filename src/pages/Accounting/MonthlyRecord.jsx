export default function MonthlyRecord() {
  return (
    <div className="h-[685px] w-[420px] rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      <div>月份收支表</div>
      <div className="flex justify-center gap-10">
        <div className="border border-black">總和</div>
        <div className="border border-black">花費</div>
        <div className="border border-black">收入</div>
        <div className="border border-black">轉帳</div>
      </div>
      <div>2024</div>
      <div className="flex">
        <div className="mr-2 flex flex-col items-center text-black">
          <div>8 月</div>
          <div>7 月</div>
        </div>

        <div className="h-96 w-[1px] bg-black"></div>

        <div className="ml-2 flex flex-col justify-start">
          <div className="mb-2 flex w-[300px] items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 h-2 w-4 rounded-full bg-yellow-500"></div>

              <span className="mr-4 text-gray-500">9%</span>
            </div>

            <span className="text-gray-700">28,311</span>
          </div>

          <div className="mb-2 flex w-[300px] items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 h-2 w-4 rounded-full bg-yellow-500"></div>

              <span className="mr-4 text-gray-500">11%</span>
            </div>

            <span className="text-gray-700">33,311</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DailyRecord() {
  return (
    <div className="h-[324px] w-[540px] rounded-md border border-gray-200 bg-white p-4 shadow-lg">
      <div>每日紀錄</div>
      <div>
        <div className="flex items-center">
          <div>8月30日 週五</div>
          <div className="mx-auto w-40 border-[0.5px] border-black"></div>
          <div>NT$ 375</div>
        </div>
        <div>
          <div>消費</div>
          <div className="flex justify-around">
            <div>食物</div>
            <div>70</div>
          </div>
          <div className="flex justify-around">
            <div>食物</div>
            <div>70</div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center">
          <div>8月29日 週五</div>
          <div className="mx-auto w-40 border-[0.5px] border-black"></div>
          <div>NT$ 375</div>
        </div>
        <div>
          <div>消費</div>
          <div className="flex justify-around">
            <div>食物</div>
            <div>70</div>
          </div>
          <div className="flex justify-around">
            <div>食物</div>
            <div>70</div>
          </div>
        </div>
      </div>
    </div>
  );
}

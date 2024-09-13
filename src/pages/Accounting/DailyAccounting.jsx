export default function DailyAccounting() {
  return (
    <div className="flex h-[378px] w-[420px] flex-col items-center rounded-md border border-gray-200 bg-white p-4 shadow-lg">
      <div className="h-[48px] w-[345px] text-center">每日記帳</div>
      <div className="flex h-[48px] w-[345px] items-center justify-center border border-black text-center">
        2024.08.31
      </div>
      <div className="flex h-[48px] w-[345px] items-center justify-center border border-black text-center">
        帳戶類別
      </div>
      <div className="flex h-[48px] w-[345px] items-center justify-center border border-black text-center">
        收入
      </div>
      <div className="flex h-[48px] w-[345px] items-center justify-center border border-black text-center">
        分類
      </div>
      <div className="flex h-[48px] w-[345px] items-center justify-center border border-black text-center">
        價格
      </div>
    </div>
  );
}

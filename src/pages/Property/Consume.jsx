export default function Consume() {
  return (
    <div className="flex h-[595px] w-[420px] flex-col items-center rounded-2xl border border-black">
      <div className="mt-3">消費</div>
      <div className="m-3 flex h-[88px] w-[360px] flex-col justify-center rounded-2xl border border-[#01B8E3] p-3">
        <div className="text-xs">中國信託</div>
        <div className="text-2xl">$7,785</div>
      </div>
      <div className="m-3 flex h-[88px] w-[360px] flex-col justify-center rounded-2xl border border-[#01B8E3] p-3">
        <div className="text-xs">中國信託</div>
        <div className="text-2xl">$7,785</div>
      </div>
      <div className="m-3 flex h-[88px] w-[360px] flex-col justify-center rounded-2xl border border-[#01B8E3] p-3">
        <div className="text-xs">中國信託</div>
        <div className="text-2xl">$7,785</div>
      </div>

      <button className="mx-3 mb-3 mt-auto flex h-[64px] w-[360px] items-center justify-center rounded-2xl border bg-gradient-to-r from-[#3E79E5] to-[#01B8E3] text-white">
        新增帳戶
      </button>
    </div>
  );
}

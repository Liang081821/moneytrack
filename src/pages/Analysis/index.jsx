import Report from "./Report";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useState, useEffect } from "react";

export default function Analysis() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模擬 2 秒延遲，然後取消 loading 狀態
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    // 清理計時器
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    // 顯示骨架屏
    return (
      <div className="w-full pt-5">
        <div className="mx-auto mb-[10vh] flex w-[85%] flex-col pl-11 md:pl-0">
          {/* 頁面標題的骨架 */}
          <Skeleton height={72} width="100%" />

          {/* 帳戶細節區塊的骨架 */}
          <div className="mt-2 flex w-full flex-col gap-2 md:flex-row">
            <div className="h-[300px] w-full md:h-[700px]">
              <Skeleton height="100%" flex-grow />
            </div>
            <div className="h-[300px] w-full md:h-[700px]">
              <Skeleton height="100%" flex-grow />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center bg-gradient-to-r from-[#e3e3e3] via-[#efefef] to-[#e3e3e3] pl-11 pt-5 fade-in md:pl-0">
      <Report />
    </div>
  );
}

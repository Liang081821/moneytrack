import ProjectLayoutGrid from "./ProjectLayoutGrid";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

export default function Project() {
  const [loading, setLoading] = useState(true);
  const { projectData } = useGlobalContext();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (Array.isArray(projectData) && projectData.length === 0 && isFirstLoad) {
      const timer = setTimeout(() => {
        setLoading(false);
        setIsFirstLoad(false);
      }, 2500);

      return () => clearTimeout(timer);
    } else if (Array.isArray(projectData) && projectData.length > 0) {
      setLoading(false);
      setIsFirstLoad(false);
    }
  }, [projectData]);
  if (loading && isFirstLoad) {
    // 顯示骨架屏
    return (
      <div className="w-full pt-5">
        <div className="mx-auto mb-[10vh] flex w-[85%] flex-col pl-11 md:pl-0">
          {/* 頁面標題的骨架 */}
          <Skeleton height={72} width="100%" />

          {/* 帳戶細節區塊的骨架 */}
          <div className="mt-2 flex w-full flex-col gap-2 md:flex-row">
            <div className="w-full md:w-[450px]">
              <Skeleton height={300} w="100%" />
            </div>
            <div className="w-full md:w-[450px]">
              <Skeleton height={300} w="100%" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full justify-center bg-gradient-to-r from-[#e3e3e3] via-[#efefef] to-[#e3e3e3] pl-11 fade-in md:pl-0">
      <ProjectLayoutGrid />
    </div>
  );
}

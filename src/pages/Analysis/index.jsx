import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Report from "./Report";

export default function Analysis() {
  const [loading, setLoading] = useState(true);
  const { transactionData } = useGlobalContext();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (
      Array.isArray(transactionData) &&
      transactionData.length === 0 &&
      isFirstLoad
    ) {
      const timer = setTimeout(() => {
        setLoading(false);
        setIsFirstLoad(false);
      }, 2500);

      return () => clearTimeout(timer);
    } else if (Array.isArray(transactionData) && transactionData.length > 0) {
      setLoading(false);
      setIsFirstLoad(false);
    }
  }, [transactionData]);

  if (loading && isFirstLoad) {
    return (
      <div className="w-full pt-5">
        <div className="mx-auto mb-[10vh] flex w-[85%] flex-col pl-11 md:pl-0">
          <Skeleton height={72} width="100%" />

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

import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Nav from "./components/Nav";
import DailyAccounting from "./pages/Accounting/DailyAccounting";
import { useGlobalContext } from "./context/GlobalContext";
import { useState, useEffect } from "react";

function App() {
  const { accounting, setAccounting } = useGlobalContext();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isVisible, setIsVisible] = useState(false);

  const startAccounting = () => {
    setAccounting(true);
  };
  useEffect(() => {
    const savedOfflineStatus = localStorage.getItem("isOffline");
    if (savedOfflineStatus) {
      setIsOffline(savedOfflineStatus === "true");
      setIsVisible(savedOfflineStatus === "true");
    }

    const handleOnline = () => {
      setIsVisible(false);
      setTimeout(() => {
        setIsOffline(false);
        localStorage.setItem("isOffline", "false");
      }, 500);
    };

    const handleOffline = () => {
      setIsOffline(true);
      localStorage.setItem("isOffline", "true");
      setTimeout(() => setIsVisible(true), 10);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      <Header linkToBackstage={false} />
      <div className="mt-[80px] flex min-h-[100vh] items-stretch justify-start">
        <Nav className="h-auto" />
        <Outlet />
      </div>
      <div
        onClick={() => startAccounting()}
        className="joyride-accounting group fixed bottom-16 right-4 flex h-16 w-16 cursor-pointer items-center justify-center rounded-[50%] bg-white shadow-lg transition-all duration-300 hover:w-56 hover:rounded-full hover:opacity-100"
      >
        <div className="relative flex h-full w-full items-center justify-center">
          {/* SVG 圖標 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-8 w-8 transition-opacity duration-200 group-hover:opacity-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>

          {/* 顯示文字 */}
          <span className="absolute left-20 w-0 overflow-hidden text-lg font-semibold opacity-0 transition-all duration-200 group-hover:w-auto group-hover:whitespace-nowrap group-hover:opacity-100 group-hover:delay-200">
            我要記帳
          </span>
        </div>
      </div>

      {/* 離線提示區塊，帶有滑入/滑出的動畫 */}
      {isOffline && (
        <div
          className={`absolute bottom-10 left-10 z-50 flex w-[200px] flex-col items-start rounded-lg bg-white px-10 py-10 shadow-md transition-transform duration-500 md:w-[600px] ${
            isVisible ? "translate-x-0" : "-translate-x-[120%]"
          }`}
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="red"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mb-1 size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>

            <p className="mb-2 text-xl font-semibold">您處於離線狀態。</p>
          </div>
          <p className="text-xl">您可以繼續使用記帳功能。</p>
        </div>
      )}
      {accounting && <DailyAccounting setAccounting={setAccounting} />}
    </>
  );
}

export default App;

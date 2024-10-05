import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Nav from "./components/Nav";
import DailyAccounting from "./pages/Accounting/DailyAccounting";
import Edit from "../public/pencil-square.png";
import { useState } from "react";
function App() {
  const [accounting, setAccounting] = useState(false);
  const startAccounting = () => {
    setAccounting(true);
  };
  return (
    <>
      <Header linkToBackstage={false} />
      <div className="mt-[80px] flex min-h-[100vh] items-stretch justify-start">
        <Nav className="h-auto" />
        <Outlet />
        {/* <RightNav /> */}
      </div>
      <div
        onClick={() => startAccounting()}
        className="group fixed bottom-16 right-4 flex h-16 w-16 cursor-pointer items-center justify-center rounded-[50%] border-2 border-gray-500 bg-white transition-all duration-100 hover:w-56 hover:rounded-full hover:opacity-100"
      >
        <div className="relative flex h-full w-full items-center justify-center">
          {/* SVG 圖標 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-8 w-8 transition-opacity duration-100 group-hover:opacity-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>

          {/* 顯示文字 */}
          <span className="absolute left-20 text-lg font-semibold opacity-0 transition-opacity duration-100 group-hover:opacity-100">
            我要記帳
          </span>
        </div>
      </div>

      {accounting && <DailyAccounting setAccounting={setAccounting} />}
    </>
  );
}

export default App;

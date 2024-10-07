import { createContext, useContext, useState } from "react";

const JoyrideContext = createContext();

export const JoyrideProvider = ({ children }) => {
  //第一頁
  const [run, setRun] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const steps = [
    {
      target: ".joyride-account",
      content:
        "1、開始記帳前，您需要先新增帳戶，帳戶類型可以根據需求，新增在消費、投資或是儲蓄中。",
      disableBeacon: true,
    },

    {
      target: ".joyride-accounting",
      content: "2、點擊此處，進到記帳儀表板。",
      disableBeacon: true,
    },
    {
      target: ".joyride-class",
      content: "3、新增分類後，即可開始您的記帳。",
      disableBeacon: true,
    },
    {
      target: ".joyride-startaccounting",
      content: "4、選擇各項內容，即可開始記帳！",
      disableBeacon: true,
    },
    {
      target: ".joyride-totalproperty",
      content: "5、您可以定期檢視自己的淨資產分佈狀況。",
      disableBeacon: true,
    },
  ];
  //第二頁
  const [dataRun, setDataRun] = useState(true);
  const [stepDataIndex, setStepDataIndex] = useState(0);
  const dataSteps = [
    {
      target: ".joyride-datachange",
      content: "1、此區塊是支出變化表，可以檢視當月每日的支出變化。",
      disableBeacon: true,
    },

    {
      target: ".joyride-income",
      content: "2、本區塊是本月收入分佈，掌握收入比例及來源。",
      disableBeacon: true,
    },
    {
      target: ".joyride-transaction",
      content: "3、本區塊會紀錄每一筆交易數據，您可以點選每一筆紀錄進行編輯。",
      disableBeacon: true,
    },
    {
      target: ".joyride-expense",
      content: "4、本區塊是支出分佈圓餅圖，讓您掌握本月份的支出分佈及金額。",
      disableBeacon: true,
    },
    {
      target: ".joyride-balance",
      content: "5、本月收支餘額，隨時提醒您可支配的餘額。",
      disableBeacon: true,
    },
    {
      target: ".joyride-changemonth",
      content: "6、可透過上方按鈕切換月份，檢視不同月份數據。",
      disableBeacon: true,
    },
    {
      target: ".joyride-drag",
      content: "7、每個區塊的圖表可以點擊上方標題進行拖動，自定義儀表板排版。",
      disableBeacon: true,
    },
  ];
  //第三頁
  const [analysisRun, setAnalysisRun] = useState(true);
  const [stepAnalysisIndex, setStepAnalysisIndex] = useState(0);
  const analysisSteps = [
    {
      target: ".joyride-monthlydata",
      content: "1、此區塊會統計您上個月的收支數據，提供您重新檢視。",
      disableBeacon: true,
    },

    {
      target: ".joyride-balancesheet",
      content:
        "2、此區塊將正資產及負債透過顏色區隔出來，您可以對資產狀況一目瞭然。",
      disableBeacon: true,
    },
    {
      target: ".joyride-generatereport",
      content: "3、每月過後，您可以點選財務健檢，我們會為您進行全面的分析。",
      disableBeacon: true,
    },
    {
      target: ".joyride-report",
      content: "4、分析後的健檢報告將出現在下方供您回顧。",
      disableBeacon: true,
    },
  ];
  //第四頁
  const [projectRun, setProjectRun] = useState(true);
  const [stepProjectIndex, setStepProjectIndex] = useState(0);
  const projectSteps = [
    {
      target: ".joyride-project",
      content:
        "1、理財專案區，您可以將新增旅遊計畫、結婚、儲蓄等等目的明確的專案，讓未來方便檢視。",
      disableBeacon: true,
    },

    {
      target: ".joyride-addproject",
      content: "2、點擊新增專案，即可填寫專案資訊。",
      disableBeacon: true,
    },
    {
      target: ".joyride-accountingproject",
      content: "3、新增專案後，即可在記帳面板看到選取專案的欄位。",
      disableBeacon: true,
    },
    {
      target: ".joyride-report",
      content: "4、透過按鈕切換進行以及結束的專案。",
      disableBeacon: true,
    },
  ];

  return (
    <JoyrideContext.Provider
      value={{
        run,
        setRun,
        steps,
        stepIndex,
        setStepIndex,
        dataRun,
        setDataRun,
        stepDataIndex,
        setStepDataIndex,
        dataSteps,
        analysisRun,
        setAnalysisRun,
        stepAnalysisIndex,
        setStepAnalysisIndex,
        analysisSteps,
        projectRun,
        setProjectRun,
        stepProjectIndex,
        setStepProjectIndex,
        projectSteps,
      }}
    >
      {children}
    </JoyrideContext.Provider>
  );
};

export const useJoyride = () => useContext(JoyrideContext);
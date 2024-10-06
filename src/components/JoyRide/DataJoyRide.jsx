import { useEffect } from "react";
import Joyride from "react-joyride";
import { useJoyride } from "../../context/JoyrideContext";

const DataJoyride = () => {
  const { dataRun, setDataRun, stepDataIndex, setStepDataIndex, dataSteps } =
    useJoyride();

  useEffect(() => {
    const hasSeenDataTutorial = localStorage.getItem("hasSeenDataTutorial");
    if (hasSeenDataTutorial) {
      setDataRun(false);
      setStepDataIndex(0);
    } else {
      setDataRun(true);
    }
  }, [setDataRun, setStepDataIndex]);
  const handleCallback = (data) => {
    console.log(data);
    const { action, index, status, type, lifecycle } = data;

    if (
      status === "finished" ||
      status === "skipped" ||
      type === "close" ||
      (action === "close" && lifecycle === "complete")
    ) {
      setDataRun(false);
      setStepDataIndex(0);
      localStorage.setItem("hasSeenTutorial", "true");
    } else if (
      type === "step:after" &&
      (action === "next" || action === "prev")
    ) {
      // 更新步驟索引
      const newIndex = index + (action === "next" ? 1 : -1);
      setStepDataIndex(newIndex);

      switch (newIndex) {
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
        default:
          break;
      }
    }
  };

  return (
    <Joyride
      run={dataRun}
      steps={dataSteps}
      stepIndex={stepDataIndex}
      continuous={true}
      showSkipButton={true}
      callback={handleCallback}
      disableBeacon={true}
      disableScrolling={true}
      spotlightClicks={false} // 禁用點擊高亮區域內的元素來跳過
      disableOverlayClose={true}
      styles={{
        options: {
          zIndex: 10000,
          arrowColor: "#f2f2f2",
          backgroundColor: "#f2f2f2",
          textColor: "#333", // 內容框文字顏色
          overlayColor: "rgba(0, 0, 0, 0.5)",
          primaryColor: "#4a90e2",
          placement: "bottom",
        },
        // beacon: {
        //   inner: {
        //     backgroundColor: "#FF6B6B",
        //     height: 16,
        //     width: 16,
        //     borderRadius: "50%",
        //   },
        //   outer: {
        //     backgroundColor: "rgba(255, 107, 107, 0.4)",
        //     height: 40,
        //     width: 40,
        //     borderRadius: "50%",
        //   },
        // },
        spotlight: {
          borderRadius: "12px", // 高亮邊框圓角
        },
        tooltip: {
          fontSize: "18px",
          fontWeight: "bold",
          backgroundColor: "#f2f2f2", // 引導框背景顏色
          borderRadius: "12px", // 引導框圓角
          color: "#333", // 文字顏色
          padding: "20px", // 引導框內部間距
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // 引導框陰影
        },
        buttonNext: {
          backgroundColor: "#607196",
          color: "#fff",
          borderRadius: "12px",
        },
        buttonBack: {
          color: "#888",
          marginRight: "10px",
        },
        buttonSkip: {
          color: "#f03e3e",
        },
      }}
    />
  );
};

export default DataJoyride;

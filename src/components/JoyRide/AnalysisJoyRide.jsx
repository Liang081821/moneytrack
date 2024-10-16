import { useEffect } from "react";
import Joyride from "react-joyride";
import { useJoyride } from "../../context/JoyrideContext";

const AnalysisJoyride = () => {
  const {
    analysisRun,
    setAnalysisRun,
    stepAnalysisIndex,
    setStepAnalysisIndex,
    analysisSteps,
  } = useJoyride();

  useEffect(() => {
    const hasSeenAnalysisTutorial = localStorage.getItem("hasSeenTutorial");
    if (hasSeenAnalysisTutorial) {
      setAnalysisRun(false);
      setStepAnalysisIndex(0);
    } else {
      setAnalysisRun(true);
    }
  }, [setAnalysisRun, setStepAnalysisIndex]);
  const handleCallback = (data) => {
    console.log(data);
    const { action, index, status, type, lifecycle } = data;

    if (
      status === "finished" ||
      status === "skipped" ||
      type === "close" ||
      (action === "close" && lifecycle === "complete")
    ) {
      setAnalysisRun(false);
      setStepAnalysisIndex(0);
      localStorage.setItem("hasSeenTutorial", "true");
    } else if (
      type === "step:after" &&
      (action === "next" || action === "prev")
    ) {
      const newIndex = index + (action === "next" ? 1 : -1);
      setStepAnalysisIndex(newIndex);

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
      run={analysisRun}
      steps={analysisSteps}
      stepIndex={stepAnalysisIndex}
      continuous={true}
      showSkipButton={true}
      callback={handleCallback}
      disableBeacon={true}
      disableScrolling={true}
      spotlightClicks={false}
      disableOverlayClose={true}
      styles={{
        options: {
          zIndex: 10000,
          arrowColor: "#f2f2f2",
          backgroundColor: "#f2f2f2",
          textColor: "#333",
          overlayColor: "rgba(0, 0, 0, 0.5)",
          primaryColor: "#4a90e2",
          placement: "bottom",
        },

        spotlight: {
          borderRadius: "8px",
        },
        tooltip: {
          fontSize: "18px",

          fontWeight: "bold",
          backgroundColor: "#f2f2f2",
          borderRadius: "8px",
          color: "#333",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
        buttonNext: {
          backgroundColor: "#607196",
          color: "#fff",
          borderRadius: "8px",
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

export default AnalysisJoyride;

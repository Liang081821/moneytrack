import { useEffect } from "react";
import Joyride from "react-joyride";
import { useGlobalContext } from "../../context/GlobalContext";
import { useJoyride } from "../../context/JoyrideContext";

const JoyrideGuide = () => {
  const { run, steps, stepIndex, setStepIndex, setRun } = useJoyride();

  const { setAccounting } = useGlobalContext();

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    if (hasSeenTutorial) {
      setRun(false);
      setStepIndex(0);
    } else {
      setRun(true);
    }
  }, [setRun, setStepIndex]);

  const handleCallback = (data) => {
    const { action, index, status, type, lifecycle } = data;

    if (
      status === "finished" ||
      status === "skipped" ||
      type === "close" ||
      (action === "close" && lifecycle === "complete")
    ) {
      setRun(false);
      setStepIndex(0);
      setAccounting(false);
      localStorage.setItem("hasSeenTutorial", "true");
    } else if (
      type === "step:after" &&
      (action === "next" || action === "prev")
    ) {
      const newIndex = index + (action === "next" ? 1 : -1);
      setStepIndex(newIndex);

      switch (newIndex) {
        case 1:
          if (action === "prev") {
            setAccounting(false);
          }
          break;
        case 2:
          if (action === "next") {
            setAccounting(true);
            setTimeout(() => {
              setRun(true);
            }, 500);
          } else if (action === "prev") {
            setAccounting(true);
            setTimeout(() => {
              setRun(true);
            }, 500);
          }
          break;
        case 3:
          if (action === "next") {
            setAccounting(true);
            setTimeout(() => {
              setRun(true);
            }, 500);
          } else if (action === "prev") {
            setAccounting(true);
            setTimeout(() => {
              setRun(true);
            }, 500);
          }

          break;
        case 4:
          if (action === "next") {
            setAccounting(false);
          } else if (action === "prev") {
            setAccounting(true);
          }
          break;
        default:
          break;
      }
    }
  };

  return (
    <Joyride
      run={run}
      steps={steps}
      stepIndex={stepIndex}
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

export default JoyrideGuide;

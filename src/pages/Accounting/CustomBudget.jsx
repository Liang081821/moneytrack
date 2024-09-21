import { useState, useEffect } from "react";

export default function CustomBudget() {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen((prev) => !prev);
  };

  const handleScroll = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed right-0 top-40 p-2 transition-all ${
        isOpen
          ? "z-50 h-[650px] w-[450px] rounded-lg bg-[#BABFD1] opacity-90"
          : "w-25 overflow-hidden rounded-xl bg-[#BABFD1] text-white"
      }`}
    >
      <button
        onClick={togglePanel}
        className={isOpen ? "h-6 w-6 rounded-[50%] bg-red-600" : ""}
      >
        {isOpen ? "X" : "設定預算"}
      </button>
      {isOpen && (
        <div className="flex flex-col items-center justify-center p-4">
          <h2 className="font-base text-2xl text-white">本月預算</h2>
        </div>
      )}
    </div>
  );
}

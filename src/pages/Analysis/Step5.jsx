import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function Step5({ preText, setPreText }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (preText) {
      sendPreText(preText);
      setPreText("");
    }
  }, [preText, setPreText]);

  const sendPreText = async (input) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "你是一個使用繁體中文回應的理財規劃師。",
            },
            {
              role: "user",
              content: input,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: data.botMessage.content || data.botMessage,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (input) => {
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "你是一個使用繁體中文回應的理財規劃師。",
            },
            ...newMessages,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Bot Message:", data.botMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: data.botMessage.content || data.botMessage,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  Step5.propTypes = {
    preText: PropTypes.func.isRequired,
    setPreText: PropTypes.func.isRequired,
  };

  return (
    <div className="h-full w-full p-1 fade-in">
      <div className="relative flex h-full flex-col rounded-xl bg-slate-300 p-4">
        {loading && (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <h2 className="pb-2 text-2xl font-bold">理財貓</h2>
            <div>分析中 ...</div>
          </div>
        )}
        <div className="w-full space-y-1 overflow-auto text-xl">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-xl p-3 text-white ${
                  msg.role === "user" ? "bg-[#222E50]" : "bg-blue-500"
                }`}
              >
                <strong>{msg.role === "user" ? "" : "理財貓  : "}</strong>{" "}
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16">
          <div className="absolute bottom-3 mt-5 flex w-full justify-center gap-2">
            <input
              className="h-12 w-[700px] rounded-xl border border-black pl-2"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend(userInput)}
            />
            <button
              onClick={() => handleSend(userInput)}
              className="rounded-xl bg-[#607196] p-2 text-white"
            >
              傳送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

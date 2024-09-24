import cors from "cors";
import express from "express";
import OpenAI from "openai";
const app = express();

app.use(cors());
// 中介軟件：解析 JSON 請求主體
app.use(express.json());

// 初始化 OpenAI API
const openai = new OpenAI({});

// 聊天接口
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).send("Messages are required.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const botMessage = response.choices[0].message;

    // 返回機器人的回覆
    res.json({ botMessage });
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    res.status(500).send("Something went wrong.");
  }
});

// 啟動伺服器
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

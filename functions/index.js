import { initializeApp } from "firebase-admin/app";
import { https } from "firebase-functions";
import OpenAI from "openai";

initializeApp();

const openai = new OpenAI({});

export const chat = https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

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

    res.json({ botMessage });
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    res.status(500).send("Something went wrong.");
  }
});

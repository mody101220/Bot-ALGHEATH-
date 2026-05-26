import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { LiveTelegramBotServer } from "./telegramBot";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with named parameters and custom headers for builder telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Live Telegram Bot Server reference
let liveBot: LiveTelegramBotServer | null = null;

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Start Live Telegram Bot
app.post("/api/bot/start", async (req, res) => {
  const { botToken, geminiApiKey } = req.body;
  
  if (!botToken) {
    res.status(400).json({ error: "يجب تقديم توكن البوت (BOT_TOKEN) للتشغيل." });
    return;
  }

  try {
    // If we have a custom Gemini API Key, configure a local instance of GoogleGenAI
    const botAi = geminiApiKey 
      ? new GoogleGenAI({ apiKey: geminiApiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } })
      : ai;

    if (liveBot) {
      liveBot.stop();
    }

    liveBot = new LiveTelegramBotServer(botToken, botAi);
    await liveBot.start();
    
    const status = liveBot.getStatus();
    res.json({ success: true, status });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "فشل بدء تشغيل البوت المباشر." });
  }
});

// Stop Live Telegram Bot
app.post("/api/bot/stop", (req, res) => {
  if (liveBot) {
    liveBot.stop();
    res.json({ success: true, status: liveBot.getStatus() });
  } else {
    res.json({ success: true, status: { isRunning: false } });
  }
});

// Get Live Telegram Bot Status & Logs
app.get("/api/bot/status", (req, res) => {
  if (liveBot) {
    res.json({
      active: true,
      status: liveBot.getStatus(),
      logs: liveBot.getLogs()
    });
  } else {
    res.json({
      active: false,
      status: { isRunning: false, botName: "", userCount: 0, offset: 0 },
      logs: []
    });
  }
});

// Secure API endpoint for Gemini-powered automated text/content generation
app.post("/api/generate-content", async (req, res) => {
  const { prompt, systemInstruction } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Missing prompt parameter" });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are an expert AI copywriter and Telegram monetization marketer focused on viral income tools and high-conversion affiliate offers.",
        temperature: 0.8,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ error: error?.message || "Internal server error during content generation" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for dev mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Static production build hosting
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

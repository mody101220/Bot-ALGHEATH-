import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { LiveTelegramBotServer } from "./telegramBot";

dotenv.config();

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url} - Headers: ${JSON.stringify(req.headers)}`);
  next();
});

app.use(express.json());

// Initialize Gemini SDK with named parameters and custom headers for builder telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyCSvCPg_YKqUKD75amQ0sKAX_-70kIru0E",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Live Telegram Bot Server reference
let liveBot: LiveTelegramBotServer | null = null;
const CONFIG_PATH = path.join(process.cwd(), "bot-config-storage.json");

// Helper to save bot configuration
function saveBotConfig(botToken: string, geminiApiKey?: string, autoStart: boolean = true) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({
      botToken,
      geminiApiKey: geminiApiKey || "",
      autoStart
    }, null, 2));
    console.log(`[BotConfig] Saved bot configuration. AutoStart: ${autoStart}`);
  } catch (err) {
    console.error("[BotConfig] Error saving configuration:", err);
  }
}

// Helper to load bot config
function loadBotConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
      return data;
    }
  } catch (err) {
    console.error("[BotConfig] Error loading configuration:", err);
  }
  // Default fallback to keep it active
  return {
    botToken: "8994906142:AAHrIArGfx01PMCDhk2-jL64X8j2gfrGMRM",
    geminiApiKey: "",
    autoStart: true
  };
}

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
    
    // Persist configuration so the server can automatically recover and keep running forever
    saveBotConfig(botToken, geminiApiKey, true);

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
    // Disable autoStart in persisted configuration so it remains stopped until requested
    const saved = loadBotConfig();
    saveBotConfig(saved.botToken, saved.geminiApiKey, false);
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

  // Auto-Start Bot from persistent file storage of last configuration
  const config = loadBotConfig();
  if (config && config.botToken && config.autoStart !== false) {
    console.log(`[AlwaysOn] Auto-starting persistent Telegram Bot with token ending in ...${config.botToken.slice(-10)}`);
    try {
      const botAi = config.geminiApiKey 
        ? new GoogleGenAI({ apiKey: config.geminiApiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } })
        : ai;
      liveBot = new LiveTelegramBotServer(config.botToken, botAi);
      liveBot.start().then(() => {
        console.log("[AlwaysOn] Bot started successfully.");
      }).catch((e: any) => {
        console.error("[AlwaysOn] Bot thread starting error:", e);
      });
    } catch (e: any) {
      console.error("[AlwaysOn] Error instantiating automated boot-up bot sequence:", e);
    }
  }

  // Passive Watchdog Interval (Runs every 15 seconds) to ensure that if a bot is marked for persistent execution
  // but gets deactivated, it automatically restarts immediately!
  setInterval(() => {
    try {
      const currentConfig = loadBotConfig();
      if (currentConfig && currentConfig.botToken && currentConfig.autoStart !== false) {
        const isBotLive = liveBot && liveBot.getStatus().isRunning;
        if (!isBotLive) {
          console.log("[Watchdog] Alarm triggered! Persistent Telegram Bot is DOWN. Restarting now...");
          const botAi = currentConfig.geminiApiKey 
            ? new GoogleGenAI({ apiKey: currentConfig.geminiApiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } })
            : ai;
          if (liveBot) {
            try { liveBot.stop(); } catch(err){}
          }
          liveBot = new LiveTelegramBotServer(currentConfig.botToken, botAi);
          liveBot.start().then(() => {
            console.log("[Watchdog] Recovery succeeded. Bot is running again!");
          }).catch(e => {
            console.error("[Watchdog] Re-launch failed:", e);
          });
        }
      }
    } catch (watchdogErr) {
      console.error("[Watchdog] Error during safety verification loop:", watchdogErr);
    }
  }, 15000);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

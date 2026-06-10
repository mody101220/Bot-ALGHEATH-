/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Terminal, 
  Play, 
  Code, 
  Database as DbIcon, 
  TrendingUp, 
  Coins, 
  Users, 
  Flame, 
  BookOpen, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  Smartphone, 
  HelpCircle, 
  Share2, 
  ChevronRight, 
  Zap, 
  Lock, 
  ArrowRight,
  UserCheck,
  Award,
  DollarSign,
  Cpu,
  Square,
  ExternalLink,
  Sun,
  Moon,
  ChevronDown
} from "lucide-react";
import { BOT_TEMPLATES } from "./data/botTemplates";
import AdminDashboard from "./components/AdminDashboard";
// @ts-ignore
import botAvatar from "./assets/images/bot_premium_avatar_1781048729862.png";

const DICT = {
  ar: {
    suiteTitle: "باقة الدخل السلبي الرقمي",
    prodVersion: "نسخة الإنتاج v2.4",
    appTitle: "Automated Telegram AI Engine ALGHealth",
    liveSandbox: "لوحة محاكاة مباشرة",
    starsEnabled: "دفع النجوم 100% نشط",
    sidebarTitle: "بنية أرباح ALGHealth",
    sidebarDesc: "أطلق بوتات تيليجرام تفاعلية مبرمجة بالكامل في بيئة بايثون و Aiogram مع ميزة دفع النجوم وتتبع الإحالات الديناميكية.",
    statusBadge: "⚡ نظام مالي متطور تم تصميمه للانتشار السريع والربح التلقائي",
    navOverview: "مؤشرات الأرباح والنمو",
    navCode: "الرموز الأكواد البرمجية",
    navSandbox: "لوحة محاكاة البوت التفاعلية",
    navAi: "صانع السيناريوهات بالذكاء الاصطناعي",
    navGuide: "دليل كسب الأرباح",
    sysConfig: "تهيئة النظام الرقمي",
    pyVersion: "إصدار لغة بايثون",
    runtimeEng: "محيط التشغيل",
    sqlSchema: "قاعدة بيانات SQLite",
    initialized: "نشطة ومفعّلة",
    nicheSelectorTitle: "محرّك توليد الحملات والسيناريوهات المخصصة بالذكاء الاصطناعي",
    nicheSelectorDesc: "اختر التخصص الذي تود الترويج له بالعمولة وسيقوم نموذج Gemini الفائض ببناء خطة استراتيجية أو سيناريو خاطف مميز باللغة العربية الفصحى لجني النتائج والأرباح.",
    activeStatus: "نشط بالكامل",
    chooseNicheLabel: "اختر أو حدد مجال منتجك المستهدف:",
    campaignStyleLabel: "نوع المحتوى التسويقي المراد إنشاؤه:",
    marketingPlanOpt: "✍️ خطة تسويقية مفصلة من 3 خطوات عملية لجني العمولات",
    tiktokScriptOpt: "🎥 سيناريو فيديو تيك توك وريلز سريع الانتشار (15 ثانية بصرية)",
    generateBtn: "توليد الحملة الذكية عبر نموذج Gemini ✨",
    generating: "جاري معالجة نموذج Gemini 3.5 في الوقت الفعلي...",
    placeholderResult: "المخرجات المتولدة من الذكاء الاصطناعي ستظهر هنا بشكل منظم وجذاب...",
    copyText: "نسخ النص المولد",
    canvasTitle: "شاشة مخرجات تفاعل نموذج Gemini:",
    legalComplianceTitle: "الامتثال التنظيمي والقوانين الحاكمة",
    legalComplianceBody: "نجوم تيليجرام (Telegram Stars) هي الرموز الرسمية الأكثر أماناً والممتثلة لسياسات مطوري تطبيقات Google و Apple. يتم سحب وتحويل جميع الأرباح المحققة منها بسلاسة تامة إلى عوائد مالية حقيقية عبر منصة Fragment في بيئة آمنة وقانونية تماماً.",
    userProps: "معلومات الحساب للمشترك المحاكي",
    userPropsDesc: "قم بتعديل وتفاعلات الحساب المحاكي لتيليجرام في الذاكرة الحية لمتابعة حركات استعلامات قاعدة بيانات SQL المباشرة في الأسفل تلقائيًا.",
    lifetimePremium: "عضوية بريميوم مدى الحياة",
    starsBalanceLabel: "الرصيد الكلي المحاكي للنجوم ⭐",
    networkRefs: "عدد الإحالات النشطة حالياً",
    simulateConvert: "محاكاة إجراءات الدفع والتحويل",
    buyStarsBtn: "شراء واسترداد 500 نجمة ⭐ (فاتورة تجريبية)",
    joinRefBtn: "محاكاة تسجيل صديق جديد برابط إحالتك",
    sqlLogHeader: "مراقب حركات واستعلامات قاعدة البيانات SQLite 3",
    sqlLogStatus: "الاستعلامات نشطة ومباشرة",
    deviceFrameTitle: "شاشة محاكاة البوت التفاعلية الفورية (تيليجرام)",
    botProfileSub: "مساعد جني العوائد والسيناريوهات الذكية لـ ALGHealth",
    preloadedFast: "أزرار التشغيل السريع المسبقة للتجربة المحاكية:",
    viralShortFormulaTitle: "سر التوليد والانتشار السريع المجاني على تيك توك وريلز",
    viralShortFormulaDesc: "احصل على أكثر من 3000 زيارة حقيقية مهتمة لبوت تيليجرام الخاص بك مجانًا تماماً باستخدام مقاطع الفيديو العمودية السريعة والمنظمة:",
    marketing2026Title: "أقسام ومصادر الدخل الرقمية لبوت تيليجرام الخاص بك",
    marketing2026Desc: "هرم متكامل ومثبت لتحقيق أرباح مستدامة عبر واجهات البوت التفاعلية المبسطة وسريعة البناء:",
    strategyMilestonesTitle: "المراحل الاستراتيجية لنقل البوت إلى مستوى 100$ يومياً",
    strategyMilestonesDesc: "خرائط طريق عملية لنقل البوت من مرحلة الصفر البرمجي إلى مستويات عالية من الانتشار والأرباح التلقائية بانتظام:",
  },
  en: {
    suiteTitle: "Passive Income Suite",
    prodVersion: "Production v2.4",
    appTitle: "Automated Telegram AI Engine ALGHealth",
    liveSandbox: "Live Sandbox Console",
    starsEnabled: "100% Stars (XTR) Enabled",
    sidebarTitle: "ALGHealth Income Stack",
    sidebarDesc: "Launch modular Python + Aiogram Telegram bots configured with integrated Telegram Stars payments and viral acquisition workflows.",
    statusBadge: "⚡ Multi-million system configured with high-converting digital products hooks.",
    navOverview: "Income Overview & Metrics",
    navCode: "Production Source Code",
    navSandbox: "Interactive Bot Sandbox",
    navAi: "AI Campaigns & Strategy",
    navGuide: "Monetization Guide",
    sysConfig: "System Config Settings",
    pyVersion: "Python Version",
    runtimeEng: "Runtime Engine",
    sqlSchema: "SQLite Schema",
    initialized: "Initialized & Active",
    nicheSelectorTitle: "AI Campaigns & Strategy Generator",
    nicheSelectorDesc: "Select or type any product/service niche to instantly build real marketing campaigns, direct monetization loops, and custom-tailored affiliate resources via the powerful Gemini model in clear terms.",
    activeStatus: "Active",
    chooseNicheLabel: "Select or define your targeted income niche:",
    campaignStyleLabel: "Target Marketing Materials:",
    marketingPlanOpt: "✍️ Detailed 3-Step Strategy & Monetization Guide",
    tiktokScriptOpt: "🎥 Quick Viral TikTok / Reels Short Script (15 seconds style)",
    generateBtn: "Generate Campaign via Gemini 3.5 ✨",
    generating: "Consulting Gemini API in Real-Time...",
    placeholderResult: "Generated campaign materials will display beautifully here once you initiate the generator...",
    copyText: "Copy generated text",
    canvasTitle: "Gemini Synthesis Canvas Output:",
    legalComplianceTitle: "Legal & Regulatory Compliance",
    legalComplianceBody: "Telegram Stars are the platform's official internal digital tokens compliant with global Google Play Store & Apple App Store developer regulations. Any earned active tokens exchange smoothly into real fiat cash via the Fragment decentralization market, providing fully law-compliant recurring income blocks.",
    userProps: "Simulated User State",
    userPropsDesc: "Modify the simulated user state characteristics inside memory and analyze real-time live SQLite database queries below dynamically.",
    lifetimePremium: "Lifetime Premium Active",
    starsBalanceLabel: "Voucher Stars (⭐ Balance)",
    networkRefs: "Simulated Network Referrals",
    simulateConvert: "Simulate Conversions",
    buyStarsBtn: "Simulate: Buy 500 Stars (Digital Invoice)",
    joinRefBtn: "Simulate: User Registers via My Link",
    sqlLogHeader: "SQL TRANSACTION LOGGER",
    sqlLogStatus: "WAL ACTIVE",
    deviceFrameTitle: "BOT CHAT TERMINAL (PREVIEW)",
    botProfileSub: "Aesthetic ALGHealth AI Passive Income Assistant",
    preloadedFast: "Preloaded Fast Handlers Triggers:",
    viralShortFormulaTitle: "TikTok/Reels Free Viral Growth Strategy Blueprint",
    viralShortFormulaDesc: "Drive 3,000+ targeted clicks to your Telegram landing bot page entirely for free with organic vertical shorts:",
    marketing2026Title: "2026 Bot Monetization Ecosystem Plan",
    marketing2026Desc: "Proven passive revenue structures optimized for light Telegram bot interfaces to monetize subscribers effectively:",
    strategyMilestonesTitle: "Strategic Milestones Scaling Roadmap",
    strategyMilestonesDesc: "Set clear objectives to scale operations from zero-cash starting levels into consistent income streams:",
  }
};

export default function App() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("all-in-one");
  const [activeTab, setActiveTab ] = useState<"overview" | "code" | "sandbox" | "ai" | "growth">("overview");
  const [loggerTab, setLoggerTab] = useState<"local" | "live">("local");
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedFileIndex, setCopiedFileIndex] = useState<number | null>(null);

  const activeTemplate = BOT_TEMPLATES.find(t => t.id === selectedTemplateId) || BOT_TEMPLATES[0];
  const currentFiles = activeTemplate.files;
  const activeFile = currentFiles[selectedFileIndex] || currentFiles[0] || { name: "", path: "", language: "python" as const, content: "", description: "" };

  // Live Live configuration states (Interactive config.py parameters)
  const [botToken, setBotToken] = useState(() => {
    return localStorage.getItem("BOT_TOKEN") || "8994906142:AAHrIArGfx01PMCDhk2-jL64X8j2gfrGMRM";
  });
  const [adminIds, setAdminIds] = useState(() => {
    return localStorage.getItem("ADMIN_IDS") || "2138200729";
  });
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem("GEMINI_API_KEY") || "AIzaSyCSvCPg_YKqUKD70amQ0sKAX_-70kIru0E";
  });

  const [saveStatus, setSaveStatus] = useState<"clean" | "saving" | "saved">("clean");
  const saveTimeoutRef = useRef<any>(null);
  const saveTimeoutRefSecond = useRef<any>(null);

  const triggerSaveIndicator = () => {
    setSaveStatus("saving");
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    if (saveTimeoutRefSecond.current) {
      clearTimeout(saveTimeoutRefSecond.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus("saved");
      saveTimeoutRefSecond.current = setTimeout(() => {
        setSaveStatus("clean");
      }, 2000);
    }, 450);
  };

  const updateBotToken = (val: string) => {
    setBotToken(val);
    localStorage.setItem("BOT_TOKEN", val || "8994906142:AAHrIArGfx01PMCDhk2-jL64X8j2gfrGMRM");
    triggerSaveIndicator();
  };

  const updateAdminIds = (val: string) => {
    setAdminIds(val);
    localStorage.setItem("ADMIN_IDS", val || "2138200729");
    triggerSaveIndicator();
  };

  const updateGeminiApiKey = (val: string) => {
    setGeminiApiKey(val);
    localStorage.setItem("GEMINI_API_KEY", val);
    triggerSaveIndicator();
  };

  const getProcessedCode = (content: string) => {
    let result = content;
    // Replace BOT_TOKEN across config file or inline examples
    result = result.replace(/8994906142:AAHrIArGfx01PMCDhk2-jL64X8j2gfrGMRM/g, botToken);
    
    // Replace admin ID placeholder
    result = result.replace(/2138200729/g, adminIds);
    
    // Replace Gemini API Key placeholder if customize value provided
    if (geminiApiKey) {
      result = result.replace(/os\.getenv\("GEMINI_API_KEY", ""\)/g, `os.getenv("GEMINI_API_KEY", "${geminiApiKey}")`);
    } else {
      result = result.replace(/os\.getenv\("GEMINI_API_KEY", ""\)/g, `os.getenv("GEMINI_API_KEY", "")`);
    }
    return result;
  };

  // Live Background Bot controls and terminal outputs
  const [liveBotActive, setLiveBotActive] = useState(false);
  const [liveBotStatus, setLiveBotStatus] = useState({ isRunning: false, botName: "", userCount: 0, offset: 0 });
  const [liveBotLogs, setLiveBotLogs] = useState<any[]>([]);
  const [isLiveBotLoading, setIsLiveBotLoading] = useState(false);

  // Poll live bot status from server 
  const fetchLiveBotStatus = async () => {
    try {
      const res = await fetch("/api/bot/status");
      if (!res.ok) {
        // If not OK, silent return to prevent log clutter during boot or restart.
        return;
      }
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Safe check for HTML loading/error wrapper returned by proxy during warmup.
        return;
      }

      const data = await res.json();
      setLiveBotActive(data.active && data.status?.isRunning);
      if (data.status) {
        setLiveBotStatus(data.status);
      }
      if (data.logs) {
        setLiveBotLogs(data.logs);
      }
    } catch (e) {
      // Avoid verbose console.error warnings for syntax exceptions during system warmup
      console.log("Status update skipped (server warming up):", e);
    }
  };

  useEffect(() => {
    fetchLiveBotStatus();
    // Poll status periodically (every 4 seconds) to show real-time live terminal logs
    const interval = setInterval(fetchLiveBotStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  const startLiveBot = async () => {
    setIsLiveBotLoading(true);
    try {
      const res = await fetch("/api/bot/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botToken,
          geminiApiKey,
        }),
      });
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(lang === "ar" ? "الرابط لم يعثر على استجابة JSON صالحة. هل الخادم قيد التشغيل؟" : "Invalid response type from backend server. Is server warm?");
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to start");
      }
      setLiveBotActive(true);
      if (data.status) {
        setLiveBotStatus(data.status);
      }
      triggerAlert(lang === "ar" ? "🟢 تم تشغيل البوت المباشر بنجاح! تفقده الآن في تيليجرام." : "🟢 Live Telegram Bot started successfully! Check it in Telegram.");
    } catch (err: any) {
      triggerAlert(lang === "ar" ? `❌ فشل التشغيل: ${err.message}` : `❌ Start failed: ${err.message}`);
    } finally {
      setIsLiveBotLoading(false);
      fetchLiveBotStatus();
    }
  };

  const stopLiveBot = async () => {
    setIsLiveBotLoading(true);
    try {
      const res = await fetch("/api/bot/stop", {
        method: "POST",
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid format returned from backend.");
      }

      const data = await res.json();
      setLiveBotActive(false);
      setLiveBotStatus({ isRunning: false, botName: "", userCount: 0, offset: 0 });
      triggerAlert(lang === "ar" ? "🛑 تم إيقاف البوت المالي المباشر بنجاح" : "🛑 Live Telegram Bot stopped successfully");
    } catch (err: any) {
      triggerAlert(lang === "ar" ? `❌ فشل إيقاف البوت: ${err.message}` : `❌ Stop failed: ${err.message}`);
    } finally {
      setIsLiveBotLoading(false);
      fetchLiveBotStatus();
    }
  };
  
  // AI Generator local States
  const [aiNiche, setAiNiche] = useState(() => {
    return localStorage.getItem("AI_NICHE") || "AI Automation & Copywriting SaaS";
  });
  const [aiType, setAiType] = useState<"guide" | "script">((() => {
    const stored = localStorage.getItem("AI_TYPE");
    return (stored === "guide" || stored === "script") ? stored : "guide";
  }));

  const updateAiNiche = (val: string) => {
    setAiNiche(val);
    localStorage.setItem("AI_NICHE", val);
  };

  const updateAiType = (val: "guide" | "script") => {
    setAiType(val);
    localStorage.setItem("AI_TYPE", val);
  };

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string>("");
  const [aiError, setAiError] = useState<string | null>(null);

  // Bot Simulation local States
  const [simUsers, setSimUsers] = useState([
    { id: 2138200729, username: "founder_premium", is_premium: 1, stars: 450, referrals: 12 },
    { id: 987654321, username: "viral_promoter", is_premium: 0, stars: 100, referrals: 0 },
  ]);
  const [simLogs, setSimLogs] = useState<string[]>([
    "تم بدء تشغيل وتكامل نظام تيليجرام...",
    "sqlite3.connect('bot_database.db') -> تمت تهيئة ملف قاعدة البيانات بنجاح.",
    "توليد جداول النظام بنجاح: `users` و `referrals` و `scheduler` و `payments_ledger` جاهزة للاستعلام."
  ]);
  const [chatMessages, setChatMessages] = useState([
    { sender: "system", text: "تم تحميل بيئة عمل بوت تيليجرام التفاعلية بنجاح. انقر على الاختصارات أو الخيارات أدناه لمحاكاة تفاعل مستخدم حقيقي في البوت." },
    { sender: "bot", text: "👋 أهلاً بك في بوت الذكاء الاصطناعي العربي لتحقيق الدخل السلبي! اختر من الأزرار التفاعلية أدناه أو اكتب مجالك الخاص." }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [simUserPremium, setSimUserPremium] = useState(false);
  const [simUserStars, setSimUserStars] = useState(100);
  const [simReferrals, setSimReferrals] = useState(2);

  // Quick Notification Banner State
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleCopyCode = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedFileIndex(index);
    setTimeout(() => setCopiedFileIndex(null), 2000);
    triggerAlert(lang === "ar" ? "تم نسخ كود البرمجة للحافظة!" : "Source code copied to clipboard!");
  };

  const triggerAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // Live query to the Express Backend `/api/generate-content`
  const generateCampaignContent = async () => {
    setIsAiLoading(true);
    setAiError(null);
    setAiResult("");

    const promptText = aiType === "guide" 
      ? `Compose a highly engaging 3-step passive income plan for the niche: '${aiNiche}'. Highlight exact monetization strategies (affiliate networks, custom downloads) and step 1 action items. Please write the response in Arabic.`
      : `Draft a viral 15-second script for TikTok/Instagram Reels about the niche: '${aiNiche}'. Include snappy hooks, visual notes in brackets [SCENE DETAILS], and call-to-actions linking back to our bot. Optimize for retention. Please write the response in Arabic.`;

    const systemInstruction = "أنت خبير محترف في إطلاق بوتات التيليجرام وتحقيق أرباح عبر التسويق بالعمولة والاشتراكات. اكتب بحماس وأسلوب تسويقي جذاب، ونسّق الخطوات برموز وعناوين عريضة باللغة العربية.";

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText, systemInstruction }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(lang === "ar" ? "الخادم لم يستجب بصيغة JSON صالحة. هل المفاتيح صحيحة؟" : "Invalid response type from backend server. Are the keys valid?");
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Generation error");
      }
      setAiResult(data.text);
      triggerAlert("تم توليد المحتوى الإعلاني بنجاح!");
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "فشل الاتصال بخادم الذكاء الاصطناعي Gemini. تحقق من إعداد مفتاح API.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Simulator Engine Actions
  const appendSimLog = (action: string, codeSnippet: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setSimLogs(prev => [
      `[${timestamp}] ${action}`,
      `⚙️ تم تنفيذ استعلام SQL: ${codeSnippet}`,
      ...prev.slice(0, 15)
    ]);
  };

  const simulateTelegramCommand = (cmd: string) => {
    // Add user message to chat UI
    setChatMessages(prev => [...prev, { sender: "user", text: cmd }]);

    // Trigger reactive bot answer
    setTimeout(() => {
      let botAnswer = "";
      switch (cmd) {
        case "/start":
          botAnswer = `أهلاً بك! تمت تهيئة حسابك بنجاح.\n\n💎 باقة الاشتراك: ${simUserPremium ? 'عضوية مميزة مدى الحياة 👑' : 'الباقة المجانية 🆓'}\n⭐ رصيد النجوم: ${simUserStars} نجمة\n\nفلنبدأ بصناعة المحتوى الترويجي وتوليد الأرباح بالعملات الأجنبية ونجوم تيليجرام!\n\nℹ️ *للحصول على المساعدة وتفاصيل الأوامر، أرسل: /help*`;
          appendSimLog(
            `دخول/تسجيل مستخدم جديد عبر أمر تيليجرام الأساسي.`,
            `INSERT OR IGNORE INTO users (user_id, username, joined_at) VALUES (135792, 'sandbox_user', datetime('now'))`
          );
          break;
        case "/help":
          botAnswer = `❓ **دليل المساعدة والدعم الفني للبوت العربي**\n\nمرحباً بك! يعمل هذا البوت المتطور بالطاقة الكاملة لنموذج Gemini الرائد لمساعدتك على توليد العمولات وصناعة محتوى ترويجي استثنائي.\n\n📌 **الأوامر البرمجية المتاحة:**\n🔹 /start - إعادة تهيئة الحساب، فتح لوحة التحكم الرئيسية وعرض الإحصائيات الحالية.\n🔹 /help - عرض هذا الدليل الإرشادي المتكامل لمعرفة خيارات التشغيل ومميزات البوت.\n\n📊 **الأقسام والخدمات الذكية باللوحة:**\n1️⃣ **إنتاج خطة تسويقية (Affiliate Engine)**: أدخل أي نوع منتج أو مجال وسيقوم الذكاء الاصطناعي ببناء خطة تسويقية مفصلة لك لجني العمولات.\n2️⃣ **مختبر الفيديوهات الفيروسية (Viral Lab)**: يكتب لك سيناريوهات فيديو احترافية مع خطافات بصرية وملاحظات تفصيلية لزيادة الانتشار الأورجانيك ومضاعفة أرباحك.\n3️⃣ **عضوية بريميوم مدى الحياة (VIP Lifetime)**: تمنحك استعلامات وتوليد غير محدود ومضاعفة عمولتك لجميع الإحالات لتصل إلى 50%.\n4️⃣ **شبكة الإحالة والعمولات (Referrals)**: تتيح لك مشاركة رابط تتبع مخصص لك لتلقي العمولات وفواتير النجوم فورياً.`;
          appendSimLog(
            `استدعاء دليل الدعم والمساعدة للمستخدم.`,
            `SELECT * FROM users WHERE user_id = 135792`
          );
          break;
        case "🚀 Launch Affiliate Engine":
          botAnswer = "أدخل المجال الربحي أو نوع المنتج الذي تود الترويج له بالعمولة (مثال: 'روبوتات تداول تلقائي'، 'قوالب تنظيم الإنتاجية لـ Notion') وسيقوم محرك Gemini بصناعة خطة عمل كاملة لك باللغة العربية!";
          appendSimLog(`الضغط على زر: قائمة التسويق بالعمولة.`, `SELECT free_uses_left FROM users WHERE user_id = 135792`);
          break;
        case "💰 Upgrade Lifetime Premium":
          if (simUserPremium) {
            botAnswer = "حسابك مفعّل بالفعل في باقة الـ VIP المميزة مدى الحياة! استمتع بصناعة محتوى لا نهائي وعمولات مضاعفة بنسبة 50%.";
          } else if (simUserStars < 250) {
            botAnswer = `⚠️ رصيدك غير كافٍ! تتطلب الترقية للباقة المميزة مدى الحياة 250 ⭐ نجمة. رصيدك الحالي هو: ${simUserStars} نجمة.\n\nمن فضلك انقر فوق زر 'شحن 500 نجمة' على اليسار لإضافة رصيد محاكاة وتجربة عملية الشراء الحقيقية.`;
          } else {
            setSimUserStars(prev => prev - 250);
            setSimUserPremium(true);
            botAnswer = "🎉 تهانينا اللامحدودة! تم تفعيل عضوية VIP مدى الحياة لحسابك بنظام تيليجرام. شكرًا لثقتك، رصيدك الآن جاهز لاستخدام غير محدود وعمولات كاملة!";
            appendSimLog(
              `تأكيد حسم النجوم وترقية الحساب إلى VIP.`,
              `UPDATE users SET is_premium = 1, stars_balance = stars_balance - 250 WHERE user_id = 135792;`
            );
          }
          break;
        case "👥 My Cash Referral Network":
          botAnswer = `👥 **لوحة تحكم شبكة التسويق بالعمولة الخاصة بك**\n\nرابط الإحالة المخصص لك لنشره:\nhttps://t.me/AIPassiveIncomeBot?start=ref_135792\n\n📊 الإحصائيات الحالية للشبكة:\n├ عدد الإحالات النشطة: **${simReferrals} مستخدمين**\n├ نسبة عمولتك من الترقيات: **${simUserPremium ? "50% (VIP عمولة)" : "25% (عمولة افتراضية)"}**\n└ الرصيد المتوفر للسحب الفوري: **${simUserStars} نجمة ⭐**`;
          appendSimLog(
            `قراءة إحصائيات الإحالات من قاعدة البيانات.`,
            `SELECT COUNT(*) FROM referrals WHERE referrer_id = 135792;`
          );
          break;
        default:
          botAnswer = `🤖 جاري معالجة الكلمة المفتاحية: "${cmd}" باستخدام نموذج Gemini... تم تفضيل مؤشرات نمو عالية ومحاكاة الاستجابة باللغة العربية بنجاح!`;
          appendSimLog(`تحليل النص المدخل وتحديث معدلات الاستهلاك للمستخدم.`, `UPDATE users SET free_uses_left = free_uses_left - 1 WHERE user_id = 135792`);
          break;
      }

      setChatMessages(prev => [...prev, { sender: "bot", text: botAnswer }]);
    }, 700);
  };

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const msg = inputMessage;
    setInputMessage("");
    simulateTelegramCommand(msg);
  };

  const simulateStarsInvoiceBuy = () => {
    setSimUserStars(prev => prev + 500);
    triggerAlert("تم تفعيل الكوبون! تمت إضافة +500 نجمة ⭐ لرصيد المستخدم المحاكي.");
    appendSimLog(
      `تم تأكيد عملية شراء نجوم تيليجرام بنجاح عبر بوابة الدفع الرقمية.`,
      `INSERT INTO payments_ledger (payment_id, user_id, amount_stars, purpose, timestamp) VALUES ('CHG_' || random(), 135792, 500, 'Stars Purchase', datetime('now'))`
    );
  };

  const simulateNewReferralJoined = () => {
    setSimReferrals(prev => prev + 1);
    setSimUserStars(prev => prev + 50); // reward referrer
    triggerAlert("تمت محاكاة انضمام صديق جديد! تم زيادة الإحالات ومنحك عمولة بقيمة +50 نجمة ⭐.");
    appendSimLog(
      `تسجيل عملية تسجيل إحالة جديدة ذكية داخل قاعدة بيانات التتبع.`,
      `INSERT INTO referrals (referred_id, referrer_id, earned_stars, rewarded_at) VALUES (random(), 135792, 50, datetime('now'))`
    );
  };

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen font-sans flex flex-col antialiased transition-colors duration-300 ${
      isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      {/* Dynamic Pop Banner */}
      {alertMessage && (
        <div className="fixed top-5 right-5 z-50 bg-indigo-900 border border-indigo-700 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium font-mono">{alertMessage}</span>
        </div>
      )}

      {/* Title Header Workspace / Aesthetic Slate Bar */}
      <header className="bg-slate-900 text-white border-b border-indigo-950 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-md animate-pulse">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-indigo-950 border border-indigo-800 text-indigo-400 font-semibold px-2 py-0.5 rounded-md uppercase font-mono tracking-wider">{DICT[lang].suiteTitle}</span>
              <span className="text-[10px] bg-red-950 border border-red-800 text-red-400 px-2 py-0.5 rounded-md uppercase font-mono font-medium">{DICT[lang].prodVersion}</span>
            </div>
            <h1 className="text-xl font-bold font-sans tracking-tight mt-0.5">Automated Telegram AI Engine ALGHealth</h1>
          </div>
        </div>

        {/* Global Controls & Stats top right */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Elegant Theme Toggle */}
          <button
            onClick={() => {
              const nextTheme = theme === "dark" ? "light" : "dark";
              setTheme(nextTheme);
              triggerAlert(lang === "ar" ? `تم تفعيل الوضع ${nextTheme === "dark" ? "المظلم 🌙" : "المضيء ☀️"}` : `Switched to ${nextTheme === "dark" ? "Dark 🌙" : "Light ☀️"} mode`);
            }}
            className="bg-slate-950 hover:bg-slate-900 px-3 py-2 rounded-xl border border-indigo-950/80 text-indigo-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 font-sans font-bold text-[11px]"
            title={lang === "ar" ? "تبديل المظهر" : "Toggle Theme"}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === "ar" ? "المضيء ☀️" : "Light ☀️"}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-300" />
                <span>{lang === "ar" ? "المظلم 🌙" : "Dark 🌙"}</span>
              </>
            )}
          </button>

          {/* Elegant Bilingual Switcher */}
          <div className="bg-slate-950 p-1.5 rounded-xl border border-indigo-950/80 flex items-center gap-1 font-sans">
            <button
              onClick={() => {
                setLang("ar");
                triggerAlert("تم تحويل لغة العرض إلى العربية الفصحى 🇸🇦");
              }}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                lang === "ar"
                  ? "bg-indigo-600 text-white shadow-md font-extrabold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              العربية 🇸🇦
            </button>
            <button
              onClick={() => {
                setLang("en");
                triggerAlert("Interface switched to English 🇬🇧");
              }}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-indigo-600 text-white shadow-md font-extrabold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              English 🇬🇧
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-950 p-2.5 rounded-xl border border-indigo-950 font-mono">
            <div className="flex items-center gap-1.5 border-r border-indigo-950 pr-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-emerald-400 font-semibold">{DICT[lang].liveSandbox}</span>
            </div>
            <span className="text-slate-400">Merchant Payouts:</span>
            <span className="text-amber-400 font-bold">{DICT[lang].starsEnabled}</span>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6">
        
        {/* Navigation Sidebar Drawer */}
        <aside className="lg:w-72 shrink-0 flex flex-col gap-4">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden border border-indigo-800/10">
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <img 
                src={botAvatar} 
                alt="Al-Ghiath Bot Logo" 
                className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500 shadow-md transform hover:rotate-6 transition-transform" 
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-[9px] font-bold text-amber-400 font-mono tracking-wider block">OFFICIAL BRAND</span>
                <h4 className="text-sm font-extrabold text-slate-100 font-sans tracking-tight">محمد الغياث</h4>
              </div>
            </div>
            <h2 className="text-lg font-bold font-sans relative z-10">{DICT[lang].sidebarTitle}</h2>
            <p className="text-xs text-indigo-200 mt-1 leading-relaxed relative z-10">
              {DICT[lang].sidebarDesc}
            </p>
            <div className="bg-slate-950/40 p-3 rounded-xl border border-indigo-800/40 mt-4 text-xs font-mono text-indigo-300 relative z-10">
              {DICT[lang].statusBadge}
            </div>
          </div>

          <nav className={`rounded-2xl border p-3 shadow-xs space-y-1 transition-all duration-300 ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
          }`}>
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "overview" 
                  ? isDark
                    ? "bg-indigo-950/80 border border-indigo-900/50 text-indigo-300"
                    : "bg-indigo-50 border border-indigo-100 text-indigo-950" 
                  : isDark
                    ? "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                <span className="font-sans">{DICT[lang].navOverview}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              onClick={() => setActiveTab("code")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "code" 
                  ? isDark
                    ? "bg-indigo-950/80 border border-indigo-900/50 text-indigo-300"
                    : "bg-indigo-50 border border-indigo-100 text-indigo-950" 
                  : isDark
                    ? "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Code className="w-4 h-4 text-indigo-500" />
                <span className="font-sans">{DICT[lang].navCode}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              onClick={() => setActiveTab("sandbox")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "sandbox" 
                  ? isDark
                    ? "bg-indigo-950/80 border border-indigo-900/50 text-indigo-300"
                    : "bg-indigo-50 border border-indigo-100 text-indigo-950" 
                  : isDark
                    ? "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-indigo-500" />
                <span className="font-sans">{DICT[lang].navSandbox}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              onClick={() => setActiveTab("ai")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "ai" 
                  ? isDark
                    ? "bg-indigo-950/80 border border-indigo-900/50 text-indigo-300"
                    : "bg-indigo-50 border border-indigo-100 text-indigo-950" 
                  : isDark
                    ? "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="font-sans">{DICT[lang].navAi}</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-1.5 py-0.5 rounded-md uppercase">{DICT[lang].activeStatus}</span>
            </button>

            <button 
              onClick={() => setActiveTab("growth")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "growth" 
                  ? isDark
                    ? "bg-indigo-950/80 border border-indigo-900/50 text-indigo-300"
                    : "bg-indigo-50 border border-indigo-100 text-indigo-950" 
                  : isDark
                    ? "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span className="font-sans">{DICT[lang].navGuide}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </nav>

          {/* Quick Technical stats bottom of navigation menu */}
          <div className={`rounded-2xl border p-4 shadow-xs text-xs space-y-3 transition-all duration-300 ${
            isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-100 text-slate-900"
          }`}>
            <h4 className={`font-bold uppercase font-mono tracking-wider ${isDark ? "text-slate-350" : "text-slate-800"}`}>{DICT[lang].sysConfig}</h4>
            <div className="flex justify-between items-center text-slate-405 font-mono">
              <span className="text-slate-400">{DICT[lang].pyVersion}</span>
              <span className={`font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>3.11</span>
            </div>
            <div className="flex justify-between items-center text-slate-405 font-mono">
              <span className="text-slate-400 font-sans">{DICT[lang].runtimeEng}</span>
              <span className="text-slate-800 font-bold">Aiogram + asyncio</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 font-mono border-t border-slate-50 pt-2.5">
              <span>{DICT[lang].sqlSchema}</span>
              <span className="text-emerald-600 font-semibold uppercase">{DICT[lang].initialized}</span>
            </div>
          </div>

          {/* Luxurious Developer Signature Profile Card */}
          <div className="bg-slate-900 rounded-2xl border border-indigo-950/60 p-4 text-white shadow-xl relative overflow-hidden transition-all hover:border-indigo-800 group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/15 transition-all"></div>
            
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <span className="p-1 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-md text-slate-950 shadow-sm animate-pulse">
                <Award className="w-3.5 h-3.5 text-slate-950" />
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 font-mono">
                {lang === "ar" ? "خبير النظم الرقمية والحلول الذكية" : "Digital Systems & Security Expert"}
              </span>
            </div>

            <div className="space-y-1 relative z-10">
              <h4 className="text-xs font-bold text-white font-sans tracking-tight flex items-center gap-1.5">
                {lang === "ar" ? "المهندس محمد جهاد الغياث (Mody)" : "Eng. Mohammad Jehad Al-Ghiath (Mody)"}
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              </h4>
              <p className="text-[10px] text-slate-400 leading-normal font-sans font-medium">
                {lang === "ar" 
                  ? "مصمم البنية التحتية الرقمية، مهندس برمجيات متميز وخبير في الأمن السيبراني" 
                  : "Digital Infrastructure Architect, Lead Software Engineer & Cybersecurity Specialist"}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 relative z-10 text-[10px]">
              <a 
                href="https://wa.me/963964627585" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors w-full cursor-pointer group/link"
              >
                <div className="shrink-0 w-4.5 h-4.5 rounded-md bg-indigo-950 flex items-center justify-center text-indigo-400 border border-indigo-900 group-hover/link:border-indigo-700">
                  <span className="text-[9px] font-mono leading-none">☏</span>
                </div>
                <span className="font-mono text-11px font-medium">+963 964 627 585</span>
                <span className="text-[8px] bg-emerald-950 text-emerald-450 border border-emerald-900 px-1 rounded-sm ml-auto opacity-80 font-bold uppercase">WhatsApp</span>
              </a>

              <a 
                href="mailto:mody101220@gmail.com" 
                className="flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors w-full cursor-pointer group/link"
              >
                <div className="shrink-0 w-4.5 h-4.5 rounded-md bg-indigo-950 flex items-center justify-center text-indigo-400 border border-indigo-900 group-hover/link:border-indigo-700">
                  <span className="text-[9px] font-mono leading-none">@</span>
                </div>
                <span className="font-mono text-11px font-medium truncate max-w-[130px]">mody101220@gmail.com</span>
                <span className="text-[8px] bg-indigo-950 text-indigo-455 border border-indigo-900 px-1 rounded-sm ml-auto opacity-80 font-bold uppercase font-mono">Email</span>
              </a>
            </div>

            <div className="mt-3.5 flex flex-wrap gap-1 relative z-10 text-[9px] font-mono">
              <span className="font-medium font-sans bg-slate-950 border border-slate-850 text-slate-400 px-1 py-0.5 rounded">SecOps</span>
              <span className="font-medium font-sans bg-slate-950 border border-slate-850 text-slate-400 px-1 py-0.5 rounded">Cloud Native</span>
              <span className="font-medium font-sans bg-slate-950 border border-slate-850 text-slate-400 px-1 py-0.5 rounded">AI Integrations</span>
              <span className="font-medium font-sans bg-slate-950 border border-slate-850 text-slate-400 px-1 py-0.5 rounded">FinTech</span>
            </div>
          </div>
        </aside>

        {/* Content Screens Container Area */}
        <main className="flex-1 bg-slate-50 rounded-2xl flex flex-col gap-6">
          
          {/* TAB 1: OVERVIEW INDEX */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-sans text-gray-950">
                    {lang === "ar" ? "لوحة مؤشرات الأرباح والنمو" : "Income Generation Dashboard"}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {lang === "ar" 
                      ? "قم بمحاكاة دورات النمو للأرباح الأوتوماتيكية، ومتابعة خطوات ومراحل الانتشار والوصول إلى غاية 100$ يومياً بلغات مختلفة." 
                      : "Simulate growth cycles, inspect automated income funnels, and track the bot metrics targeting $100/day."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 font-semibold font-mono">
                    {lang === "ar" ? "الفترة الزمنية: استراتيجية 2026 الحية" : "Timeframe: Live 2026 Strategy Matrix"}
                  </span>
                </div>
              </div>

              {/* Import our pre-assembled AdminDashboard component */}
              <AdminDashboard lang={lang} theme={theme} />
            </div>
          )}

          {/* TAB 2: CODE MATRIX EXPLORER */}
          {activeTab === "code" && (
            <div className="space-y-6">
              
              {/* Bot Template Selector Dropdown */}
              <div className={`${theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100 text-slate-900"} p-6 rounded-2xl border shadow-3xs space-y-4 transition-all duration-300`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className={`p-2 rounded-xl ${theme === "dark" ? "bg-indigo-950 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                      <Code className="w-5 h-5 text-indigo-500" />
                    </span>
                    <div>
                      <h3 className={`text-sm font-bold font-sans ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                        {lang === "ar" ? "🤖 اختر نموذج أو قالب البوت الجاهز" : "🤖 Select Production Bot Template"}
                      </h3>
                      <p className={`text-xs mt-0.5 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                        {lang === "ar" 
                          ? "قم بالتبديل بين الهياكل والملفات البرمجية الجاهزة للتصدير الفوري لملائمة نموذج عملك المفضل." 
                          : "Switch between clean pre-built formats to adjust your target automation logic."}
                      </p>
                    </div>
                  </div>

                  {/* Dropdown UI styling */}
                  <div className="relative min-w-[260px] self-start md:self-center">
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => {
                        setSelectedTemplateId(e.target.value);
                        setSelectedFileIndex(0);
                        triggerAlert(lang === "ar" 
                          ? `🟢 تم تحميل قالب: ${BOT_TEMPLATES.find(t => t.id === e.target.value)?.nameAr}` 
                          : `🟢 Loaded: ${BOT_TEMPLATES.find(t => t.id === e.target.value)?.name} template`
                        );
                      }}
                      className={`w-full appearance-none px-4 py-2.5 rounded-xl text-xs font-sans font-bold border outline-none pr-10 transition-all ${
                        theme === "dark"
                          ? "bg-slate-950 border-slate-800 text-slate-200 focus:bg-slate-900 focus:border-indigo-500"
                          : "bg-slate-50 border-slate-200 text-slate-850 focus:bg-white focus:border-indigo-500"
                      }`}
                    >
                      {BOT_TEMPLATES.map((t) => (
                        <option key={t.id} value={t.id} className={theme === "dark" ? "bg-slate-950 text-slate-200" : "bg-white text-slate-800"}>
                          {lang === "ar" ? t.nameAr : t.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Info summary message box for selected option */}
                <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors duration-300 ${
                  theme === "dark" ? "bg-slate-950/65 border-slate-800 text-slate-300" : "bg-indigo-50/50 border-indigo-100/50 text-slate-700"
                }`}>
                  <span className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${theme === "dark" ? "bg-indigo-950 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-455" />
                  </span>
                  <div className="space-y-1">
                    <p className={`text-xs font-extrabold ${theme === "dark" ? "text-indigo-300" : "text-indigo-950"}`}>
                      {lang === "ar" ? "تفاصيل وخصائص البنية البرمجية المحملة:" : "Loaded Capabilities Overview:"}
                    </p>
                    <p className={`text-[11px] leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                      {lang === "ar" ? activeTemplate.descriptionAr : activeTemplate.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Interactive Token Configurator Panel */}
              <div className={`${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100 text-slate-900"} p-6 rounded-2xl border shadow-3xs space-y-4 transition-all duration-300`}>
                <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b ${isDark ? "border-slate-800/80" : "border-slate-100"}`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`p-2 rounded-xl transition-colors ${isDark ? "bg-indigo-950/80 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                      <Zap className="w-5 h-5 animate-pulse text-indigo-500" />
                    </span>
                    <div>
                      <h3 className={`text-sm font-bold font-sans ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                        {lang === "ar" ? "💻 تهيئة الرموز الحية للمعالجة الفورية والتصدير" : "💻 Live Environment Token Configurator"}
                      </h3>
                      <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {lang === "ar" 
                          ? "قم بتعديل قيم المتغيرات وسيتم حقنها وتحديث الأكواد المعروضة بالأسفل مباشرة في الحافظة." 
                          : "Modify keys below; all files and copy blocks adjust instantly in memory."}
                      </p>
                    </div>
                  </div>
                  
                  {/* Dynamic Persist auto-saving Indicator */}
                  <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                    {saveStatus === "saving" && (
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-sans font-extrabold px-2.5 py-1 rounded-md border animate-pulse transition-colors ${
                        isDark 
                          ? "bg-amber-950/60 border-amber-900/50 text-amber-300"
                          : "bg-amber-50 border-amber-100 text-amber-700"
                      }`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        {lang === "ar" ? "جاري الحفظ تلقائياً..." : "Auto-saving..."}
                      </span>
                    )}
                    {saveStatus === "saved" && (
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-sans font-extrabold px-2.5 py-1 rounded-md border transition-colors ${
                        isDark 
                          ? "bg-emerald-950/60 border-emerald-900/50 text-emerald-300"
                          : "bg-emerald-50 border-emerald-100 text-emerald-700"
                      }`}>
                        <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                        {lang === "ar" ? "تم الحفظ تلقائياً! ✅" : "Auto-Saved & Synced!"}
                      </span>
                    )}
                    {saveStatus === "clean" && (
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-sans font-bold px-2.5 py-1 rounded-md border opacity-80 transition-colors ${
                        isDark
                          ? "bg-slate-950/70 border-slate-800 text-slate-400"
                          : "bg-slate-50 border-slate-150 text-slate-500"
                      }`}>
                        <Check className="w-3.5 h-3.5 text-slate-400" />
                        {lang === "ar" ? "محفوظ في المتصفح" : "Stored in local storage"}
                      </span>
                    )}

                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border transition-colors ${
                      isDark 
                        ? "bg-indigo-950/60 border-indigo-900/50 text-indigo-350" 
                        : "bg-indigo-50 border-indigo-100 text-indigo-600"
                    }`}>
                      {lang === "ar" ? "حقن ديناميكي نَشِط" : "Dynamic Injection: Active"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-1">
                  <div>
                    <label className={`block text-[11px] font-bold uppercase font-mono tracking-wider mb-1.5 ${isDark ? "text-slate-350" : "text-slate-700"}`}>
                      {lang === "ar" ? "توكن البوت (BOT_TOKEN)" : "Telegram BOT_TOKEN"}
                    </label>
                    <input
                      type="text"
                      value={botToken}
                      onChange={(e) => updateBotToken(e.target.value)}
                      placeholder="e.g. 8994906142:AAHr..."
                      className={`w-full px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all border ${
                        isDark 
                          ? "bg-slate-950 border-slate-800 focus:bg-slate-900 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                          : "bg-slate-50 border-slate-200 focus:bg-white text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      } shadow-3xs`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold uppercase font-mono tracking-wider mb-1.5 ${isDark ? "text-slate-350" : "text-slate-700"}`}>
                      {lang === "ar" ? "معرّفات المسؤولين (ADMIN_IDS)" : "Telegram ADMIN_IDS"}
                    </label>
                    <input
                      type="text"
                      value={adminIds}
                      onChange={(e) => updateAdminIds(e.target.value)}
                      placeholder="e.g. 2138200729"
                      className={`w-full px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all border ${
                        isDark 
                          ? "bg-slate-950 border-slate-800 focus:bg-slate-900 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                          : "bg-slate-50 border-slate-200 focus:bg-white text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      } shadow-3xs`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold uppercase font-mono tracking-wider mb-1.5 ${isDark ? "text-slate-350" : "text-slate-700"}`}>
                      {lang === "ar" ? "مفتاح Gemini API (اختياري)" : "Google GEMINI_API_KEY (Optional)"}
                    </label>
                    <input
                      type="text"
                      value={geminiApiKey}
                      onChange={(e) => updateGeminiApiKey(e.target.value)}
                      placeholder={lang === "ar" ? "مفتاح ذكاء اصطناعي لـ Gemini" : "API key details"}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all border ${
                        isDark 
                          ? "bg-slate-950 border-slate-800 focus:bg-slate-900 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                          : "bg-slate-50 border-slate-200 focus:bg-white text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      } shadow-3xs`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left File selection list */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-4 shrink-0 space-y-2 max-h-[750px] overflow-y-auto">
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-gray-950 uppercase font-mono tracking-wider">
                      {lang === "ar" ? "الهيكلية البرمجية للبوت" : "Modular Architecture"}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lang === "ar" ? "انقر على أي ملف لمعاينة المعاملات الحية والأكواد" : "Click any module to inspect logic parameters"}
                    </p>
                  </div>
                  
                  {currentFiles.map((f, index) => (
                    <button
                      key={f.path}
                      onClick={() => setSelectedFileIndex(index)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedFileIndex === index 
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                          : "bg-slate-50/50 hover:bg-slate-50 border-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold truncate max-w-[200px]">{f.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md uppercase font-mono font-bold ${
                          selectedFileIndex === index 
                            ? "bg-indigo-500/50 text-white" 
                            : "bg-slate-200 text-slate-600"
                        }`}>
                          {f.language}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1 leading-relaxed line-clamp-2 ${
                        selectedFileIndex === index ? "text-indigo-150" : "text-slate-400"
                      }`}>
                        {f.description}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Right File Content displaying workspace */}
                <div className="lg:col-span-8 flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl max-h-[750px]">
                  <div className="bg-slate-950 px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4.5 h-4.5 text-indigo-400" />
                      <span className="text-xs font-mono font-bold text-indigo-100">{activeFile.path}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({activeFile.language})</span>
                    </div>

                    <button
                      onClick={() => handleCopyCode(getProcessedCode(activeFile.content), selectedFileIndex)}
                      className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white font-medium bg-slate-900 hover:bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800 transition-all cursor-pointer"
                    >
                      {copiedFileIndex === selectedFileIndex ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-mono">{lang === "ar" ? "تم نسخ!" : "Copied!"}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="font-mono">{lang === "ar" ? "نسخ الكود" : "Copy Code"}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-5 overflow-y-auto flex-1 font-mono text-xs text-slate-300 leading-relaxed max-h-[600px] bg-slate-950">
                    <pre className="whitespace-pre-wrap">{getProcessedCode(activeFile.content)}</pre>
                  </div>
                  
                  <div className="bg-slate-950 border-t border-slate-850 px-5 py-3 shrink-0 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{lang === "ar" ? "🚀 كود إنتاجي مخصص وجاهز بالكامل لبيئة بايثون و SQLite" : "🚀 Customized production blueprint ready for 2026 SQLite integration"}</span>
                    <span>UTF-8 • python-clean</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TELEGRAM BOT SANDBOX INTERACTION */}
          {activeTab === "sandbox" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left control actions & panel parameters */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                  <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm uppercase font-mono tracking-wider mb-3">
                    <Smartphone className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
                    <span>{DICT[lang].userProps}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {DICT[lang].userPropsDesc}
                  </p>

                  <div className="space-y-4 text-xs font-medium">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-indigo-600" />
                        <span>{DICT[lang].lifetimePremium}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setSimUserPremium(p => !p);
                          triggerAlert(lang === "ar" ? "تم تغيير رتبة العضو المشترك بنجاح!" : "Simulated subscription updated!");
                        }}
                        className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase cursor-pointer ${
                          simUserPremium ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {simUserPremium ? (lang === "ar" ? "مفعّل" : "ACTIVE") : (lang === "ar" ? "غير نشط (مجاني)" : "INACTIVE (FREE)")}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: "3s" }} />
                        <span>{DICT[lang].starsBalanceLabel}</span>
                      </div>
                      <span className="font-mono bg-amber-50 text-amber-900 border border-amber-200 px-3 py-0.5 rounded-full font-bold">
                        {simUserStars} ⭐
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span>{DICT[lang].networkRefs}</span>
                      </div>
                      <span className="font-mono bg-purple-50 text-purple-900 border border-purple-200 px-3 py-0.5 rounded-full font-bold text-xs">
                        {simReferrals} {lang === "ar" ? "مستخدم" : "Users"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Simulation Trigger Buttons */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">{DICT[lang].simulateConvert}</h4>
                  
                  <button 
                    onClick={simulateStarsInvoiceBuy}
                    className="w-full bg-amber-500 hover:bg-amber-600 active:scale-98 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
                  >
                    <Coins className="w-4 h-4" />
                    {DICT[lang].buyStarsBtn}
                  </button>

                  <button 
                    onClick={simulateNewReferralJoined}
                    className="w-full bg-indigo-50 hover:bg-indigo-100 active:scale-98 text-indigo-700 text-xs font-bold py-3 px-4 rounded-xl border border-indigo-100 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <UserCheck className="w-4 h-4" />
                    {DICT[lang].joinRefBtn}
                  </button>
                </div>

                {/* Brand New: Live Background Polling Telegram Bot Worker */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                    <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm uppercase font-mono tracking-wider">
                      <Cpu className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
                      <span>{lang === "ar" ? "مشغل ومراقب البوت المباشر" : "Live Telegram Cloud Engine"}</span>
                    </div>
                    <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      liveBotActive 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100 animate-pulse" 
                        : "bg-red-50 text-red-700 border border-red-100"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${liveBotActive ? "bg-emerald-500" : "bg-red-500"}`}></span>
                      {liveBotActive ? (lang === "ar" ? "يعمل بالخلفية" : "ACTIVE 24/7") : (lang === "ar" ? "متوقف مؤقتاً" : "INACTIVE")}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {lang === "ar" 
                      ? "اضغط لتشغيل البوت بشكل مباشر وحقيقي على خوادمنا السحابية السريعة وتجربته فوراً من هاتفك الذكي باستخدام الرمز (Token) المكتوب بالأعلى!"
                      : "Launch a real background instance on our secure hosting server. Use your BotFather Token to chat with your bot live!"}
                  </p>

                  <div className="space-y-3">
                    {liveBotActive && liveBotStatus.botName && (
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-mono font-bold text-indigo-500 tracking-wider block">{lang === "ar" ? "معرّف البوت النشط" : "Active Telegram Handle"}</span>
                          <span className="text-xs font-bold text-indigo-900 font-mono">@{liveBotStatus.botName}</span>
                        </div>
                        <a 
                          href={`https://t.me/${liveBotStatus.botName}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm text-center"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {lang === "ar" ? "ارسل رسالة للبوت" : "Send /start"}
                        </a>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {!liveBotActive ? (
                        <button
                          onClick={startLiveBot}
                          disabled={isLiveBotLoading || !botToken}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                        >
                          <Play className="w-4 h-4 fill-current animate-bounce" />
                          {isLiveBotLoading ? (lang === "ar" ? "جاري التمكين..." : "Connecting...") : (lang === "ar" ? "تشغيل البوت الفعلي سحابياً" : "Boot Live Telegram Bot")}
                        </button>
                      ) : (
                        <button
                          onClick={stopLiveBot}
                          disabled={isLiveBotLoading}
                          className="w-full bg-red-650 hover:bg-red-750 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                        >
                          <Square className="w-4 h-4 fill-current" />
                          {isLiveBotLoading ? (lang === "ar" ? "جاري الإيقاف..." : "Stopping...") : (lang === "ar" ? "تعطيل البوت السحابي" : "Deactivate Live Bot")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Multitask Log Terminal Panel */}
                <div className="bg-slate-900 rounded-2xl border border-slate-850 p-4 font-mono text-xs text-slate-300 space-y-2 max-h-[300px] overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px]">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setLoggerTab("local")}
                        className={`font-semibold cursor-pointer px-2 py-0.5 rounded-md transition-colors ${
                          loggerTab === "local" ? "bg-indigo-900/60 text-indigo-300 border border-indigo-800/30" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        📊 {lang === "ar" ? "قاعدة بيانات المحاكي" : "Local SQLite DB"}
                      </button>
                      <button 
                        onClick={() => setLoggerTab("live")}
                        className={`font-semibold cursor-pointer px-2 py-0.5 rounded-md transition-colors ${
                          loggerTab === "live" ? "bg-indigo-900/60 text-indigo-300 border border-indigo-800/30 font-bold" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        🟢 {lang === "ar" ? "السيرفر الفعلي المباشر" : "Cloud Polling Logs"}
                      </button>
                    </div>
                    <span className="text-slate-500 text-[9px] font-mono select-none uppercase">TRACKER</span>
                  </div>

                  <div className="space-y-2 max-h-[200px] overflow-y-auto pt-1.5">
                    {loggerTab === "local" ? (
                      simLogs.map((l, i) => (
                        <div key={i} className="text-[11px] leading-relaxed border-b border-slate-850 pb-1.5 last:border-none text-slate-350">
                          {l}
                        </div>
                      ))
                    ) : (
                      liveBotLogs.length === 0 ? (
                        <div className="text-[11px] text-slate-500 text-center py-6 leading-relaxed">
                          {liveBotActive 
                            ? (lang === "ar" ? "⏳ جاري جلب ومزامنة سجل الحركات السحابية الفورية من تيليجرام..." : "⏳ Polling is active. Waiting for traffic...")
                            : (lang === "ar" ? "🛑 السيرفر في وضع النوم. قم بتشغيل 'البوت الفعلي سحابياً' بالأعلى لبدء تصفح حركة الحركة الحية." : "🛑 Live logs sleeping. Run the Cloud Bot on top to begin monitoring traffic!")
                          }
                        </div>
                      ) : (
                        liveBotLogs.map((l, i) => (
                          <div 
                            key={i} 
                            className={`text-[11px] leading-relaxed border-b border-slate-850 pb-1.5 last:border-none font-mono ${
                              l.type === "error" ? "text-red-400" : l.type === "success" ? "text-emerald-400" : l.type === "incoming" ? "text-sky-300" : "text-indigo-200"
                            }`}
                          >
                            <span className="text-[9px] text-slate-550 mr-1.5 font-sans select-none">[{new Date(l.timestamp).toLocaleTimeString()}]</span>
                            {l.text}
                          </div>
                        ))
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Right Telegram simulated screen client UI */}
              <div className="lg:col-span-7 bg-slate-900 rounded-3xl border-4 border-slate-850 h-[640px] flex flex-col overflow-hidden shadow-2xl relative">
                
                {/* Simulated Device Frame Top Notch */}
                <div className="bg-slate-900 px-6 py-3 flex items-center justify-between border-b border-indigo-950/40 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                  </div>
                  <div className="bg-slate-950 text-slate-400 text-[10px] px-2.5 py-0.5 rounded-md font-mono tracking-wide font-semibold">
                    {DICT[lang].deviceFrameTitle}
                  </div>
                  <div className="text-slate-500 text-xs font-mono font-bold">UTC 08:17</div>
                </div>

                {/* Bot Profile bar Header */}
                <div className="bg-slate-950 px-5 py-3 flex items-center justify-between border-b border-indigo-950/40 shrink-0">
                  <div className="flex items-center gap-3">
                    <img 
                      src={botAvatar} 
                      alt="Mohamed Al-Ghiath Bot Avatar" 
                      className="w-10 h-10 rounded-full border border-amber-500 object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
                        {lang === "ar" ? "بوت محمد الغياث الذكي 🤖" : "Mohamed Al-Ghiath AI Bot 🤖"}
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      </h4>
                      <p className="text-[10px] text-indigo-400 font-medium tracking-wide font-mono">@alghiath_money_bot</p>
                    </div>
                  </div>
                </div>

                {/* Simulated Messages Screen scroll container */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950 max-h-[380px]">
                  {chatMessages.map((msg, index) => {
                    if (msg.sender === "system") {
                      return (
                        <div key={index} className="flex justify-center">
                          <div className="bg-slate-900 text-[11px] text-indigo-300 font-mono px-4 py-2 rounded-xl max-w-[85%] text-center border border-indigo-950">
                            {msg.text}
                          </div>
                        </div>
                      );
                    }
                    const isUser = msg.sender === "user";
                    return (
                      <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                        <div className={`p-4 rounded-2xl max-w-[80%] text-xs leading-relaxed transition-all ${
                          isUser 
                            ? "bg-indigo-600 text-white rounded-br-none font-medium" 
                            : "bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none font-normal"
                        }`}>
                          <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick actions preloaded button triggers */}
                <div className="bg-slate-950 border-t border-indigo-950/30 px-4 py-3 shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono block mb-2 uppercase tracking-wide">
                    {lang === "ar" ? "أزرار التشغيل السريع المسبقة للتجربة المحاكية:" : "Preloaded Fast Handlers Triggers:"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => simulateTelegramCommand("/start")}
                      className="bg-indigo-950 hover:bg-slate-900 border border-indigo-900/40 text-indigo-300 text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      /start
                    </button>
                    <button 
                      onClick={() => simulateTelegramCommand("/help")}
                      className="bg-indigo-950 hover:bg-slate-900 border border-indigo-900/40 text-indigo-300 text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      /help ❓
                    </button>
                    <button 
                      onClick={() => simulateTelegramCommand("🚀 Launch Affiliate Engine")}
                      className="bg-indigo-950 hover:bg-slate-900 border border-indigo-900/40 text-indigo-300 text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      {lang === "ar" ? "🚀 خطة التسويق والعمولات" : "🚀 Affiliate Blueprint"}
                    </button>
                    <button 
                      onClick={() => simulateTelegramCommand("💰 Upgrade Lifetime Premium")}
                      className="bg-indigo-950 hover:bg-slate-900 border border-indigo-900/40 text-indigo-300 text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      {lang === "ar" ? "👑 ترقية بريميوم" : "👑 Upgrade VIP"}
                    </button>
                    <button 
                      onClick={() => simulateTelegramCommand("👥 My Cash Referral Network")}
                      className="bg-indigo-950 hover:bg-slate-900 border border-indigo-900/40 text-indigo-300 text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      {lang === "ar" ? "👥 شبكة الإحالة والشركاء" : "👥 Referral Network"}
                    </button>
                  </div>
                </div>

                {/* Typing console entry form input */}
                <form onSubmit={handleCustomSend} className="bg-slate-950 px-4 py-3 border-t border-indigo-950/40 shrink-0 flex gap-2">
                  <input
                    type="text"
                    placeholder={lang === "ar" ? "اكتب رسالة تجريبية أو أمراً مخصصاً للبوت..." : "Enter message parameter or type custom command..."}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 bg-slate-900 text-white rounded-xl text-xs px-4 py-3 outline-none border border-slate-800 focus:border-indigo-600 transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 hover:opacity-90 p-3 rounded-xl text-white cursor-pointer active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: AI ACTIVE VIRAL CAMPAIGN GENERATOR */}
          {activeTab === "ai" && (
            <div className="space-y-6">
              
              {/* Introduction header */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-gray-950 font-sans">{DICT[lang].nicheSelectorTitle}</h3>
                </div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  {DICT[lang].nicheSelectorDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Generation settings */}
                <div className="lg:col-span-12 xl:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
                    {lang === "ar" ? "معطيات ومقاييس التوليد" : "Campaign Parameters"}
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">{DICT[lang].chooseNicheLabel}</label>
                    <input
                      type="text"
                      value={aiNiche}
                      onChange={(e) => updateAiNiche(e.target.value)}
                      placeholder={lang === "ar" ? "مثال: بوت تداول الذهب، خدمات التمويل المستقلة للشركات..." : "e.g. trading bots, automated shorts generator, etc."}
                      className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-150 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">{DICT[lang].campaignStyleLabel}</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        onClick={() => updateAiType("guide")}
                        className={`p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left block leading-tight ${
                          aiType === "guide" 
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {DICT[lang].marketingPlanOpt}
                      </button>
                      <button
                        onClick={() => updateAiType("script")}
                        className={`p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left block leading-tight ${
                          aiType === "script" 
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {DICT[lang].tiktokScriptOpt}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={generateCampaignContent}
                    disabled={isAiLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 hover:opacity-95 text-white text-xs font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    {isAiLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-indigo-600 border-t-white rounded-full animate-spin"></span>
                        <span>{DICT[lang].generating}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>{DICT[lang].generateBtn}</span>
                      </>
                    )}
                  </button>

                  <div className="bg-slate-50 p-3.5 border border-slate-100 rounded-xl text-[11px] text-slate-500 leading-relaxed font-mono">
                    <span className="font-bold text-slate-800 block mb-1">
                      {lang === "ar" ? "مؤشرات الانتشار والأرباح:" : "PROMOTION INSIGHT:"}
                    </span>
                    {lang === "ar" 
                      ? "مقاطع تيك توك وريلز القصيرة التي تعرض إثباتات سحب ودائع النجوم أو إحالات أوتوماتيكية تحقق معدل تفاعل خارق يفوق 4.5 مرة!" 
                      : "TikTok reels with bold hook scripts about passive income tools get 4.5x higher engagement metrics."}
                  </div>
                </div>

                {/* Content Results Display Sandbox */}
                <div className="lg:col-span-12 xl:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col overflow-hidden min-h-[400px]">
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <span className="text-xs font-mono font-bold text-slate-700">{DICT[lang].canvasTitle}</span>
                    {aiResult && (
                      <button 
                        onClick={() => handleCopyCode(aiResult, 999)}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {DICT[lang].copyText}
                      </button>
                    )}
                  </div>

                  <div className="flex-grow p-6 overflow-y-auto max-h-[430px] bg-slate-50/20">
                    {isAiLoading && (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-xs text-slate-500 font-medium font-mono">{DICT[lang].generating}</p>
                      </div>
                    )}

                    {!isAiLoading && !aiResult && !aiError && (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-4 py-12">
                        <Bot className="w-12 h-12 text-slate-200 animate-bounce" />
                        <div className="px-4">
                          <p className="text-xs font-semibold text-slate-600">{DICT[lang].placeholderResult}</p>
                        </div>
                      </div>
                    )}

                    {aiError && (
                      <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-xl text-xs space-y-2">
                        <p className="font-bold">Execution Error:</p>
                        <p className="font-mono">{aiError}</p>
                      </div>
                    )}

                    {aiResult && (
                      <div className="prose prose-indigo max-w-none text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-mono font-medium bg-white p-4 rounded-xl border border-slate-150 shadow-inner">
                        {aiResult}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-slate-50 border-t border-slate-150 px-5 py-3 text-[10px] text-slate-400 font-mono flex items-center gap-1.5 justify-between">
                    <span>Model Selection: gemini-3.5-flash</span>
                    <span>100% legal, compliant blueprints</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GROWTH STRATEGY MATRIX */}
          {activeTab === "growth" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="space-y-6">
                
                {/* 1. Monetization Systems Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5.5 h-5.5 text-amber-500" />
                    <h3 className="text-lg font-bold text-gray-950 font-sans">2026 Monetization Ecosystem Blueprint</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Proven passive revenue structures optimized for light Telegram bot interfaces setup:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                      <span className="text-xs bg-indigo-100 text-indigo-800 font-mono font-bold px-2.5 py-1 rounded-md">⭐ Stars Unlocks</span>
                      <div className="text-xs">
                        <span className="font-semibold block text-slate-800">In-App AI Vouchers (50 - 100 Stars)</span>
                        <span className="text-slate-500 mt-0.5 block">Charge users Telegram Stars to unlock special AI digital manuals or generate high-yielding video hooks. Native payment without leaving key environments.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                      <span className="text-xs bg-purple-100 text-purple-800 font-mono font-bold px-2.5 py-1 rounded-md">👑 VIP Lifetime</span>
                      <div className="text-xs">
                        <span className="font-semibold block text-slate-800">Premium memberships (250 Stars)</span>
                        <span className="text-slate-500 mt-0.5 block">One-time upgrade fee to unlock unlimited generation credits, advanced AI modules, double cash commissions, and fast rendered layouts.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-mono font-bold px-2.5 py-1 rounded-md">🤝 Affiliate Hub</span>
                      <div className="text-xs">
                        <span className="font-semibold block text-slate-800">Dynamic Sponsor Integrations</span>
                        <span className="text-slate-500 mt-0.5 block">Introduce high-convert systems from WarriorPlus, Impact, or ClickBank. Embed your links securely using parameters logs inside daily schedules.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Viral short formula */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5.5 h-5.5 text-red-500" />
                    <h3 className="text-lg font-bold text-gray-950 font-sans">TikTok/Reels Free Viral Blueprint</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Drive 3,000+ targeted clicks to your Telegram landing bot page entirely for free with organic vertical shorts:
                  </p>

                  <div className="border border-indigo-100 bg-indigo-50/30 p-4 rounded-xl text-xs space-y-3">
                    <div className="flex justify-between items-center text-indigo-950 font-semibold border-b border-indigo-100 pb-2">
                      <span>THE VIRAL Retaining Hook Matrix</span>
                      <span>15 SECONDS</span>
                    </div>
                    
                    <div>
                      <span className="font-bold text-indigo-900 block">⏱️ Sec 0-3 (Immediate Grabber):</span>
                      <span className="text-slate-600">"Most programmers are gatekeeping this Telegram bot because it prints passive Stars on complete autopilot..."</span>
                    </div>

                    <div>
                      <span className="font-bold text-indigo-900 block">⏱️ Sec 4-10 (Interactive Visual proof):</span>
                      <span className="text-slate-600">Display this simulator, showing automated database transaction logs moving and Star balances incrementing in real-time.</span>
                    </div>

                    <div>
                      <span className="font-bold text-indigo-900 block">⏱️ Sec 11-15 (Call To Action Deep Link):</span>
                      <span className="text-slate-600">"Deploy the modular engine in under 5 minutes. Real link is inside my bio. Go launch!"</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                
                {/* 3. Growth checklist targeting $100/day */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5.5 h-5.5 text-emerald-600" />
                    <h3 className="text-lg font-bold text-gray-950 font-sans">Strategic Milestones checklist</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Set clear objectives to scale operations from zero-cash starting levels into consistent income:
                  </p>

                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-xl border border-slate-100 flex items-start gap-3">
                      <div className="bg-indigo-50 text-indigo-700 font-mono font-bold w-6 h-6 rounded-lg flex items-center justify-center shrink-0">1</div>
                      <div>
                        <span className="font-semibold block text-slate-800">Secure BotFather Token Credentials</span>
                        <span className="text-slate-400 mt-0.5 block">Connect your bot token identifier, configure Stars billing parameters inside BotFather settings menu.</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-100 flex items-start gap-3">
                      <div className="bg-indigo-50 text-indigo-700 font-mono font-bold w-6 h-6 rounded-lg flex items-center justify-center shrink-0">2</div>
                      <div>
                        <span className="font-semibold block text-slate-800">Railway background services runtime</span>
                        <span className="text-slate-400 mt-0.5 block">Paste the modular code directory, map the Dockerfile runner configurations, and trigger deployment with active environment keys.</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-100 flex items-start gap-3">
                      <div className="bg-indigo-50 text-indigo-700 font-mono font-bold w-6 h-6 rounded-lg flex items-center justify-center shrink-0">3</div>
                      <div>
                        <span className="font-semibold block text-slate-800">Launch TikTok vertical pipeline</span>
                        <span className="text-slate-400 mt-0.5 block">Use the built-in Gemini hook engine to generate scripts, publish daily shorts, redirect traffic to the referral tracking link.</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-100 flex items-start gap-3">
                      <div className="bg-indigo-50 text-indigo-700 font-mono font-bold w-6 h-6 rounded-lg flex items-center justify-center shrink-0">4</div>
                      <div>
                        <span className="font-semibold block text-slate-800 font-sans">Continuous scaling network</span>
                        <span className="text-slate-400 mt-0.5 block">Monitor subscriber volumes, execute Star withdrawable exchanges inside Fragment platform, expand affiliate promotion arrays.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legal compliance framework info box */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-850 text-white space-y-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4.5 h-4.5 text-emerald-400" />
                    <h4 className="text-sm font-bold text-slate-100 font-sans">Legal & Regulatory Compliance</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                    Telegram Stars are the platform's official internal digital tokens compliant with global Google Play Store & Apple App Store developer regulations. Any earned active tokens exchange smoothly into real fiat cash via the Fragment decentralization market, providing fully law-compliant recurring income blocks.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer Area with Human and Literal terms */}
      <footer className="bg-white border-t border-slate-150 py-6 px-6 text-center text-xs text-slate-400 font-mono shrink-0">
        <div className="max-w-[1600px] w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <p>© 2026 Telegram AI bot Code developer dashboard • Fully responsive web client</p>
            <p className="mt-0.5 text-slate-300">SQLite & AI modules initialized with stable multi-stage Railway Docker support</p>
          </div>
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl text-[11px] text-slate-500 font-sans shadow-3xs max-w-full md:max-w-none text-right">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500 animate-pulse"></span>
            </span>
            <span className="font-sans text-slate-700 font-medium">
              {lang === "ar" 
                ? "بإشراف وتصميم: الخبير البرمجي المهندس محمد جهاد الغياث" 
                : "Engineered & Designed by: Eng. Mohammad Jehad Al-Ghiath"}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

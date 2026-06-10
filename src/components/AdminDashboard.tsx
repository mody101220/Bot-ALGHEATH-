import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp,  
  Users, 
  Coins, 
  Share2, 
  BadgeAlert, 
  CheckCircle, 
  DollarSign, 
  Sparkles, 
  ArrowUpRight,
  TrendingDown,
  Lock,
  Trash2,
  GripVertical
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock financial statistics for a active bot setup that is scaling from $0 to $100/day
const GROWTH_DATA_WEEK = [
  { day: "Mon", revenue: 42, activeUsers: 340, starsPaid: 2100, referrals: 90 },
  { day: "Tue", revenue: 58, activeUsers: 480, starsPaid: 2900, referrals: 130 },
  { day: "Wed", revenue: 65, activeUsers: 610, starsPaid: 3250, referrals: 150 },
  { day: "Thu", revenue: 89, activeUsers: 790, starsPaid: 4450, referrals: 210 },
  { day: "Fri", revenue: 104, activeUsers: 950, starsPaid: 5200, referrals: 280 },
  { day: "Sat", revenue: 120, activeUsers: 1120, starsPaid: 6000, referrals: 310 },
  { day: "Sun", revenue: 145, activeUsers: 1350, starsPaid: 7250, referrals: 400 },
];

const MILESTONES_CHECKLIST = [
  { id: 1, text: "بناء بوت تيليجرام وقواعد البيانات (SQLite/PostgreSQL)", done: true, phase: "التأسيس" },
  { id: 2, text: "ربط توكن @BotFather ومفتاح Gemini الذكي", done: true, phase: "الإعداد" },
  { id: 3, text: "تشغيل البوت على استضافة مجانية (Render / Railway / Koyeb)", done: false, phase: "الإطلاق" },
  { id: 4, text: "نشر أول 3 فيديوهات قصيرة مع روابط تتبع ذكية", done: false, phase: "الانتشار" },
  { id: 5, text: "الوصول لـ 50 مستخدم وأول مشترك بريميوم بنجوم تيليجرام", done: false, phase: "الأرباح" },
  { id: 6, text: "زيادة عمولات الإحالة وتوسيع عروض التسويق بالعمولة", done: false, phase: "النمو" },
];

export default function AdminDashboard({ lang = "ar", theme = "dark" }: { lang?: "ar" | "en"; theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  const cardClass = isDark 
    ? "bg-slate-900 border border-slate-850 text-slate-100 shadow-md-dark" 
    : "bg-white border border-slate-100 text-slate-900 shadow-xs";
  const textMuted = isDark ? "text-slate-400" : "text-gray-400";
  const textNormal = isDark ? "text-slate-300" : "text-gray-600";
  const textTitle = isDark ? "text-white" : "text-gray-950";

  const [timeframe, setTimeframe] = useState<"7d" | "30d">("7d");
  const [simulatedRevenue, setSimulatedRevenue] = useState(145);
  const [totalSubscribers, setTotalSubscribers] = useState(1350);
  const [milestones, setMilestones] = useState(MILESTONES_CHECKLIST);
  const [milestoneFilter, setMilestoneFilter] = useState<"all" | "completed" | "pending">("all");
  const [milestoneToDelete, setMilestoneToDelete] = useState<{ id: number; text: string } | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragTargetId, setDragTargetId] = useState<number | null>(null);
  const [newMilestoneText, setNewMilestoneText] = useState("");
  const [newMilestonePhase, setNewMilestonePhase] = useState("");

  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(m => m.done).length;
  const completionPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // Dynamic 7-day earnings growth calculation based on simulatedRevenue
  const earningsGrowthWeek = GROWTH_DATA_WEEK.map((item) => {
    const ratio = simulatedRevenue / 145;
    const arabicDays: Record<string, string> = {
      "Mon": "الإثنين", 
      "Tue": "الثلاثاء", 
      "Wed": "الأربعاء", 
      "Thu": "الخميس", 
      "Fri": "الجمعة", 
      "Sat": "السبت", 
      "Sun": "الأحد"
    };
    return {
      day: lang === "ar" ? (arabicDays[item.day] || item.day) : item.day,
      revenue: Math.round(item.revenue * ratio)
    };
  });

  // Sparkle and Confetti particles state
  const [confettiParticles, setConfettiParticles] = useState<{
    id: number;
    leftPercent: number;
    targetX: number;
    targetY: number;
    color: string;
    size: number;
    delay: number;
    shape: "circle" | "square" | "star";
    spin: number;
  }[]>([]);

  // Toast notification state & logic for Income updates
  interface VisualToast {
    id: string;
    title: string;
    message: string;
    amount?: number;
    time: string;
  }
  const [toasts, setToasts] = useState<VisualToast[]>([]);
  const isFirstMount = React.useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    
    const toastId = Math.random().toString();
    const currentRevenue = simulatedRevenue;
    
    const arabicMilestones = [
      `تم تحقيق إيراد جديد بمعدل $${currentRevenue} يومياً! 🚀`,
      `نمو استثنائي! بلغ معدل الدخل في حساب محمد الغياث $${currentRevenue} ✅`,
      `تحديث مالي: تم تحديث مخطط الأرباح والنمو بنسبة +38.5% 📈`,
      `مستوى جديد من التميز! تخطى البوت حاجز الدخل المستهدف 🎉`
    ];
    
    const englishMilestones = [
      `New financial runrate of $${currentRevenue}/day unlocked! 🚀`,
      `Exceptional growth! Mohamed Al-Ghiath earnings hit $${currentRevenue}/day ✅`,
      `Financial Update: Pacing trend updated successfully! 📈`,
      `New milestone achieved for Al-Ghiath Bot business 🎉`
    ];
    
    const titleAr = "🎉 تم تشغيل وتحديث مخططات الأرباح!";
    const titleEn = "🎉 Income Chart Updated!";
    
    const message = lang === "ar" 
      ? arabicMilestones[Math.floor(Math.random() * arabicMilestones.length)]
      : englishMilestones[Math.floor(Math.random() * englishMilestones.length)];
      
    const title = lang === "ar" ? titleAr : titleEn;
    
    const newToast: VisualToast = {
      id: toastId,
      title,
      message,
      amount: currentRevenue,
      time: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    
    setToasts(prev => [newToast, ...prev].slice(0, 4));
    
    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 4500);
    
    return () => clearTimeout(timer);
  }, [simulatedRevenue, lang]);

  useEffect(() => {
    if (completionPercentage === 100 && totalMilestones > 0) {
      const colors = ["#4f46e5", "#10b981", "#f59e0b", "#ec4899", "#3b82f6", "#8b5cf6", "#06b6d4", "#ef4444"];
      const shapes: ("circle" | "square" | "star")[] = ["circle", "square", "star"];
      
      const newParticles = Array.from({ length: 48 }).map((_, i) => {
        // Start uniform spread near the middle of dynamic bar
        const leftPercent = 25 + Math.random() * 50; // starts between 25% and 75%
        const angle = (Math.random() * 120 + 30) * (Math.PI / 180); // 30 to 150 deg upward radian angle
        const distance = 80 + Math.random() * 160; 
        
        return {
          id: i,
          leftPercent,
          targetX: Math.cos(angle) * distance,
          targetY: -Math.sin(angle) * distance - 50,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.floor(Math.random() * 8) + 6, // 6px to 14px size
          delay: Math.random() * 0.35, // nice stagger waterfall timing
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          spin: (Math.random() - 0.5) * 720 // rotate spin angle
        };
      });
      setConfettiParticles(newParticles);

      // Reset after transition finishes
      const timer = setTimeout(() => {
        setConfettiParticles([]);
      }, 4200);
      return () => clearTimeout(timer);
    } else {
      setConfettiParticles([]);
    }
  }, [completionPercentage, totalMilestones]);

  // Simple simulator actions
  const simulateNewSub = () => {
    setTotalSubscribers(prev => prev + 15);
    setSimulatedRevenue(prev => prev + 12);
  };

  const handleToggleMilestone = (id: number) => {
    const originalIndex = milestones.findIndex(item => item.id === id);
    if (originalIndex === -1) return;
    
    // Check locked constraint: index > 0 must have the previous milestone done
    const isLocked = originalIndex > 0 && !milestones[originalIndex - 1].done;
    if (isLocked) return;

    setMilestones(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, done: !m.done } : m);
      
      // Cascade uncheck logic: if any item is unchecked, check all subsequent items
      // and uncheck them if their immediate prerequisites are not completed.
      for (let i = 0; i < updated.length; i++) {
        if (i > 0 && !updated[i - 1].done) {
          updated[i].done = false;
        }
      }
      return updated;
    });
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number, text: string) => {
    e.stopPropagation();
    setMilestoneToDelete({ id, text });
  };

  const confirmDeleteMilestone = () => {
    if (!milestoneToDelete) return;
    const targetId = milestoneToDelete.id;
    setMilestones(prev => {
      const remaining = prev.filter(m => m.id !== targetId);
      const updated = [...remaining];
      for (let i = 0; i < updated.length; i++) {
        if (i > 0 && !updated[i - 1].done) {
          updated[i].done = false;
        }
      }
      return updated;
    });
    setMilestoneToDelete(null);
  };

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    setMilestones(prev => {
      const nextId = prev.length > 0 ? Math.max(...prev.map(m => m.id)) + 1 : 1;
      const defaultPhase = lang === "ar" ? "إضافة يدويّة" : "Manual Add";
      const chosenPhase = newMilestonePhase.trim() || defaultPhase;
      const newMilestone = {
        id: nextId,
        text: newMilestoneText.trim(),
        done: false,
        phase: chosenPhase
      };
      
      const updated = [...prev, newMilestone];
      // Re-evaluate cascade logic
      for (let i = 0; i < updated.length; i++) {
        if (i > 0 && !updated[i - 1].done) {
          updated[i].done = false;
        }
      }
      return updated;
    });
    setNewMilestoneText("");
    setNewMilestonePhase("");
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData("text/plain", id.toString());
    setDraggedId(id);
    e.currentTarget.classList.add("opacity-40");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedId(null);
    setDragTargetId(null);
    e.currentTarget.classList.remove("opacity-40");
  };

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    if (draggedId !== null && draggedId !== id) {
      setDragTargetId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    setDragTargetId(null);
    if (draggedId === null || draggedId === targetId) return;

    setMilestones(prev => {
      const originalDraggedIndex = prev.findIndex(m => m.id === draggedId);
      const originalTargetIndex = prev.findIndex(m => m.id === targetId);

      if (originalDraggedIndex === -1 || originalTargetIndex === -1) return prev;

      const updated = [...prev];
      const [removed] = updated.splice(originalDraggedIndex, 1);
      updated.splice(originalTargetIndex, 0, removed);

      // Re-evaluate cascade logic under the new priorities
      for (let i = 0; i < updated.length; i++) {
        if (i > 0 && !updated[i - 1].done) {
          updated[i].done = false;
        }
      }
      return updated;
    });

    setDraggedId(null);
  };

  const filteredMilestones = milestones.filter(m => {
    if (milestoneFilter === "completed") return m.done;
    if (milestoneFilter === "pending") return !m.done;
    return true;
  });

  // $100/day goal calculation based on Stars balance (50 Stars = $1)
  const dailyGoalStars = 5000;
  const todayStarsBalance = Math.round((simulatedRevenue * 32.5) + 350);
  const progressPercent = Math.min(100, Math.round((todayStarsBalance / dailyGoalStars) * 100));

  return (
    <div id="AdminDashboard" className="space-y-6">
      {/* Upper overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${cardClass} p-5 rounded-2xl flex flex-col justify-between gap-3 transition-colors duration-300`}>
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-xs ${textMuted} font-medium font-sans`}>
                {lang === "ar" ? "معدل الدخل اليومي" : "Daily Income Overview"}
              </span>
              <h4 className={`text-2xl font-bold font-sans mt-1 ${textTitle}`}>${simulatedRevenue}</h4>
            </div>
            <div className={`${isDark ? "bg-emerald-950/40 text-emerald-400" : "bg-emerald-50 text-emerald-600"} p-2 rounded-xl transition-colors`}>
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          {/* Sparkline & Circular Gauge Container */}
          <div className="flex items-center justify-between gap-3 h-12 w-full mt-1" id="income-overview-container">
            {/* Small Line Chart showing 7-day simulated earnings growth */}
            <div className="h-10 flex-1" id="income-mini-sparkline">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsGrowthWeek}>
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={false}
                  />
                  <Tooltip 
                    contentStyle={
                      isDark 
                        ? { backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc", fontSize: "10px", padding: "4px 8px" } 
                        : { border: "1px solid #e2e8f0", fontSize: "10px", padding: "4px 8px" }
                    } 
                    labelStyle={{ fontWeight: "bold" }}
                    formatter={(value: any) => [`$${value}`, lang === "ar" ? "الأرباح" : "Earnings"]}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Circular Gauge Indicator for Stars balance vs $100 Goal powered by Recharts */}
            <div className="flex flex-col items-center justify-center shrink-0" id="stars-circular-gauge">
              <div 
                className="relative group cursor-help text-center w-12 h-12 flex items-center justify-center" 
                title={lang === "ar" ? `${progressPercent}% من الهدف اليومي (${todayStarsBalance} / 5000 ⭐)` : `${progressPercent}% of Today's Goal (${todayStarsBalance} / 5000 ⭐)`}
              >
                <div className="absolute inset-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Progress", value: progressPercent },
                          { name: "Remaining", value: Math.max(0, 100 - progressPercent) }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={13}
                        outerRadius={19}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill="#f59e0b" />
                        <Cell fill={isDark ? "#1e293b" : "#e2e8f0"} />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[9px] font-black font-sans leading-none">
                  <span className={`${isDark ? "text-amber-400" : "text-amber-650"} select-none`}>
                    {progressPercent}%
                  </span>
                </div>
              </div>
              <span className={`text-[8px] font-bold uppercase mt-0.5 tracking-wider ${isDark ? "text-amber-400/85" : "text-amber-600"}`}>
                {lang === "ar" ? "الهدف اليومي" : "Progress"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-medium border-t border-slate-100 dark:border-slate-800/60 pt-2 shrink-0">
            <div className="flex items-center gap-1 text-emerald-500">
              <TrendingUp className="w-3 h-3" />
              <span>{lang === "ar" ? `الهدف: $100/يوم` : `Goal: $100/day`}</span>
            </div>
            <span className={`${textMuted} font-mono text-[9px] flex items-center gap-0.5`}>
              <span className="text-amber-500 font-bold">{todayStarsBalance}</span>/5k ⭐
            </span>
          </div>
        </div>

        <div className={`${cardClass} p-5 rounded-2xl flex items-center justify-between transition-colors duration-300`}>
          <div>
            <span className={`text-xs ${textMuted} font-medium font-sans`}>Active Members</span>
            <h4 className={`text-2xl font-bold font-sans mt-1 ${textTitle}`}>{totalSubscribers}</h4>
            <div className="flex items-center gap-1 text-emerald-500 text-xs mt-2 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+24.1% network scale</span>
            </div>
          </div>
          <div className={`${isDark ? "bg-blue-950/40 text-blue-400" : "bg-blue-50 text-blue-600"} p-3 rounded-xl transition-colors`}>
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className={`${cardClass} p-5 rounded-2xl flex items-center justify-between transition-colors duration-300`}>
          <div>
            <span className={`text-xs ${textMuted} font-medium font-sans`}>Telegram Stars Sold</span>
            <h4 className={`text-2xl font-bold font-sans mt-1 ${textTitle}`}>
              {(totalSubscribers * 5.3).toFixed(0)} ⭐
            </h4>
            <div className="flex items-center gap-1 text-amber-500 text-xs mt-2 font-medium">
              <Coins className="w-3.5 h-3.5 animate-pulse" />
              <span>100% native billing</span>
            </div>
          </div>
          <div className={`${isDark ? "bg-amber-950/40 text-amber-400" : "bg-amber-50 text-amber-600"} p-3 rounded-xl transition-colors`}>
            <Coins className="w-6 h-6" />
          </div>
        </div>

        <div className={`${cardClass} p-5 rounded-2xl flex items-center justify-between transition-colors duration-300`}>
          <div>
            <span className={`text-xs ${textMuted} font-medium font-sans`}>Referral Conversions</span>
            <h4 className={`text-2xl font-bold font-sans mt-1 ${textTitle}`}>
              {(totalSubscribers * 0.32).toFixed(0)}
            </h4>
            <div className="flex items-center gap-1 text-purple-500 text-xs mt-2 font-medium">
              <Share2 className="w-3.5 h-3.5" />
              <span>32% viral conversion rate</span>
            </div>
          </div>
          <div className={`${isDark ? "bg-purple-950/40 text-purple-400" : "bg-purple-50 text-purple-600"} p-3 rounded-xl transition-colors`}>
            <Share2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Graph Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 ${cardClass} rounded-2xl p-6 transition-colors duration-300`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-bold font-sans ${textTitle}`}>Stars & Affiliate Revenue Trend</h3>
              <p className={`text-xs mt-0.5 ${textMuted}`}>Automated cash flows generated through digital unlocks & sponsor links</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={simulateNewSub} 
                className={`text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                  isDark 
                    ? "bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-900/30" 
                    : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Simulate Conversion
              </button>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GROWTH_DATA_WEEK}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke={isDark ? "#64748b" : "#9ca3af"} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? "#64748b" : "#9ca3af"} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={isDark ? { backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc" } : { border: "1px solid #e2e8f0" }} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  name="Revenue ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${cardClass} rounded-2xl p-6 transition-colors duration-300`}>
          <h3 className={`text-lg font-bold font-sans ${textTitle}`}>Organic Sourcing</h3>
          <p className={`text-xs mt-0.5 ${textMuted}`}>Where your passive traffic funnel originates</p>

          <div className="space-y-4 mt-6">
            <div>
              <div className={`flex justify-between text-xs mb-1 font-semibold ${textNormal}`}>
                <span>TikTok organic shorts</span>
                <span>45%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-950" : "bg-gray-100"}`}>
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>

            <div>
              <div className={`flex justify-between text-xs mb-1 font-semibold ${textNormal}`}>
                <span>In-app referral invites</span>
                <span>32%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-950" : "bg-gray-100"}`}>
                <div className="bg-purple-600 h-full rounded-full" style={{ width: "32%" }}></div>
              </div>
            </div>

            <div>
              <div className={`flex justify-between text-xs mb-1 font-semibold ${textNormal}`}>
                <span>YouTube Shorts funnel</span>
                <span>15%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-950" : "bg-gray-100"}`}>
                <div className="bg-red-500 h-full rounded-full" style={{ width: "15%" }}></div>
              </div>
            </div>

            <div>
              <div className={`flex justify-between text-xs mb-1 font-semibold ${textNormal}`}>
                <span>Direct Search / Backlinks</span>
                <span>8%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-950" : "bg-gray-100"}`}>
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "8%" }}></div>
              </div>
            </div>
          </div>

          <div className={`border rounded-xl p-3.5 mt-5 ${
            isDark ? "bg-indigo-950/40 border-indigo-900 text-indigo-300" : "bg-indigo-50 border border-indigo-100 text-indigo-950"
          }`}>
            <div className="flex gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className={`text-xs font-semibold ${isDark ? "text-indigo-200" : "text-indigo-950"}`}>Milestone Watcher</p>
                <p className={`text-[11px] mt-0.5 ${isDark ? "text-indigo-350" : "text-indigo-750"}`}>Your Bot business is pacing for **$4,350/mo** recurring revenue stream in Year 1.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Roadmap to $100/day */}
      <div className={`${cardClass} rounded-2xl p-6 transition-colors duration-350`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b pb-4 ${isDark ? "border-slate-800" : "border-gray-100"}`}>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <div className="text-left">
              <h3 className={`text-lg font-bold font-sans ${textTitle}`}>
                {lang === "ar" ? "قائمة المهام والخطوات لربح 100$ يومياً (اضغط لتغيير الحالة)" : "Roadmap Checklist to Scale to $100/day (Click to toggle)"}
              </h3>
              <p className={`text-xs mt-0.5 font-sans flex flex-wrap items-center gap-x-2 gap-y-1 ${textMuted}`}>
                <span>
                  {lang === "ar" ? "مراحل التنفيذ الفعليّة لإطلاق البوت وتحقيق دخل سلبي مستمر" : "Actual phases to deploy the bot business and sustain passive revenue streams"}
                </span>
                <span className={`font-bold inline-flex items-center gap-1 border px-1.5 py-0.5 rounded-md text-[10px] select-none animate-pulse ${
                  isDark ? "bg-indigo-950/60 border-indigo-900 text-indigo-300" : "bg-indigo-50 border border-indigo-100/60 text-indigo-600"
                }`}>
                  <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                  {lang === "ar" ? "اسحب وأفلت لإعادة الترتيب والأولويات" : "Drag & drop to prioritize"}
                </span>
              </p>
            </div>
          </div>

          {/* Category Filter Buttons Row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setMilestoneFilter("all")}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all ${
                milestoneFilter === "all"
                  ? "bg-indigo-600 text-white border-indigo-700 shadow-xs"
                  : isDark 
                    ? "bg-slate-950 hover:bg-slate-900 text-slate-350 border-slate-850" 
                    : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {lang === "ar" ? "الكل" : "All"} ({milestones.length})
            </button>
            <button
              onClick={() => setMilestoneFilter("completed")}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all ${
                milestoneFilter === "completed"
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                  : isDark 
                    ? "bg-slate-950 hover:bg-slate-900 text-slate-350 border-slate-850" 
                    : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {lang === "ar" ? "المكتملة" : "Completed"} ({milestones.filter(m => m.done).length})
            </button>
            <button
              onClick={() => setMilestoneFilter("pending")}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all ${
                milestoneFilter === "pending"
                  ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                  : isDark 
                    ? "bg-slate-950 hover:bg-slate-900 text-slate-350 border-slate-850" 
                    : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {lang === "ar" ? "قيد التنفيذ" : "Pending"} ({milestones.filter(m => !m.done).length})
            </button>
          </div>
        </div>

        {/* Dynamic visual progress bar above the milestones list */}
        <div className={`mb-6 p-4 rounded-xl relative overflow-visible border ${
          isDark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"
        }`}>
          
          {/* Confetti overlay rain */}
          <AnimatePresence>
            {confettiParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
                animate={{ 
                  x: p.targetX, 
                  y: p.targetY, 
                  opacity: [1, 1, 0.7, 0],
                  scale: [0, 1.3, 1, 0],
                  rotate: p.spin
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 2.2, 
                  ease: "easeOut",
                  delay: p.delay 
                }}
                className="absolute top-1/2 pointer-events-none z-50 select-none"
                style={{ 
                  left: `${p.leftPercent}%`,
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.shape !== "star" ? p.color : undefined,
                  borderRadius: p.shape === "circle" ? "50%" : p.shape === "square" ? "1px" : undefined,
                }}
              >
                {p.shape === "star" && (
                  <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-xs">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-extrabold font-sans ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                {lang === "ar" ? "مؤشر التقدم الإجمالي للمراحل والمهام:" : "Overall Milestone Execution Progress:"}
              </span>
              <span className={`text-xs font-mono border px-2.5 py-0.5 rounded-md font-bold ${
                isDark ? "bg-indigo-950 border-indigo-900 text-indigo-300" : "bg-indigo-50 border border-indigo-100 text-indigo-700"
              }`}>
                {completedMilestones} / {totalMilestones} {lang === "ar" ? "خطوة مكتملة" : "Steps Completed"}
              </span>
            </div>
            <div className="text-sm font-mono font-black text-indigo-500 flex items-center gap-1.5">
              {completionPercentage === 100 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                >
                  🎉
                </motion.span>
              )}
              {completionPercentage}%
            </div>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 ${isDark ? "bg-slate-900" : "bg-slate-200"}`}>
            <motion.div 
              className="bg-indigo-600 h-full rounded-full min-w-[3%]" 
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            />
          </div>
        </div>

        {filteredMilestones.length === 0 ? (
          <div className={`text-center py-10 rounded-xl border border-dashed mt-4 leading-relaxed ${
            isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <CheckCircle className="w-9 h-9 text-emerald-500 mx-auto mb-2" />
            <p className={`text-sm font-semibold font-sans ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              {lang === "ar" ? "لا توجد مهام في هذا التصنيف حالياً" : "No milestones found in this classification"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {lang === "ar" ? "كل المهام والخطوات تبدو ممتازة!" : "All milestones are resolved and completed!"}
            </p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredMilestones.map((m) => {
                const originalIndex = milestones.findIndex(item => item.id === m.id);
                const isLocked = originalIndex > 0 && !milestones[originalIndex - 1].done;
                const isBeingDragged = draggedId === m.id;
                const isDragTarget = dragTargetId === m.id;

                return (
                  <motion.div 
                    layout
                    key={m.id}
                    onClick={() => handleToggleMilestone(m.id)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleToggleMilestone(m.id);
                      } else if (e.key === "Delete" || e.key === "Backspace") {
                        e.preventDefault();
                        setMilestoneToDelete({ id: m.id, text: m.text });
                      }
                    }}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, m.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, m.id)}
                    onDrop={(e) => handleDrop(e, m.id)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ 
                      opacity: isLocked ? 0.65 : isBeingDragged ? 0.35 : 1, 
                      scale: isDragTarget ? 1.025 : 1
                    }}
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
                    whileHover={isLocked ? {} : { scale: 1.015, y: -1 }}
                    whileTap={isLocked ? { x: [-4, 4, -4, 4, 0] } : { scale: 0.985 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`flex items-start gap-2.5 p-3.5 pr-10 rounded-xl border select-none relative group transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                      isDragTarget 
                        ? isDark ? "bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500 shadow-md" : "bg-indigo-50/60 border-indigo-500 ring-2 ring-indigo-500 shadow-md"
                        : isLocked 
                        ? isDark ? "bg-slate-900/40 border-slate-800 cursor-not-allowed text-slate-500" : "bg-slate-50 border-slate-100 cursor-not-allowed text-slate-400" 
                        : m.done
                        ? isDark ? "bg-slate-900/30 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
                        : isDark ? "bg-slate-850 border-slate-700 text-slate-100 hover:border-indigo-500/60" : "bg-white border-indigo-100 text-slate-850 hover:border-indigo-400"
                    } ${isBeingDragged ? "opacity-35" : ""}`}
                    title={isLocked 
                      ? (lang === "ar" ? "مقفل: يجب إكمال الخطوة السابقة لتفعيل هذه الخطوة (أو اسحب لتغيير الترتيب)" : "Locked: Complete the previous milestone step first (or drag to reorder)")
                      : (lang === "ar" ? "اضغط للتفعيل والتعطيل، أو اسحب لتعديل الترتيب" : "Click to toggle checklist status or drag to reorder")
                    }
                  >
                    {/* Visual Drag Handle */}
                    <div 
                      className="shrink-0 flex items-center pr-0.5 text-slate-400 group-hover:text-slate-300 self-center cursor-grab active:cursor-grabbing h-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <div className="shrink-0 mt-0.5 relative w-5 h-5">
                      <AnimatePresence mode="wait">
                        {isLocked ? (
                          <motion.div
                            key="locked"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 20 }}
                            className={`absolute inset-0 rounded-full border flex items-center justify-center ${
                              isDark ? "border-slate-800 text-slate-550 bg-slate-950" : "border-slate-200 text-slate-400 bg-slate-100/60"
                            }`}
                          >
                            <Lock className="w-3 h-3" />
                          </motion.div>
                        ) : m.done ? (
                          <motion.div
                            key="checked"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 20 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="unchecked"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 450, damping: 20 }}
                            className={`absolute inset-0 rounded-full border flex items-center justify-center text-xs font-bold ${
                              isDark ? "border-indigo-805 text-indigo-400 bg-indigo-950/50" : "border-indigo-200 text-indigo-700 bg-indigo-50/50"
                            }`}
                          >
                            {m.id}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex-1 text-left pl-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <motion.span 
                            layout="position"
                            animate={{ 
                              color: isLocked ? "rgb(148, 163, 184)" : m.done ? "rgb(148, 163, 184)" : isDark ? "rgb(241, 245, 249)" : "rgb(17, 24, 39)",
                              textDecorationLine: m.done ? "line-through" : "none"
                            }}
                            transition={{ duration: 0.25 }}
                            className="text-xs font-semibold"
                          >
                            {m.text}
                          </motion.span>
                          {isLocked && originalIndex > 0 && (
                            <span className="text-[10px] text-indigo-400 mt-0.5 font-sans leading-tight font-medium">
                              {lang === "ar" 
                                ? `يتطلب إكمال الخطوة: "${milestones[originalIndex - 1].text}"` 
                                : `Requires previous step: "${milestones[originalIndex - 1].text}"`}
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                          isDark ? "bg-slate-950 text-slate-400" : "bg-slate-100 text-slate-600"
                        }`}>
                          {m.phase}
                        </span>
                      </div>
                    </div>

                    {/* Trash Button */}
                    <button
                      onClick={(e) => handleDeleteClick(e, m.id, m.text)}
                      className={`absolute right-2.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg text-slate-400 hover:text-red-500 cursor-pointer z-10 ${
                        isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
                      }`}
                      title={lang === "ar" ? "حذف هذه الخطوة" : "Delete this milestone"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Separator and Add Milestone form */}
        <div className={`mt-6 pt-5 border-t space-y-4 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg ${isDark ? "bg-indigo-950 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
              <Sparkles className="w-4 h-4" />
            </span>
            <h4 className={`text-xs font-bold font-sans ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              {lang === "ar" ? "إضافة خطوة جديدة في خارطة الطريق" : "Add New Milestone to Roadmap"}
            </h4>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1">
              <input
                type="text"
                placeholder={lang === "ar" ? "أدخل تفاصيل المهمة الجديدة... واضغط Enter للإضافة" : "Enter new milestone task... and press Enter to add"}
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMilestone();
                  }
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-sans placeholder-slate-400 font-medium transition-all border outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark
                    ? "bg-slate-950 border-slate-800 focus:bg-slate-900 text-slate-200"
                    : "bg-slate-50 border-slate-200 focus:bg-white text-slate-850"
                }`}
              />
            </div>
            <div className="w-full sm:w-48">
              <input
                type="text"
                placeholder={lang === "ar" ? "المرحلة (اختياري، مثلاً: الإطلاق)" : "Phase (optional, e.g., Launch)"}
                value={newMilestonePhase}
                onChange={(e) => setNewMilestonePhase(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMilestone();
                  }
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-sans placeholder-slate-400 font-medium transition-all border outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark
                    ? "bg-slate-950 border-slate-800 focus:bg-slate-900 text-slate-200"
                    : "bg-slate-50 border-slate-200 focus:bg-white text-slate-850"
                }`}
              />
            </div>
            <button
              onClick={handleAddMilestone}
              className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>+</span>
              <span>{lang === "ar" ? "إضافة خطوة" : "Add Milestone"}</span>
            </button>
          </div>

          {/* Educational / Accessibility Keyboard Shortcuts Legend */}
          <div className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-y-2 mt-2 gap-x-4 ${
            isDark ? "bg-slate-950/70 border-slate-850" : "bg-slate-50/70 border-slate-100"
          }`}>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-extrabold uppercase font-sans tracking-wider px-1.5 py-0.5 rounded-sm ${
                isDark ? "bg-indigo-950 text-indigo-455" : "bg-indigo-50 text-indigo-650"
              }`}>
                Shortcuts
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {lang === "ar" 
                  ? "تسهيلات استخدام لوحة المفاتيح المدمجة لزيادة الإنتاجية" 
                  : "Built-in keyboard accessibility for power execution"}
              </span>
            </div>
            
            <div className="flex items-center gap-x-3 gap-y-1 flex-wrap text-[10px] font-mono font-bold text-slate-500">
              <span className="flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{lang === "ar" ? "مؤشّر نشط" : "Interactive Keys"}</span>
              </span>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-1">
                <kbd className={`px-1.5 py-0.5 border rounded-md shadow-3xs ${
                  isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-600"
                }`}>Enter / Space</kbd>
                <span>{lang === "ar" ? "لتفعيل/تعطيل" : "Toggle Status"}</span>
              </span>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-1">
                <kbd className={`px-1.5 py-0.5 border rounded-md shadow-3xs ${
                  isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-600"
                }`}>Delete / Backspace</kbd>
                <span>{lang === "ar" ? "Remove" : "Remove"}</span>
              </span>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-1">
                <kbd className={`px-1.5 py-0.5 border rounded-md shadow-3xs ${
                  isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-600"
                }`}>Tab</kbd>
                <span>{lang === "ar" ? "للتنقل" : "Navigate"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {milestoneToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMilestoneToDelete(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className={`rounded-2xl border shadow-2xl p-6 max-w-md w-full relative z-10 space-y-4 ${
                isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-150 text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3 text-red-500">
                <div className={`p-2.5 rounded-xl ${isDark ? "bg-red-950/50 text-red-400" : "bg-red-50 text-red-600"}`}>
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className={`text-base sm:text-lg font-bold font-sans ${textTitle}`}>
                  {lang === "ar" ? "تأكيد حذف الخطوة؟" : "Confirm Milestone Deletion?"}
                </h3>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {lang === "ar" 
                    ? "هل أنت متأكد من رغبتك في حذف هذه المرحلة/المهمة نهائياً من القائمة؟ لا يمكن التراجع عن هذا الإجراء." 
                    : "Are you sure you want to permanently delete this milestone milestone from your configuration? This action cannot be undone."}
                </p>
                <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                  <p className={`text-xs font-mono font-black break-words ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                    {milestoneToDelete.text}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setMilestoneToDelete(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isDark 
                      ? "text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-900 border-slate-800" 
                      : "text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border-slate-100"
                  }`}
                >
                  {lang === "ar" ? "إلغاء الأمر" : "Cancel"}
                </button>
                <button
                  onClick={confirmDeleteMilestone}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 hover:shadow-md transition-all cursor-pointer"
                >
                  {lang === "ar" ? "نعم، حذف نهائياً" : "Yes, Delete Milestone"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Visual Toast Notification Overlay */}
      <div id="visual-dashboard-toasts" className="fixed bottom-5 right-5 z-[200] flex flex-col gap-3 max-w-xs sm:max-w-md w-full pointer-events-none p-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
              layout
              className={`pointer-events-auto p-4 rounded-xl border flex flex-col gap-1.5 shadow-2xl relative overflow-hidden backdrop-blur-md transition-all duration-300 ${
                isDark 
                  ? "bg-slate-900/95 border-emerald-500/20 text-slate-100 shadow-emerald-500/5 shadow-2xl" 
                  : "bg-white/95 border-emerald-500/20 text-slate-900 shadow-emerald-500/5 shadow-2xl"
              }`}
            >
              {/* Golden/green side accent line */}
              <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-amber-400 to-emerald-500" />
              
              <div className="flex items-start justify-between gap-3 ml-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg shrink-0 ${isDark ? "bg-emerald-950 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                    <Sparkles className="w-4 h-4 animate-pulse text-amber-400" />
                  </div>
                  <h5 className="text-xs font-black font-sans tracking-tight text-amber-500 uppercase">
                    {toast.title}
                  </h5>
                </div>
                <button
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="text-slate-400 hover:text-red-400 p-0.5 hover:bg-slate-400/10 rounded-lg cursor-pointer transition-colors shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className={`text-xs font-sans font-medium leading-relaxed ml-2 ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                {toast.message}
              </div>

              <div className="flex items-center justify-between mt-1 text-[9px] text-slate-400 ml-2 font-mono">
                <span className="bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400 font-bold uppercase tracking-wider text-[8px]">
                  {lang === 'ar' ? 'نمو الأرباح' : 'earnings scaling'}
                </span>
                <span>{toast.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

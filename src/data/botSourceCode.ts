import { SourceFile } from "../types";

export const BOT_SOURCE_CODE: SourceFile[] = [
  {
    name: "config.py",
    path: "config.py",
    language: "python",
    description: "Centrally manages environment configuration, secrets, subscription packages, and system variables.",
    content: `import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

# Telegram Bot Token supplied by @BotFather
BOT_TOKEN = os.getenv("BOT_TOKEN", "8994906142:AAHrIArGfx01PMCDhk2-jL64X8j2gfrGMRM")

# Google Gemini API Key for on-demand viral text/video structures
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Administrator Telegram IDs (for visual stats, system commands)
ADMIN_IDS = [int(i.strip()) for i in os.getenv("ADMIN_IDS", "2138200729").split(",") if i.strip()]

# SQLite DB Path
DB_PATH = os.getenv("DB_PATH", "bot_database.db")

# Telegram Stars Provider Token (Leave empty for Telegram Stars digital payments which do not require general payment gateways)
PROVIDER_TOKEN = os.getenv("PROVIDER_TOKEN", "")

# Monetization settings
PREMIUM_PRICE_STARS = int(os.getenv("PREMIUM_PRICE_STARS", "250"))  # Upgrade lifetime premium
STAR_UNLOCK_COST = int(os.getenv("STAR_UNLOCK_COST", "50"))       # Mini AI product unlock fee

# Affiliate Commission rate for user referrals (e.g., 20% on virtual item unlocks)
REFERRAL_BONUS_STARS = 50
REFERRAL_PERCENT_COMMISSION = 0.25 # 25% on all premium stars payments
`
  },
  {
    name: "database.py",
    path: "database.py",
    language: "python",
    description: "متحكم قاعدة البيانات الذي ينفذ استعلامات SQLite آمنة ومحمية لتسجيل مدفوعات النجوم والإحالات والاشتراكات لضمان خفتها على الاستضافة المجانية.",
    content: `import sqlite3
import os
from datetime import datetime
from config import DB_PATH

def init_db():
    """Initializes the SQLite schema if it doesn't already exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Enable Write-Ahead Logging for high concurrent read-write performance
    cursor.execute("PRAGMA journal_mode=WAL;")
    
    # 1. Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        username TEXT,
        full_name TEXT,
        joined_at TEXT NOT NULL,
        is_premium INTEGER DEFAULT 0,
        referred_by INTEGER,
        stars_balance INTEGER DEFAULT 0,
        free_uses_left INTEGER DEFAULT 5,
        daily_login_checked TEXT
    );
    """)
    
    # 2. Referrals Analytics
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS referrals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        referred_id INTEGER UNIQUE,
        referrer_id INTEGER,
        earned_stars INTEGER DEFAULT 0,
        rewarded_at TEXT NOT NULL,
        FOREIGN KEY (referred_id) REFERENCES users(user_id),
        FOREIGN KEY (referrer_id) REFERENCES users(user_id)
    );
    """)

    # 3. Custom Affiliate Offers
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS affiliate_offers (
        offer_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        affiliate_link TEXT NOT NULL,
        payout_description TEXT,
        clicks INTEGER DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        revenue_earned REAL DEFAULT 0.0,
        is_active INTEGER DEFAULT 1
    );
    """)

    # 4. Content Scheduler
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS posts_scheduler (
        post_id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT NOT NULL, -- 'Telegram', 'TikTok', 'Instagram'
        title TEXT,
        body TEXT NOT NULL,
        scheduled_for TEXT NOT NULL, -- ISO Format
        is_published INTEGER DEFAULT 0,
        prompt_used TEXT
    );
    """)

    # 5. Star Purchases Ledger
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS payments_ledger (
        payment_id TEXT PRIMARY KEY,
        user_id INTEGER,
        amount_stars INTEGER,
        purpose TEXT,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
    """)
    
    conn.commit()
    conn.close()

class Database:
    def __init__(self):
        self.db_path = DB_PATH

    def _execute(self, query, params=(), commit=False, fetch="all"):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        try:
            cursor.execute(query, params)
            if commit:
                conn.commit()
            if fetch == "all":
                return cursor.fetchall()
            elif fetch == "one":
                return cursor.fetchone()
            return None
        finally:
            conn.close()

    # User-centric queries
    def get_or_create_user(self, user_id, username, full_name, referred_by=None):
        existing = self._execute("SELECT * FROM users WHERE user_id = ?", (user_id,), fetch="one")
        if existing:
            return existing
        
        joined = datetime.utcnow().isoformat()
        ref = None
        if referred_by and referred_by != user_id:
            # Verify referrer exists
            ref_exists = self._execute("SELECT user_id FROM users WHERE user_id = ?", (referred_by,), fetch="one")
            if ref_exists:
                ref = referred_by
                
        self._execute(
            "INSERT INTO users (user_id, username, full_name, joined_at, referred_by) VALUES (?, ?, ?, ?, ?)",
            (user_id, username, full_name, joined, ref),
            commit=True
        )
        
        if ref:
            # Log referral and reward base points
            self._execute(
                "INSERT INTO referrals (referred_id, referrer_id, earned_stars, rewarded_at) VALUES (?, ?, ?, ?)",
                (user_id, ref, 50, joined),
                commit=True
            )
            self._execute(
                "UPDATE users SET stars_balance = stars_balance + 50 WHERE user_id = ?",
                (ref,),
                commit=True
            )
            
        return self._execute("SELECT * FROM users WHERE user_id = ?", (user_id,), fetch="one")

    def upgrade_to_premium(self, user_id):
        self._execute("UPDATE users SET is_premium = 1 WHERE user_id = ?", (user_id,), commit=True)
        # Give lifetime commissions allocation
        user_info = self._execute("SELECT referred_by FROM users WHERE user_id = ?", (user_id,), fetch="one")
        if user_info and user_info[0]:
            ref_id = user_info[0]
            commission_stars = int(250 * 0.25) # 25% of premium cost
            self._execute(
                "UPDATE users SET stars_balance = stars_balance + ? WHERE user_id = ?",
                (commission_stars, ref_id),
                commit=True
            )

    def deduct_usage(self, user_id):
        user = self._execute("SELECT is_premium, free_uses_left FROM users WHERE user_id = ?", (user_id,), fetch="one")
        if not user:
            return False
        is_premium, free_uses = user
        if is_premium:
            return True # Infinite AI credits for premiums
        if free_uses > 0:
            self._execute("UPDATE users SET free_uses_left = free_uses_left - 1 WHERE user_id = ?", (user_id,), commit=True)
            return True
        return False

    def get_stats(self):
        total_users = self._execute("SELECT COUNT(*) FROM users", fetch="one")[0]
        premium_users = self._execute("SELECT COUNT(*) FROM users WHERE is_premium = 1", fetch="one")[0]
        total_stars = self._execute("SUM(amount_stars) FROM payments_ledger", fetch="one") # Handle safe sum
        # Safe read
        stars_sold = self._execute("SELECT SUM(amount_stars) FROM payments_ledger", fetch="one")[0] or 0
        referrals_count = self._execute("SELECT COUNT(*) FROM referrals", fetch="one")[0]
        return {
            "total_users": total_users,
            "premium_users": premium_users,
            "stars_sold": stars_sold,
            "referrals": referrals_count,
        }
`
  },
  {
    name: "openai_gemini.py",
    path: "openai_gemini.py",
    language: "python",
    description: "يتصل بواجهة Google Gemini API مباشرة لتوليد النصوص، خطط العمل، ومقاطع الفيديو الترويجية باللغة العربية الفصحى.",
    content: `import urllib.request
import json
from config import GEMINI_API_KEY

class GeminiContentEngine:
    """أداة الاتصال المباشر بنموذج جيميني بدون الحاجة لمكتبات ضخمة لضمان خفة حجم التطبيق على الاستضافات المجانية."""
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.endpoint_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.api_key}"

    def generate(self, prompt: str, system_instruction: str = None) -> str:
        if not self.api_key:
            return "⚠️ مفتاح Gemini API مفقود. يجب على المسؤول إضافته في إعدادات البيئة لتفعيل الخدمة."
            
        payload = {
            "contents": {
                "parts": [
                    {"text": prompt}
                ]
            }
        }
        
        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }
            
        try:
            req = urllib.request.Request(
                self.endpoint_url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=15) as res:
                response_data = json.loads(res.read().decode("utf-8"))
                # Extract text safely from response candidates schema
                text = response_data["candidates"][0]["content"]["parts"][0]["text"]
                return text
        except Exception as e:
            return f"❌ AI Engine error during synthesis: {str(e)}"

    def compose_passive_income_guide(self, user_interest: str) -> str:
        prompt = f"Compose a detailed 3-step high-converting passive income side hustle strategy for: '{user_interest}'. Include an exact monetization structure and step 1 action items."
        instruction = "You are a multi-millionaire founder. Be precise, actionable, clear, and motivate immediate execution."
        return self.generate(prompt, instruction)

    def generate_viral_video_script(self, custom_topic: str) -> str:
        prompt = f"Draft a viral 15-second TikTok/Insta Reels script. Topic: '{custom_topic}'. Include visual layout directions [VIDEO ACTION] and exact copy designed for maximum retention."
        instruction = "Use bold hooks, snappy retention loops, and trending side hustle concepts with direct CTA to register for our tools."
        return self.generate(prompt, instruction)
`
  },
  {
    name: "handlers/start.py",
    path: "handlers/start.py",
    language: "python",
    description: "يدير عملية ترحيب وتسجيل المستخدمين، ويحسب مكافآت الإحالات الذكية وعرض إحصائيات حساب المستفيد باللغة العربية.",
    content: `from aiogram import Router, types
from aiogram.filters import CommandStart, Command
from aiogram.utils.keyboard import InlineKeyboardBuilder
from database import Database

router = Router()
db = Database()

@router.message(CommandStart())
async def process_start_command(message: types.Message):
    # تحقق مما إذا كان المستخدم قد دخل عبر رابط إحالة مخصص (مثال: /start ref_2138200)
    args = message.text.split()
    referred_by = None
    if len(args) > 1 and args[1].startswith("ref_"):
        try:
            referred_by = int(args[1].replace("ref_", ""))
        except ValueError:
            pass

    user_info = db.get_or_create_user(
        user_id=message.from_user.id,
        username=message.from_user.username,
        full_name=message.from_user.full_name,
        referred_by=referred_by
    )
    
    is_premium = user_info[4]
    free_credits = user_info[7]
    balance = user_info[6]

    kb = InlineKeyboardBuilder()
    kb.button(text="🚀 إنتاج خطة تسويقية", callback_data="btn_affiliate")
    kb.button(text="📸 مختبر الفيديوهات الفيروسية", callback_data="btn_viral_lab")
    kb.button(text="👑 ترقية إلى بريميوم مدى الحياة", callback_data="btn_premium_hub")
    kb.button(text="👥 شبكة الإحالة والعمولات", callback_data="btn_referral_stats")
    kb.adjust(1, 1, 2)

    welcome_msg = (
        f"👋 أهلاً بك في **بوت الذكاء الاصطناعي لصناعة المحتوى والدخل السلبي**، {message.from_user.full_name}!\\n\\n"
        f"💰 **إحصائيات حسابك وعمولاتك الحالية:**\\n"
        f"├ فئة اشتراكك: {'💎 بريميوم مدى الحياة' if is_premium else '🆓 الباقة المجانية'}\\n"
        f"├ رصيد النجوم الكلي: **{balance} نجمة ⭐**\\n"
        f"└ المحاولات المتبقية للتوليد: **{free_credits if not is_premium else '⚡ غير محدودة'} محاولة**\\n\\n"
        f"استخدم أدوات الذكاء الاصطناعي لإنشاء خطط دخل سلبي فورية ومربحة، وكتابة سيناريوهات الفيديوهات الفيروسية لصناعة انتشار أورجانيك هائل.\\n\\n"
        f"ℹ️ *للحصول على المساعدة وتفاصيل الأوامر، أرسل: /help*"
    )

    await message.reply(welcome_msg, parse_mode="Markdown", reply_markup=kb.as_markup())

@router.message(Command("help"))
async def process_help_command(message: types.Message):
    help_text = (
        "❓ **دليل المساعدة والدعم الفني للبوت**\\n\\n"
        "مرحباً بك! يعمل هذا البوت المتطور بالطاقة الكاملة لنموذج Gemini الرائد لمساعدتك على توليد العمولات وصناعة محتوى ترويجي استثنائي.\\n\\n"
        "📌 **الأوامر البرمجية المتاحة:**\\n"
        "🔹 /start - إعادة تهيئة الحساب، فتح لوحة التحكم الرئيسية وعرض الإحصائيات الحالية.\\n"
        "🔹 /help - عرض هذا الدليل الإرشادي المتكامل لمعرفة خيارات التشغيل ومميزات البوت.\\n\\n"
        "📊 **الأقسام والخدمات الذكية باللوحة:**\\n"
        "1️⃣ **إنتاج خطة تسويقية (🚀 Affiliate Engine)**: أدخل أي نوع منتج أو مجال وسيقوم الذكاء الاصطناعي ببناء خطة تسويقية مفصلة لك لجني العمولات.\\n"
        "2️⃣ **مختبر الفيديوهات الفيروسية (📸 Viral Lab)**: يكتب لك سيناريوهات فيديو احترافية مع خطافات بصرية وملاحظات تفصيلية لزيادة الانتشار الأورجانيك على تيك توك وريلز ومضاعفة أرباحك.\\n"
        "3️⃣ **عضوية بريميوم مدى الحياة (👑 VIP Lifetime)**: تمنحك استعلامات وتوليد غير محدود، وأولوية قصوى في معالجة طلباتك، ومضاعفة عمولتك لجميع الإحالات لتصل إلى 50%.\\n"
        "4️⃣ **شبكة الإحالة والعمولات (👥 Referrals)**: تتيح لك مشاركة رابط تتبع مخصص لك. تكسب 50 نجمة فورية عن كل عضو يسجل عن طريقك، بالإضافة إلى عمولتك المباشرة من ترقياتهم.\\n\\n"
        "💌 إذا واجهتك أي مشكلة، يرجى مراجعة ملف الإعداد لدعم خوادم التشغيل."
    )
    await message.reply(help_text, parse_mode="Markdown")

@router.callback_query(lambda c: c.data == "btn_start_menu")
async def back_to_start(callback_query: types.CallbackQuery):
    user_info = db.get_or_create_user(
        user_id=callback_query.from_user.id,
        username=callback_query.from_user.username,
        full_name=callback_query.from_user.full_name
    )
    is_premium = user_info[4]
    free_credits = user_info[7]
    balance = user_info[6]

    kb = InlineKeyboardBuilder()
    kb.button(text="🚀 إنتاج خطة تسويقية", callback_data="btn_affiliate")
    kb.button(text="📸 مختبر الفيديوهات الفيروسية", callback_data="btn_viral_lab")
    kb.button(text="👑 ترقية إلى بريميوم مدى الحياة", callback_data="btn_premium_hub")
    kb.button(text="👥 شبكة الإحالة والعمولات", callback_data="btn_referral_stats")
    kb.adjust(1, 1, 2)

    await callback_query.message.edit_text(
        f"💰 **لوحة التحكم المركزية للبوت المالي**\\n\\n"
        f"├ باقة العضوية: {'💎 بريميوم (محاولات لانهائية)' if is_premium else '🆓 حساب مجاني محدّد'}\\n"
        f"├ رصيد النجوم المتراكم: **{balance} نجمة ⭐**\\n"
        f"├ المحاولات المتاحة للتوليد اليوم: **{free_credits if not is_premium else '⚡ لانهائي'} محاولة**\\n\\n"
        f"اختر إحدى النوافذ بالأسفل لبدء التوليد التلقائي وزيادة مدخولات النجوم الخاصة بك:",
        parse_mode="Markdown",
        reply_markup=kb.as_markup()
    )
    await callback_query.answer()
`
  },
  {
    name: "handlers/monetization.py",
    path: "handlers/monetization.py",
    language: "python",
    description: "يتحكم في الوحدات المالية للترقيات، ويرسل فواتير نجوم تيليجرام للأرصدة ويقسم العمولات على المستحقين.",
    content: `from aiogram import Router, types, Bot
from aiogram.utils.keyboard import InlineKeyboardBuilder
from database import Database
from config import PREMIUM_PRICE_STARS, BOT_TOKEN

router = Router()
db = Database()

@router.callback_query(lambda c: c.data == "btn_premium_hub")
async def show_premium_hub(callback_query: types.CallbackQuery):
    user_id = callback_query.from_user.id
    user_info = db.get_or_create_user(user_id, callback_query.from_user.username, callback_query.from_user.full_name)
    is_premium = user_info[4]

    kb = InlineKeyboardBuilder()
    if is_premium:
        kb.button(text="✅ مفعّل بالفعل (عضوية VIP مميزة مدى الحياة)", callback_data="noop")
    else:
        # خيار الدفع مباشرة بنجوم تيليجرام
        kb.button(text=f"💳 شراء الترقية المميزة ({PREMIUM_PRICE_STARS} ⭐)", callback_data="pay_premium_stars")
    kb.button(text="🔙 العودة للوحة التحكم", callback_data="btn_start_menu")
    kb.adjust(1)

    premium_text = (
        "💎 **مزايا العضوية الفائقة المميزة مدى الحياة:**\\n\\n"
        "🟢 **توليد لانهائي بالذكاء الاصطناعي**: قم بإنشاء خطط تسويق وسيناريوهات إعلانية بلا حدود لمعرفتك ومشاريعك.\\n"
        "🟢 **خطط تسويق عالية الدخل**: احصل على وصول مباشر لحملات تسويقية سرية تحقق أكثر من 500$ يومياً.\\n"
        "🟢 **أولوية معالجة الطلبات**: استجابة فورية فائقة السرعة من نماذج الذكاء الاصطناعي المتطورة.\\n"
        "🟢 **مضاعفة عمولة الإحالة**: احصل على **50% عمولة كاملة** بدلاً من 25% من مدفوعات نجوم تيليجرام لجميع المشتركين من خلالك."
    )
    
    await callback_query.message.edit_text(premium_text, parse_mode="Markdown", reply_markup=kb.as_markup())
    await callback_query.answer()

@router.callback_query(lambda c: c.data == "pay_premium_stars")
async def send_invoice_stars(callback_query: types.CallbackQuery, bot: Bot):
    price = types.LabeledPrice(label="الترقية للعضوية الفائقة مدى الحياة", amount=PREMIUM_PRICE_STARS)
    
    await bot.send_invoice(
        chat_id=callback_query.from_user.id,
        title="العضوية المميزة مدى الحياة",
        description="افتح قدرات الذكاء الاصطناعي الكاملة، وحملات الأفلييت الحصرية ومضاعفات الأرباح في شبكتك على الفور.",
        payload=f"upgrade_premium_{callback_query.from_user.id}",
        provider_token="", # Leaves clean for native Telegram Stars (XTR)
        currency="XTR",   # Target Stars!
        prices=[price],
        start_parameter="premium-upgrade"
    )
    await callback_query.answer("تم إرسال الفاتورة بنجاح!")

# التثبت المسبق قبل إتمام الشراء
@router.pre_checkout_query()
async def process_pre_checkout(pre_checkout_query: types.PreCheckoutQuery):
    await pre_checkout_query.answer(ok=True)

# استلام عملية الدفع ومكافأة المرجع
@router.message(lambda m: m.successful_payment is not None)
async def complete_stars_payment(message: types.Message):
    payment_info = message.successful_payment
    payload = payment_info.invoice_payload
    
    if payload.startswith("upgrade_premium_"):
        user_id = int(payload.split("_")[2])
        db.upgrade_to_premium(user_id)
        
        # تدوين السجل في قاعدة السجلات المالية
        db._execute(
            "INSERT INTO payments_ledger (payment_id, user_id, amount_stars, purpose, timestamp) VALUES (?, ?, ?, ?, ?)",
            (payment_info.telegram_payment_charge_id, user_id, PREMIUM_PRICE_STARS, "premium_upgrade", datetime.utcnow().isoformat()),
            commit=True
        )
        
        await message.reply(
            "🎉 **مبارك الترقية الناجحة!** 🎉\\n\\n"
            "تم تفعيل باقة VIP المميزة مدى الحياة على حسابك فوراً. "
            "أنت تمتلك الآن استعلامات غير محدودة، ومعدل عمولتك ارتفع إلى 50% بشكل دائم لجميع الإحالات الحالية والمستقبلية!",
            parse_mode="Markdown"
        )
`
  },
  {
    name: "handlers/ai_generator.py",
    path: "handlers/ai_generator.py",
    language: "python",
    description: "ينظم استهلاك الفترات التجريبية للمستخدمين، ويتصل مباشرة بـ Gemini API لإنشاء خطط دخل ومقاطع ريلز أسطورية.",
    content: `from aiogram import Router, types
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.utils.keyboard import InlineKeyboardBuilder
from database import Database
from openai_gemini import GeminiContentEngine

router = Router()
db = Database()
ai_engine = GeminiContentEngine()

class AIWorkflowState(StatesGroup):
    waiting_for_niche = State()
    waiting_for_script_topic = State()

@router.callback_query(lambda c: c.data == "btn_affiliate")
async def ask_affiliate_niche(callback_query: types.CallbackQuery, state: FSMContext):
    # التثبت من الرصيد والحدود أولاً
    has_credits = db.deduct_usage(callback_query.from_user.id)
    if not has_credits:
        await callback_query.message.reply(
            "⚠️ **انتهت المحاولات المجانية اليومية!**\\n\\n"
            "لقد استنزفت محاولاتك الـ 5 المجانية لتوليد الخطط الذكية البوم. "
            "للحصول على معالجة سريعة وبلا حدود أو قيود، يرجى الترقية للعضوية المميزة مدى الحياة.",
            reply_markup=InlineKeyboardBuilder().button(text="👑 ترقية إلى بريميوم", callback_data="btn_premium_hub").as_markup()
        )
        await callback_query.answer()
        return

    await callback_query.message.edit_text(
        "💡 **خطوة مطلوبة:**\\n\\n"
        "اكتب المجال المالي أو المنتج الترويجي الذي تريد تحقيق ربح منه بالعمولة "
        "(مثال: *خدمات سحابية، تداول عملات، كتب وروايات مخصصة، قوالب وخدمات برمجية*):",
        parse_mode="Markdown"
    )
    await state.set_state(AIWorkflowState.waiting_for_niche)
    await callback_query.answer()

@router.message(AIWorkflowState.waiting_for_niche)
async def publish_affiliate_guide(message: types.Message, state: FSMContext):
    niche = message.text
    await message.reply("⏳ جاري توليد دليل العمل المالي بالذكاء الاصطناعي خلال 15 ثانية...")
    
    # استدعاء Gemini CONTENT ENGINE العربي
    result = ai_engine.compose_passive_income_guide(niche)
    
    kb = InlineKeyboardBuilder()
    kb.button(text="📸 إنشاء سيناريو فيديو فيروسي", callback_data="btn_viral_lab")
    kb.button(text="🔙 العودة للوحة التحكم", callback_data="btn_start_menu")
    kb.adjust(1)
    
    await message.reply(
        f"🏁 **خطة الدخل السلبي الموصى بها:**\\n\\n{result}",
        parse_mode="Markdown",
        reply_markup=kb.as_markup()
    )
    await state.clear()

@router.callback_query(lambda c: c.data == "btn_viral_lab")
async def ask_script_topic(callback_query: types.CallbackQuery, state: FSMContext):
    await callback_query.message.edit_text(
        "🎥 **مختبر صناعة الفيديوهات الفيروسية (TikTok / Reels / Shorts)**\\n\\n"
        "أدخل عنوان المقطع أو المنتج الذي تريد صناعة سيناريو يشد المتابعين إليه "
        "(مثال: *قوة التداول المؤتمت، كيف أربح 150 دولاراً يومياً عبر الإنترنت*):",
        parse_mode="Markdown"
    )
    await state.set_state(AIWorkflowState.waiting_for_script_topic)
    await callback_query.answer()

@router.message(AIWorkflowState.waiting_for_script_topic)
async def generate_script(message: types.Message, state: FSMContext):
    topic = message.text
    await message.reply("🔮 جاري ترقية الأفكار وهيكلة سيناريو الفيديو والخطافات البصرية...")
    
    script_output = ai_engine.generate_viral_video_script(topic)
    
    kb = InlineKeyboardBuilder()
    kb.button(text="⚡ جدولة النشر تلقائياً", callback_data="btn_auto_sched")
    kb.button(text="🔙 العودة للرئيسية", callback_data="btn_start_menu")
    kb.adjust(1)
    
    await message.reply(
        f"🔥 **سيناريو الفيديو عالي الموثوقية للتسويق المباشر:**\\n\\n{script_output}",
        parse_mode="Markdown",
        reply_markup=kb.as_markup()
    )
    await state.clear()
`
  },
  {
    name: "handlers/referral.py",
    path: "handlers/referral.py",
    language: "python",
    description: "يجمع بيانات الإحالات النشطة، ويولد روابط تتبع ذكية للمستخدمين باللغة العربية.",
    content: `from aiogram import Router, types
from aiogram.utils.keyboard import InlineKeyboardBuilder
from database import Database
from config import REFERRAL_BONUS_STARS, REFERRAL_PERCENT_COMMISSION

router = Router()
db = Database()

@router.callback_query(lambda c: c.data == "btn_referral_stats")
async def process_referrals_view(callback_query: types.CallbackQuery):
    user_id = callback_query.from_user.id
    
    # إنشاء رابط دعوة الإحالة الفيروسي الشخصي للمستخدم
    bot_info = await callback_query.bot.get_me()
    invite_link = f"https://t.me/{bot_info.username}?start=ref_{user_id}"
    
    # استعلام إحصائيات الشبكة
    user_info = db.get_or_create_user(user_id, callback_query.from_user.username, callback_query.from_user.full_name)
    balance = user_info[6]
    is_premium = user_info[4]
    
    referral_list = db._execute("SELECT COUNT(*) FROM referrals WHERE referrer_id = ?", (user_id,), fetch="one")
    referred_count = referral_list[0] if referral_list else 0

    commission_multiplier = 50 if is_premium else 25 # الحساب المميز ينال 50% عمولة كاملة

    kb = InlineKeyboardBuilder()
    kb.button(text="📤 مشاركة رابط الإحالة", switch_inline_query=f"ابدأ في كسب دخل سلبي مستمر بالنجوم وسحبه فوراً: {invite_link}")
    kb.button(text="🔙 العودة للرئيسية", callback_data="btn_start_menu")
    kb.adjust(1)

    ref_message = (
        "👥 **لوحة تحكم شبكة التسويق بالعمولة والشركاء**\\n\\n"
        "احصل على دخل متكرر حقيقي من خلال ترويج البوت ومشاركة رابطك. "
        "أي مستخدم يشترك أو يرقي حسابه من خلالك، سيمنحك فوراً عمولة بالنجوم مباشرة في رصيدك!\\n\\n"
        f"📌 **رابط الإحالة الخاص بك للتسويق المباشر:**\\n"
        f"\`{invite_link}\`\\n\\n"
        f"📊 **تحليلات العمولات والشبكة الحالية:**\\n"
        f"├ عدد الإحالات المسجلين بالكامل من خلالك: **{referred_count} مستخدم**\\n"
        f"├ عمولتك من ترقيات المشتركين: **{commission_multiplier}%**\\n"
        f"├ مكافأة التسجيل الفوري للمرجع الجديد: **+50 ⭐ نجمة**\\n"
        f"└ رصيد الأرباح المتراكم القابل للسحب الفوري: **{balance} نجمة ⭐**\\n\\n"
        "👉 *شارك رابطك المخصص على تيك توك، يوتيوب، أو مجموعات واتساب وتيليجرام للحصول على أرباح هائلة يومية! مقطع إعلاني واحد ناجح قد يجلب لك مئات المشتركين.*"
    )
    
    await callback_query.message.edit_text(ref_message, parse_mode="Markdown", reply_markup=kb.as_markup())
    await callback_query.answer()
`
  },
  {
    name: "bot.py",
    path: "bot.py",
    language: "python",
    description: "Main program entry point initializing aiogram modules, loading database dependencies, and running standard loops.",
    content: `import asyncio
import logging
from aiogram import Bot, Dispatcher
from config import BOT_TOKEN
from database import init_db
from handlers import start, monetization, ai_generator, referral

# Configure clean logging logs output
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

async def main():
    logger.info("🔧 Bootstrapping database engines...")
    # Initialize SQL Database schemas and WAL journal configurations
    init_db()

    logger.info("🤖 Starting Telegram AI Engine service...")
    
    # Setup Telegram Bot Client
    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher()

    # Include handler modules routers
    dp.include_router(start.router)
    dp.include_router(monetization.router)
    dp.include_router(ai_generator.router)
    dp.include_router(referral.router)

    # Clean buffer backlog and start pooling service
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("Bot Stopped successfully.")
`
  },
  {
    name: "Dockerfile",
    path: "Dockerfile",
    language: "dockerfile",
    description: "Ultra-lean standard python container blueprint with multi-stage layer caching for automatic Railway/Render deployment.",
    content: `FROM python:3.11-slim as builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential \\
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim as runner

WORKDIR /app

COPY --from=builder /root/.local /root/.local
COPY . .

ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

CMD ["python", "bot.py"]
`
  },
  {
    name: "requirements.txt",
    path: "requirements.txt",
    language: "json",
    description: "Specifies strict dependency versions to guarantee stable running behavior.",
    content: `aiogram>=3.3.0
python-dotenv>=1.0.0
# The native urllib.request doesn't require extra library modules, keeping the bot size tiny!
`
  },
  {
    name: "DEPLOY_GUIDE.md",
    path: "DEPLOY_GUIDE.md",
    language: "markdown",
    description: "لوحة تخطيط إطلاق البوت، تفعيل بوابات التجار لاستقبال النجوم، وصناعة انتشار فيروسي للنمو لـ 100$/يومياً.",
    content: `# 🚀 دليل الإطلاق البرمجي والتشغيل على خوادم مجانية (تحقيق دخل $100/يومياً بالنجوم)

هذا الدليل الاحترافي يوضح لك كيفية تهيئة الأكواد، وتثبيت البوت، وتفعيله على منصات استضافة مجانية بالكامل لعام 2026.

---

## 🛠️ الخطوة 1: استخراج مفاتيح الوصول والرموز السرية

1. **توكن بوت تيليجرام (Telegram API Token)**:
   * ابحث عن المعرّف الرسمي [@BotFather](https://t.me/BotFather) داخل تطبيق تيليجرام.
   * أرسل الأمر \`/newbot\` ثم اختر اسماً ومعرّفاً فريداً للبوت الخاص بك.
   * انسخ الرمز السري الناتج (مثل: \`8994906142:AAHrIA...\`) وضعه في ملف الـ \`.env\` كـ \`BOT_TOKEN\`.

2. **مفتاح Google Gemini API**:
   * ادخل إلى منصة Google AI Studio واستخرج مفتاح API مجاني تماماً لاستخدامه في الذكاء الاصطناعي العربي.
   * أضف هذا المفتاح كقيمة لـ \`GEMINI_API_KEY\` في ملفك البيئي.

3. **تفعيل نظام النجوم من تيليجرام (Stars Merchant)**:
   * من خلال محادثتك مع @BotFather، اختر بوتك ثم انتقل إلى **Bot Settings** > **Payments**.
   * قم بتفعيل خيار "Telegram Stars" لتلقي المدفوعات دون الحاجة إلى شركات وسيطة أو أوراق معقدة!

---

## 📦 الخطوة 2: تشغيل البوت على استضافة مجانية (Free Hosting)

للحصول على استضافة سحابية مجانية 100% وبدون قيود توقف، نوصي بالمنصات التالية:

### الخيار أ: منصة Koyeb (مجاني وسهل ومستقر)
1. قم بإنشاء حساب مجاني على [Koyeb.com](https://www.koyeb.com).
2. انقر على **Create Service** واختر **GitHub**.
3. قم بربط مستودع الكود الخاص بك (الذي يحتوي على الأكواد وملفات \`Dockerfile\` و \`requirements.txt\`).
4. اختر نوع التشغيل **Docker** (سيتم اكتشاف ملف \`Dockerfile\` تلقائياً لتوفير بيئة معزولة مذهلة).
5. انتقل إلى قسم **Environment Variables** وأضف المتغيرات التالية:
   * \`BOT_TOKEN\` = \`رمز_البوت_الخاص_بك\`
   * \`GEMINI_API_KEY\` = \`مفتاح_جيميني\`
   * \`ADMIN_IDS\` = \`معرف_حسابك_الخاص\` (مثال: \`2138200729\`)
6. انقر على **Deploy**. مبروك! البوت يعمل الآن 24/7 مجاناً.

### الخيار ب: منصة Render (استضافة مجانية دائمية)
1. أنشئ حساباً على [Render.com](https://render.com).
2. اختر **New** > **Web Service** أو **Background Worker**.
3. اربط حساب GitHub الخاص بك واطلع على مستودع البوت.
4. اختر البيئة **Docker** بدلاً من Python لتفادي مشاكل الحزم واختلاف الإصدارات.
5. أضف متغيرات البيئة الخاصة بك في نافذة **Environment** واضغط على Deploy.

---

## 📈 الخطوة 3: استراتيجية جلب المشتركين والنمو التلقائي لـ $100 يومياً

لا داعي لدفع أي مبالغ للإعلانات الممولة! اعتمد فقط على قوة الخوارزميات وصناعة الانتشار الأورجانيك الفيروسي:

1. **مفهوم الفيديوهات الفيروسية (TikTok/Reels/Shorts)**:
   * استخدم أداة **"مختبر الفيديوهات الفيروسية"** المدمجة لإنشاء نصوص مشوقة ومكثفة تفهم جمهور السوشيال ميديا العربي.
   * قم بعمل مقاطع بصرية تظهر الكود أو النجوم المتلقاة يومياً لجذب فضول المشاهدين.
2. **الخطاف وصناعة الرغبة**:
   * ابدأ مقطعك بـ: *"الجميع غافلون عن هذه الطريقة التي تمكن هذا البوت من جمع نجوم تيليجرام تلقائياً ويومياً..."*
3. **تحويل المشاهدة إلى دخل متكرر**:
   * ضع رابط إحالة البوت الفريد الخاص بك في البايو أو التعليق المثبت.
   * الحصول على 10 آلاف مشاهدة يحول عادةً إلى 500 مشترك نشط، وينتج عن ذلك تفعيل باقات مميزة بقيمة تزيد عن **150$ يومياً بمدفوعات فورية مباشرة**!
`
  }
];

import { SourceFile } from "../types";
import { BOT_SOURCE_CODE } from "./botSourceCode";

export interface BotTemplate {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  description: string;
  descriptionAr: string;
  files: SourceFile[];
}

export const BOT_TEMPLATES: BotTemplate[] = [
  {
    id: "all-in-one",
    name: "AI & Monetization Suite (All-In-One)",
    nameAr: "باقة الذكاء الاصطناعي وتحقيق الدخل الكاملة",
    icon: "Sparkles",
    description: "The complete implementation including affiliate referral tracking, Telegram Stars billing payments, interactive AI video & script generator engine, and task scheduler.",
    descriptionAr: "النسخة الكاملة وتتضمن تتبع الإحالات، ونظام دفع نجوم تيليجرام لتفعيل العضوية، ومولد المحتوى الذكي ونظام جدولة الفيديوهات.",
    files: BOT_SOURCE_CODE
  },
  {
    id: "simple-referral",
    name: "Simple Referral & Growth Bot",
    nameAr: "بوت الإحالات والانتشار البسيط",
    icon: "Users",
    description: "Lightweight referral marketing engine. Designed to build viral network loops, register referrals, allocate points tracking, and generate customized invite-only referral links.",
    descriptionAr: "محرك تتبع الإحالات البسيط. مصمم لبناء حلقات نمو فيروسية عبر منح نقاط لكل مستخدم جديد يسجل برابط إحالة فريد لتعظيم الانتشار.",
    files: [
      {
        name: "config.py",
        path: "config.py",
        language: "python",
        description: "Configuration settings for token inputs, SQLite schema path, and basic referral bonuses.",
        content: `import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

# Telegram Bot Token supplied by @BotFather
BOT_TOKEN = os.getenv("BOT_TOKEN", "8994906142:AAHrIArGfx01PMCDhk2-jL64X8j2gfrGMRM")

# Administrator Telegram IDs
ADMIN_IDS = [int(i.strip()) for i in os.getenv("ADMIN_IDS", "2138200729").split(",") if i.strip()]

# SQLite DB Path 
DB_PATH = os.getenv("DB_PATH", "referrals_database.db")

# Referral Bonus configured in virtual points/stars
REFERRAL_BONUS_STARS = 50
`
      },
      {
        name: "database.py",
        path: "database.py",
        language: "python",
        description: "متحكم قاعدة البيانات البسيط لتسجيل المستخدمين وعلاقات الإحالة المتشعبة.",
        content: `import sqlite3
import os
from datetime import datetime
from config import DB_PATH

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("PRAGMA journal_mode=WAL;")
    
    # Create simple Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        username TEXT,
        full_name TEXT,
        joined_at TEXT NOT NULL,
        referred_by INTEGER,
        stars_balance INTEGER DEFAULT 0
    );
    """)
    
    # Create Referral tracking connections
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
    conn.commit()
    conn.close()

def add_user_if_new(user_id, username, full_name, referrer_id=None):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT user_id FROM users WHERE user_id = ?", (user_id,))
    user = cursor.fetchone()
    
    if not user:
        joined_at = datetime.now().isoformat()
        cursor.execute(
            "INSERT INTO users (user_id, username, full_name, joined_at, referred_by) VALUES (?, ?, ?, ?, ?)",
            (user_id, username, full_name, joined_at, referrer_id)
        )
        # Allocate reward to the referrer if present
        if referrer_id and referrer_id != user_id:
            cursor.execute("UPDATE users SET stars_balance = stars_balance + 50 WHERE user_id = ?", (referrer_id,))
            cursor.execute(
                "INSERT INTO referrals (referred_id, referrer_id, earned_stars, rewarded_at) VALUES (?, ?, 50, ?)",
                (user_id, referrer_id, joined_at)
            )
        conn.commit()
        conn.close()
        return True
    conn.close()
    return False

def get_referral_stats(user_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM referrals WHERE referrer_id = ?", (user_id,))
    count = cursor.fetchone()[0]
    cursor.execute("SELECT stars_balance FROM users WHERE user_id = ?", (user_id,))
    balance = cursor.fetchone()[0] if cursor.fetchone() else 0
    conn.close()
    return count, balance
`
      },
      {
        name: "handlers/start.py",
        path: "handlers/start.py",
        language: "python",
        description: "Welcome trigger containing deep link args parsing to bind newly referred friends automatically.",
        content: `from aiogram import Router, F
from aiogram.types import Message
from aiogram.filters import CommandStart, Command
from database import add_user_if_new, get_referral_stats

router = Router()

@router.message(CommandStart())
async def cmd_start(message: Message):
    user_id = message.from_user.id
    username = message.from_user.username
    full_name = message.from_user.full_name
    
    # Extract referral deep link argument (e.g., /start ref_123456)
    args = message.text.split()
    referrer_id = None
    if len(args) > 1 and args[1].startswith("ref_"):
        try:
            referrer_id = int(args[1].replace("ref_", ""))
        except ValueError:
            pass

    # Ensure we don't allow self-referrals
    if referrer_id == user_id:
        referrer_id = None

    is_new = add_user_if_new(user_id, username, full_name, referrer_id)
    
    welcome_text = (
        f"👋 **أهلاً بك يا {full_name} في بوت الإحالات والانتشار البسيط!**\\n\\n"
        f"🎯 هذا البوت يوفر لك نظام إحالة متطور بالكامل لكسب النقاط مجاناً.\\n"
        f"مشاركتك تساعدنا على النمو وتكافئك أنت وأصدقائك بـ 50 نقطة ⭐ لكل مستخدم ينضم عبر رابطك!\\n\\n"
        f"استخدم الأوامر التالية للمتابعة:\\n"
        f"├ /referral - استخراج رابط إحالتك الفريد وإحصائيات شبكتك\\n"
        f"└ /profile - الاطلاع على بيانات حسابك والتحقق من المكافآت"
    )
    
    if is_new and referrer_id:
        welcome_text += f"\\n\\n💚 **رائع! لقد تم تسجيل انضمامك بنجاح من خلال إحالة صديقك ذو المعرف رقم: {referrer_id}!**"
        
    await message.answer(welcome_text, parse_mode="Markdown")
`
      },
      {
        name: "handlers/referral.py",
        path: "handlers/referral.py",
        language: "python",
        description: "Dynamically assembles personal invite references link for Telegram clients to forward widely.",
        content: `from aiogram import Router, F
from aiogram.types import Message
from aiogram.filters import Command
from database import get_referral_stats

router = Router()

@router.message(Command("referral"))
async def show_referrals(message: Message):
    user_id = message.from_user.id
    bot_info = await message.bot.get_me()
    
    # Generate custom referral link
    ref_link = f"https://t.me/{bot_info.username}?start=ref_{user_id}"
    referred_count, points = get_referral_stats(user_id)
    
    reply_text = (
        f"💸 **نظام الإحالة والانتشار التسويقي الفيروسي:**\n\n"
        f"إليك رابط دعوتك الفريد والمخصص لك:\n"
        f"\`{ref_link}\`\n\n"
        f"📊 **إحصائيات الإحالة الخاصة بك:**\n"
        f"├ الأصدقاء المدعوون: **{referred_count} مستخدمين**\\n"
        f"└ إجمالي رصيدك من النقاط: **{points} نقطة ⭐**\\n\\n"
        f"💡 انشر هذا الرابط في مجتمعات ريادية، أو على منصات تيك توك وريلز ومجموعات تواصلك لحصد مئات النقاط تلقائياً بكبسة زر!"
    )
    await message.answer(reply_text, parse_mode="Markdown")
`
      },
      {
        name: "bot.py",
        path: "bot.py",
        language: "python",
        description: "Application entry point registering setup handlers and starting active loops cleanly.",
        content: `import asyncio
import logging
from aiogram import Bot, Dispatcher
from config import BOT_TOKEN
from database import init_db
from handlers import start, referral

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

async def main():
    logger.info("Initializing sqlite structure and database system...")
    init_db()
    
    logger.info("Starting Simple Referral Bot polling...")
    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher()
    
    # Register core routers
    dp.include_router(start.router)
    dp.include_router(referral.router)
    
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("Service has been halted.")
`
      }
    ]
  },
  {
    id: "paid-content",
    name: "Paid Content & Stars Billing Bot",
    nameAr: "بوت المحتوى المأجور ودفع النجوم",
    icon: "Coins",
    description: "Robust digital monetization handler. Allows selling premium channel keys and premium materials using native Telegram Stars invoices with zero chargeback risk.",
    descriptionAr: "نظام توليد الأرباح الفوري. يدعم بيع اشتراكات VIP والمحتوى الرقمي المقفل عبر فواتير نجوم تيليجرام الرسمية لتجنب مخاطر رد المبالغ.",
    files: [
      {
        name: "config.py",
        path: "config.py",
        language: "python",
        description: "Monetization details including stars invoice prices and admin configurations.",
        content: `import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "8994906142:AAHrIArGfx01PMCDhk2-jL64X8j2gfrGMRM")
ADMIN_IDS = [int(i.strip()) for i in os.getenv("ADMIN_IDS", "2138200729").split(",") if i.strip()]
DB_PATH = os.getenv("DB_PATH", "monetization_database.db")

# Telegram Stars Unlock configuration prices
PREMIUM_PRICE_STARS = 250
PREMIUM_CHANNEL_LINK = "https://t.me/+UnlockPrivateExclusiveALGHealthChannel"
`
      },
      {
        name: "database.py",
        path: "database.py",
        language: "python",
        description: "SQLite billing system logging invoice transactions, customer flags, and payment histories.",
        content: `import sqlite3
import os
from datetime import datetime
from config import DB_PATH

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create simple Users Table with VIP flags
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        username TEXT,
        full_name TEXT,
        is_premium INTEGER DEFAULT 0,
        joined_at TEXT
    );
    """)
    
    # Create simple transactions ledger
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        tx_id TEXT PRIMARY KEY,
        user_id INTEGER,
        stars_paid INTEGER,
        status TEXT,
        timestamp TEXT
    );
    """)
    conn.commit()
    conn.close()

def upgrade_user_to_vip(user_id, tx_id, stars_paid):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET is_premium = 1 WHERE user_id = ?", (user_id,))
    cursor.execute(
        "INSERT INTO transactions (tx_id, user_id, stars_paid, status, timestamp) VALUES (?, ?, ?, 'COMPLETED', ?)",
        (tx_id, user_id, stars_paid, datetime.now().isoformat())
    )
    conn.commit()
    conn.close()

def check_vip_status(user_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT is_premium FROM users WHERE user_id = ?", (user_id,))
    res = cursor.fetchone()
    conn.close()
    return res[0] == 1 if res else False
`
      },
      {
        name: "handlers/monetization.py",
        path: "handlers/monetization.py",
        language: "python",
        description: "Processes pre-checkout query requests, serves invoice tokens, and unlocks VIP tokens on success.",
        content: `from aiogram import Router, F
from aiogram.types import Message, PreCheckoutQuery, ShippingQuery, LabeledPrice
from config import PREMIUM_PRICE_STARS, PREMIUM_CHANNEL_LINK
from database import upgrade_user_to_vip, check_vip_status

router = Router()

@router.message(F.text == "👑 ترقية لعضوية VIP" or F.text == "👑 Upgrade to VIP")
async def send_invoice_stars(message: Message):
    user_id = message.from_user.id
    
    if check_vip_status(user_id):
        await message.answer(
            f"🎉 **عضويتك بريميوم نشطة بالفعل مسبقاً!**\\n\\n🔗 اضغط على الرابط بالأسفل لدخول القناة السرية الخاصة:\\n{PREMIUM_CHANNEL_LINK}",
            parse_mode="Markdown"
        )
        return

    # Labeled Price elements list
    price = LabeledPrice(label="VIP Exclusive Group Access", amount=PREMIUM_PRICE_STARS)
    
    # Sending native invoice via Telegram Stars (XTR represents payment unit)
    await message.bot.send_invoice(
        chat_id=message.chat.id,
        title="👑 عضوية VIP المميزة للأبد",
        description="احصل على إمكانية الوصول مدى الحياة للقناة الخاصة، وتلقي تقارير ALGHealth التلقائية الحصرية ولقاءات الاستراتيجية الأسبوعية.",
        payload="exclusive_vip_upgrade_stars_pkg",
        provider_token="", # Leave empty for Telegram Stars
        currency="XTR",
        prices=[price],
        start_parameter="monetize_vip"
    )

@router.pre_checkout_query()
async def process_pre_checkout(pre_checkout_query: PreCheckoutQuery):
    # Mandatory checkout validation (approve payment transaction within 10 seconds lifespan)
    await pre_checkout_query.answer(ok=True)

@router.message(F.successful_payment)
async def successful_payment_received(message: Message):
    user_id = message.from_user.id
    payment_info = message.successful_payment
    
    # Save validation transaction to local database state
    upgrade_user_to_vip(
        user_id=user_id,
        tx_id=payment_info.telegram_payment_charge_id,
        stars_paid=payment_info.total_amount
    )
    
    thank_you_note = (
        f"🌟 **ألف مبروك! تم سداد قيمة اشتراكك ({payment_info.total_amount} نجمة ⭐) بنجاح رائع!**\\n\\n"
        f"أنت الآن ترتقي لعضوية VIP للمحترفين مدى الحياة.\\n\\n"
        f"🔗 تفضل بالدخول إلى القناة الحصرية فورا عبر هذا الرابط المميز المخصص:\\n"
        f"{PREMIUM_CHANNEL_LINK}"
    )
    await message.answer(thank_you_note, parse_mode="Markdown")
`
      },
      {
        name: "bot.py",
        path: "bot.py",
        language: "python",
        description: "Boots up the payment module, starts listening to active successful payments.",
        content: `import asyncio
import logging
from aiogram import Bot, Dispatcher
from config import BOT_TOKEN
from database import init_db
from handlers import monetization

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

async def main():
    logger.info("Configuring SQLite persistent transaction ledger...")
    init_db()
    
    logger.info("Launching Paid Content & Stars integration module...")
    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher()
    
    # Mount router containing SuccessfulPayment hooks
    dp.include_router(monetization.router)
    
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("Paid billing services paused.")
`
      }
    ]
  },
  {
    id: "ai-chat",
    name: "AI Chat & Gemini Assistance Bot",
    nameAr: "بوت دردشة ومستشار الذكاء الاصطناعي",
    icon: "Sparkles",
    description: "Conversational companion. Seamlessly hooks into the Gemini API without third-party libraries, offering smart interactive chat prompts and content generation.",
    descriptionAr: "بوت المحادثة الذكي والردود التفاعلية. يتكامل مع واجهة Gemini API وبدون مكاتب ثقيلة ليوفر للمشتركين إجابات حية وحملات تسويقية وتلقائية فائقة الدقة.",
    files: [
      {
        name: "config.py",
        path: "config.py",
        language: "python",
        description: "AI parameter setups, SQLite storage paths, and Gemini credentials.",
        content: `import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "8994906142:AAHrIArGfx01PMCDhk2-jL64X8j2gfrGMRM")
ADMIN_IDS = [int(i.strip()) for i in os.getenv("ADMIN_IDS", "2138200729").split(",") if i.strip()]
DB_PATH = os.getenv("DB_PATH", "ai_chat_database.db")

# Google Gemini API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
`
      },
      {
        name: "openai_gemini.py",
        path: "openai_gemini.py",
        language: "python",
        description: "Lightweight urllib parser to query the latest Gemini-2.5-flash model efficiently.",
        content: `import urllib.request
import json
from config import GEMINI_API_KEY

class GeminiContentEngine:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.endpoint_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.api_key}"

    def ask(self, prompt: str, history_context: str = "") -> str:
        if not self.api_key:
            return "⚠️ عذراً! لم يقم المسؤول بإضافة مفتاح Gemini API في إعدادات البوت حتى الآن."
            
        system_instruction = (
            "تمثل مساعد ومستشار ذكي لأرباح ALGHealth والدخل السلبي الرقمي. "
            "أجب المشترك باللغة العربية بأسلوب راقٍ واحترافي ملهم، مدعماً بالخطوات والشرح العملي."
        )
        
        full_text = f"{history_context}\\nUser: {prompt}" if history_context else prompt
        
        payload = {
            "contents": {
                "parts": [
                    {"text": full_text}
                ]
            },
            "systemInstruction": {
                "parts": [{"text": system_instruction}]
            }
        }
        
        try:
            req = urllib.request.Request(
                self.endpoint_url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=12) as res:
                response_data = json.loads(res.read().decode("utf-8"))
                text = response_data["candidates"][0]["content"]["parts"][0]["text"]
                return text
        except Exception as e:
            return f"❌ خطأ بسيط في معالجة الاستجابة البرمجية: {str(e)}"
`
      },
      {
        name: "handlers/ai_generator.py",
        path: "handlers/ai_generator.py",
        language: "python",
        description: "Catches custom users messages, processes thread contexts, and fires instant Gemini inquiries.",
        content: `from aiogram import Router, F
from aiogram.types import Message
from openai_gemini import GeminiContentEngine

router = Router()
ai_engine = GeminiContentEngine()

@router.message(F.text.startswith("/"))
async def skip_commands(message: Message):
    # Do not process command links as plain conversational inputs
    pass

@router.message()
async def process_chat_message(message: Message):
    user_prompt = message.text
    await message.bot.send_chat_action(chat_id=message.chat.id, action="typing")
    
    # Process inputs through our ultra lightweight urllib Gemini class
    reply = ai_engine.ask(prompt=user_prompt)
    
    await message.reply(reply, parse_mode="Markdown")
`
      },
      {
        name: "bot.py",
        path: "bot.py",
        language: "python",
        description: "Entry handler configuring conversational routers and initializing polling client.",
        content: `import asyncio
import logging
from aiogram import Bot, Dispatcher
from config import BOT_TOKEN
from handlers import ai_generator

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

async def main():
    logger.info("Initializing smart Gemini interactive parameters...")
    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher()
    
    # Register text messaging routing handler
    dp.include_router(ai_generator.router)
    
    logger.info("Aesthetic AI conversational service online! Waiting for requests...")
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("AI Service closed system.")
`
      }
    ]
  }
];

import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

# Telegram Bot Token supplied by @BotFather
BOT_TOKEN = os.getenv("BOT_TOKEN", "")

# Google Gemini API Key for on-demand viral text/video structures
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Administrator Telegram IDs (for visual stats, system commands)
ADMIN_IDS = [int(i.strip()) for i in os.getenv("ADMIN_IDS", "").split(",") if i.strip()]

# SQLite DB Path
DB_PATH = os.getenv("DB_PATH", "bot_database.db")

# Telegram Stars Provider Token (Leave empty for Telegram Stars digital payments which do not require general payment gateways)
PROVIDER_TOKEN = os.getenv("PROVIDER_TOKEN", "")

# Monetization settings
PREMIUM_PRICE_STARS = int(os.getenv("PREMIUM_PRICE_STARS", "250"))  # Upgrade lifetime premium
STAR_UNLOCK_COST = int(os.getenv("STAR_UNLOCK_COST", "50"))       # Mini AI product unlock fee

# Affiliate Commission rate for user referrals
REFERRAL_BONUS_STARS = 50
REFERRAL_PERCENT_COMMISSION = 0.25 # 25% on all premium stars payments

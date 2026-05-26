import asyncio
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

    # Clean buffer backlog and start polling service
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("Bot Stopped successfully.")

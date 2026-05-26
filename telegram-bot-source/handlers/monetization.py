from aiogram import Router, types, Bot
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
        "💎 **مزايا العضوية الفائقة المميزة مدى الحياة:**\n\n"
        "🟢 **توليد لانهائي بالذكاء الاصطناعي**: قم بإنشاء خطط تسويق وسيناريوهات إعلانية بلا حدود لمعرفتك ومشاريعك.\n"
        "🟢 **خطط تسويق عالية الدخل**: احصل على وصول مباشر لحملات تسويقية سرية تحقق أكثر من 500$ يومياً.\n"
        "🟢 **أولوية معالجة الطلبات**: استجابة فورية فائقة السرعة من نماذج الذكاء الاصطناعي المتطورة.\n"
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
            "🎉 **مبارك الترقية الناجحة!** 🎉\n\n"
            "تم تفعيل باقة VIP المميزة مدى الحياة على حسابك فوراً. "
            "أنت تمتلك الآن استعلامات غير محدودة، ومعدل عمولتك ارتفع إلى 50% بشكل دائم لجميع الإحالات الحالية والمستقبلية!",
            parse_mode="Markdown"
        )
pre_checkout_query = process_pre_checkout # Export for dispatcher

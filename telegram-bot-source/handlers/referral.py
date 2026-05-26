from aiogram import Router, types
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
    kb.button(text="🔙 العودة للرئيسية", callback_data="btn_start_menu")
    kb.adjust(1)

    ref_message = (
        "👥 **لوحة تحكم شبكة التسويق بالعمولة والشركاء**\n\n"
        "احصل على دخل متكرر حقيقي من خلال ترويج البوت ومشاركة رابطك. "
        "أي مستخدم يشترك أو يرقي حسابه من خلالك، سيمنحك فوراً عمولة بالنجوم مباشرة في رصيدك!\n\n"
        f"📌 **رابط الإحالة الخاص بك للتسويق المباشر:**\n"
        f"`{invite_link}`\n\n"
        f"📊 **تحليلات العمولات والشبكة الحالية:**\n"
        f"├ عدد الإحالات المسجلين بالكامل من خلالك: **{referred_count} مستخدم**\n"
        f"├ عمولتك من ترقيات المشتركين: **{commission_multiplier}%**\n"
        f"├ مكافأة التسجيل الفوري للمرجع الجديد: **+50 ⭐ نجمة**\n"
        f"└ رصيد الأرباح المتراكم القابل للسحب الفوري: **{balance} نجمة ⭐**\n\n"
        "👉 *شارك رابطك المخصص على تيك توك، يوتيوب، أو مجموعات واتساب وتيليجرام للحصول على أرباح هائلة يومية! مقطع إعلاني واحد ناجح قد يجلب لك مئات المشتركين.*"
    )
    
    await callback_query.message.edit_text(ref_message, parse_mode="Markdown", reply_markup=kb.as_markup())
    await callback_query.answer()

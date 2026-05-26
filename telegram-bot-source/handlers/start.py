from aiogram import Router, types
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
        f"👋 أهلاً بك في **بوت الذكاء الاصطناعي لصناعة المحتوى والدخل السلبي**، {message.from_user.full_name}!\n\n"
        f"💰 **إحصائيات حسابك وعمولاتك الحالية:**\n"
        f"├ فئة اشتراكك: {'💎 بريميوم مدى الحياة' if is_premium else '🆓 الباقة المجانية'}\n"
        f"├ رصيد النجوم الكلي: **{balance} نجمة ⭐**\n"
        f"└ المحاولات المتبقية للتوليد: **{free_credits if not is_premium else '⚡ غير محدودة'} محاولة**\n\n"
        f"استخدم أدوات الذكاء الاصطناعي لإنشاء خطط دخل سلبي فورية ومربحة، وكتابة سيناريوهات الفيديوهات الفيروسية لصناعة انتشار أورجانيك هائل.\n\n"
        f"ℹ️ *للحصول على المساعدة وتفاصيل الأوامر، أرسل: /help*"
    )

    await message.reply(welcome_msg, parse_mode="Markdown", reply_markup=kb.as_markup())

@router.message(Command("help"))
async def process_help_command(message: types.Message):
    help_text = (
        "❓ **دليل المساعدة والدعم الفني للبوت**\n\n"
        "مرحباً بك! يعمل هذا البوت المتطور بالطاقة الكاملة لنموذج Gemini الرائد لمساعدتك على توليد العمولات وصناعة محتوى ترويجي استثنائي.\n\n"
        "📌 **الأوامر البرمجية المتاحة:**\n"
        "🔹 /start - إعادة تهيئة الحساب، فتح لوحة التحكم الرئيسية وعرض الإحصائيات الحالية.\n"
        "🔹 /help - عرض هذا الدليل الإرشادي المتكامل لمعرفة خيارات التشغيل ومميزات البوت.\n\n"
        "📊 **الأقسام والخدمات الذكية باللوحة:**\n"
        "1️⃣ **إنتاج خطة تسويقية (🚀 Affiliate Engine)**: أدخل أي نوع منتج أو مجال وسيقوم الذكاء الاصطناعي ببناء خطة تسويقية مفصلة لك لجني العمولات.\n"
        "2️⃣ **مختبر الفيديوهات الفيروسية (📸 Viral Lab)**: يكتب لك سيناريوهات فيديو احترافية مع خطافات بصرية وملاحظات تفصيلية لزيادة الانتشار الأورجانيك ومضاعفة أرباحك.\n"
        "3️⃣ **عضوية بريميوم مدى الحياة (👑 VIP Lifetime)**: تمنحك استعلامات وتوليد غير محدود، وأولوية قصوى في معالجة طلباتك، ومضاعفة عمولتك لجميع الإحالات لتصل إلى 50%.\n"
        "4️⃣ **شبكة الإحالة والعمولات (👥 Referrals)**: تتيح لك مشاركة رابط تتبع مخصص لك. تكسب 50 نجمة فورية عن كل عضو يسجل عن طريقك، بالإضافة إلى عمولتك المباشرة من ترقياتهم.\n\n"
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
        f"💰 **لوحة التحكم المركزية للبوت المالي**\n\n"
        f"├ باقة العضوية: {'💎 بريميوم (محاولات لانهائية)' if is_premium else '🆓 حساب مجاني محدّد'}\n"
        f"├ رصيد النجوم المتراكم: **{balance} نجمة ⭐**\n"
        f"├ المحاولات المتاحة للتوليد اليوم: **{free_credits if not is_premium else '⚡ لانهائي'} محاولة**\n\n"
        f"اختر إحدى النوافذ بالأسفل لبدء التوليد التلقائي وزيادة مدخولات النجوم الخاصة بك:",
        parse_mode="Markdown",
        reply_markup=kb.as_markup()
    )
    await callback_query.answer()

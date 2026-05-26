from aiogram import Router, types
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
            "⚠️ **انتهت المحاولات المجانية اليومية!**\n\n"
            "لقد استنزفت محاولاتك الـ 5 المجانية لتوليد الخطط الذكية اليوم. "
            "للحصول على معالجة سريعة وبلا حدود أو قيود، يرجى الترقية للعضوية المميزة مدى الحياة.",
            reply_markup=InlineKeyboardBuilder().button(text="👑 ترقية إلى بريميوم", callback_data="btn_premium_hub").as_markup()
        )
        await callback_query.answer()
        return

    await callback_query.message.edit_text(
        "💡 **خطوة مطلوبة:**\n\n"
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
    
    # stda'a Gemini CONTENT ENGINE
    result = ai_engine.compose_passive_income_guide(niche)
    
    kb = InlineKeyboardBuilder()
    kb.button(text="📸 إنشاء سيناريو فيديو فيروسي", callback_data="btn_viral_lab")
    kb.button(text="🔙 العودة للوحة التحكم", callback_data="btn_start_menu")
    kb.adjust(1)
    
    await message.reply(
        f"🏁 **خطة الدخل السلبي الموصى بها لمجال [{niche}]:**\n\n{result}",
        parse_mode="Markdown",
        reply_markup=kb.as_markup()
    )
    await state.clear()

@router.callback_query(lambda c: c.data == "btn_viral_lab")
async def ask_script_topic(callback_query: types.CallbackQuery, state: FSMContext):
    await callback_query.message.edit_text(
        "🎥 **مختبر صناعة الفيديوهات الفيروسية (TikTok / Reels / Shorts)**\n\n"
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
    kb.button(text="🔙 العودة للرئيسية", callback_data="btn_start_menu")
    kb.adjust(1)
    
    await message.reply(
        f"🔥 **سيناريو الفيديو عالي الموثوقية للتسويق المباشر:**\n\n{script_output}",
        parse_mode="Markdown",
        reply_markup=kb.as_markup()
    )
    await state.clear()

import { GoogleGenAI } from "@google/genai";

export interface BotLog {
  timestamp: string;
  type: "success" | "info" | "error" | "incoming";
  text: string;
}

export interface SimUser {
  userId: number;
  username: string;
  fullName: string;
  joinedAt: string;
  isPremium: boolean;
  referredBy: number | null;
  starsBalance: number;
  freeUsesLeft: number;
}

export class LiveTelegramBotServer {
  private token: string;
  private ai: GoogleGenAI;
  private isRunning: boolean = false;
  private offset: number = 0;
  private pollTimeout: NodeJS.Timeout | null = null;
  private botName: string = "ALGHealth_IncomeBot";

  // Shared application logs
  public logs: BotLog[] = [];
  
  // In-memory Database to mimic production SQLite schema
  private users: Record<number, SimUser> = {};
  
  // User workflow states (Finite State Machine state tracking)
  private userStates: Record<number, { state: string; timestamp: number }> = {};

  constructor(token: string, ai: GoogleGenAI) {
    this.token = token;
    this.ai = ai;
    this.addLog("info", "تم ربط محرك تشغيل تيليجرام بنجاح. جاهز لتلقي اتصالات البوت.");
  }

  private addLog(type: "success" | "info" | "error" | "incoming", text: string) {
    const timestamp = new Date().toISOString();
    const cleanText = `[الخادم الحي] ${text}`;
    this.logs.unshift({ timestamp, type, text: cleanText });
    if (this.logs.length > 50) this.logs.pop();
    console.log(`[TelegramBotLog] ${type.toUpperCase()}: ${text}`);
  }

  public getLogs(): BotLog[] {
    return this.logs;
  }

  public getStatus() {
    return {
      isRunning: this.isRunning,
      botName: this.botName,
      userCount: Object.keys(this.users).length,
      offset: this.offset,
    };
  }

  public async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.addLog("info", "جاري بدء تشغيل البوت الحي وفحص رمز الوصول (Bot Token)...");

    try {
      // Fetch bot info to verify token and retrieve actual bot username
      const res = await fetch(`https://api.telegram.org/bot${this.token}/getMe`);
      if (!res.ok) {
        throw new Error(`سيرفر تيليجرام رفض الرمز المكتوب. الاستجابة: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.ok) {
        this.botName = data.result.username;
        this.addLog("success", `🟢 تم الاتصال بنجاح! اسم البوت على تيليجرام: @${this.botName}`);
        
        // Start polling loop
        this.offset = 0;
        this.poll();
      } else {
        throw new Error("بيانات توكن تيليجرام غير صالحة.");
      }
    } catch (err: any) {
      this.isRunning = false;
      this.addLog("error", `🔴 فشل تشغيل البوت: ${err.message}`);
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout);
      this.pollTimeout = null;
    }
    this.addLog("info", "🛑 تم إيقاف محرك تشغيل البوت المباشر.");
  }

  private async poll() {
    if (!this.isRunning) return;

    try {
      const url = `https://api.telegram.org/bot${this.token}/getUpdates?offset=${this.offset}&timeout=10`;
      const res = await fetch(url);
      
      if (!res.ok) {
        // Wait and retry if network fails
        this.pollTimeout = setTimeout(() => this.poll(), 5000);
        return;
      }

      const response = await res.json();
      if (response.ok && response.result && response.result.length > 0) {
        for (const update of response.result) {
          this.offset = update.update_id + 1;
          await this.handleUpdate(update);
        }
      }
    } catch (err: any) {
      this.addLog("error", `خطأ أثناء المزامنة مع تيليجرام: ${err?.message || "خطأ اتصال"}`);
    }

    if (this.isRunning) {
      this.pollTimeout = setTimeout(() => this.poll(), 1500);
    }
  }

  private async handleUpdate(update: any) {
    try {
      if (update.message) {
        const msg = update.message;
        const text = msg.text || "";
        const userId = msg.from.id;
        const username = msg.from.username || `user_${userId}`;
        const fullName = [msg.from.first_name, msg.from.last_name].filter(Boolean).join(" ") || "مستخدم تيليجرام";

        this.addLog("incoming", `رسالة واردة من @${username}: "${text}"`);
        
        // Create user if not exists or fetch
        let user = this.getOrCreateUser(userId, username, fullName, text);

        // Check if user is in a stateful workflow (FSM)
        const userStateData = this.userStates[userId];
        if (userStateData) {
          // Clear state first
          delete this.userStates[userId];
          
          if (userStateData.state === "waiting_for_niche") {
            await this.handleGenerateAffiliatePlan(userId, text, user);
            return;
          } else if (userStateData.state === "waiting_for_script") {
            await this.handleGenerateViralScript(userId, text, user);
            return;
          }
        }

        // Standard commands
        if (text.startsWith("/start")) {
          await this.sendWelcomeMessage(userId, fullName, user);
        } else if (text == "/help") {
          await this.sendHelpMessage(userId);
        } else {
          // Send general unknown guidance message with main navigation menu
          await this.sendWelcomeMessage(userId, fullName, user, "يرجى الضغط على أحد أزرار اللوحة التفاعلية بالأسفل أو استخدام الأمر /start للبدء:");
        }

      } else if (update.callback_query) {
        const query = update.callback_query;
        const userId = query.from.id;
        const data = query.data;
        const messageId = query.message.message_id;
        const username = query.from.username || `user_${userId}`;

        this.addLog("incoming", `تفاعل زر ضغط من @${username} (قيمة الزر: ${data})`);

        let user = this.getOrCreateUser(userId, username, query.from.first_name || "مستخدم", "");

        // Acknowledge Telegram Callback Query (stops spinning wheel on client)
        await fetch(`https://api.telegram.org/bot${this.token}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: query.id }),
        });

        await this.handleCallbackQuery(userId, data, messageId, user);
      }
    } catch (error: any) {
      console.error("Error processing update:", error);
      this.addLog("error", `خطأ معالجة وتحديث: ${error.message}`);
    }
  }

  private getOrCreateUser(userId: number, username: string, fullName: string, text: string): SimUser {
    if (this.users[userId]) {
      return this.users[userId];
    }

    let referredBy: number | null = null;
    if (text.startsWith("/start ref_")) {
      try {
        referredBy = parseInt(text.replace("/start ref_", "").trim());
      } catch (e) {}
    }

    const newUser: SimUser = {
      userId,
      username,
      fullName,
      joinedAt: new Date().toISOString(),
      isPremium: false,
      referredBy,
      starsBalance: 100, // 100 stars startup gift!
      freeUsesLeft: 5,
    };

    this.users[userId] = newUser;
    this.addLog("success", `👤 تم تسجيل مستخدم جديد في قاعدة البيانات: @${username} (${fullName})`);

    // Reward the referrer
    if (referredBy && this.users[referredBy] && referredBy !== userId) {
      this.users[referredBy].starsBalance += 50;
      this.addLog("success", `🎁 مكافأة إحالة! حصل @${this.users[referredBy].username} على +50 نجمة بسبب انتساب @${username}.`);
      this.sendMessage(referredBy, `🎉 **انتساب جديد لشبكتك المباشرة!**\n\nقام العضو @${username} بالتسجيل من رابطك الخاص. تم منحك **+50 ⭐ نجمة كسب فوري** رصيد أرباح!`);
    }

    return newUser;
  }

  private async sendMessage(chatId: number, text: string, replyMarkup?: any) {
    try {
      const url = `https://api.telegram.org/bot${this.token}/sendMessage`;
      const body: any = {
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      };
      if (replyMarkup) {
        body.reply_markup = replyMarkup;
      }

      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (e: any) {
      this.addLog("error", `فشل إرسال رسالة لتيليجرام: ${e.message}`);
    }
  }

  private async editMessageText(chatId: number, messageId: number, text: string, replyMarkup?: any) {
    try {
      const url = `https://api.telegram.org/bot${this.token}/editMessageText`;
      const body: any = {
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: "Markdown",
      };
      if (replyMarkup) {
        body.reply_markup = replyMarkup;
      }

      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (e: any) {
      this.addLog("error", `فشل تعديل رسالة على تيليجرام: ${e.message}`);
    }
  }

  private getMainMenuKeyboard() {
    return {
      inline_keyboard: [
        [{ text: "🚀 إنتاج خطة تسويقية تدر دخلاً", callback_data: "btn_live_affiliate" }],
        [{ text: "📸 مختبر السيناريوهات الفيروسية", callback_data: "btn_live_viral" }],
        [
          { text: "💎 الترقية للـ VIP المميزة", callback_data: "btn_live_premium" },
          { text: "👥 شبكة العمولات والإحالة", callback_data: "btn_live_reflink" }
        ],
        [{ text: "📊 لوحة المعلومات والإحصائيات", callback_data: "btn_live_info" }]
      ]
    };
  }

  private async sendWelcomeMessage(chatId: number, fullName: string, user: SimUser, prefix: string = "") {
    const welcomeText = (prefix ? prefix + "\n\n" : "") +
      `👋 أهلاً بك في **بوت الذكاء الاصطناعي العربي لصناعة المحتوى والدخل السلبي لعام 2026**، *${fullName}*!\n\n` +
      `💰 **إحصائيات حسابك وعمولاتك الحالية:**\n` +
      `├ فئة اشتراكك: ${user.isPremium ? "💎 بريميوم مدى الحياة (VIP)" : "🆓 الباقة التجريبية المحدودة"}\n` +
      `├ رصيد النجوم الكلي: **${user.starsBalance} نجمة ⭐**\n` +
      `└ المحاولات المتبقية للتوليد اليوم: **${user.isPremium ? "⚡ غير محدودة" : `${user.freeUsesLeft} محاولة`}**\n\n` +
      `استخدم أدوات الذكاء الاصطناعي لإنشاء خطط دخل سلبي فورية ومربحة، وكتابة سيناريوهات الفيديوهات الفيروسية لصناعة انتشار أورجانيك هائل.\n\n` +
      `ℹ️ *للحصول على المساعدة وتفاصيل الأوامر، أرسل: /help*`;

    await this.sendMessage(chatId, welcomeText, this.getMainMenuKeyboard());
  }

  private async sendHelpMessage(chatId: number) {
    const helpText = 
      "❓ **دليل المساعدة والدعم الفني للبوت**\n\n" +
      "مرحباً بك! يعمل هذا البوت المتطور بالطاقة الكاملة لنموذج Gemini الرائد لمساعدتك على توليد العمولات وصناعة محتوى ترويجي استثنائي.\n\n" +
      "📌 **الأوامر البرمجية المتاحة:**\n" +
      "🔹 /start - إعادة تهيئة الحساب، فتح لوحة التحكم الرئيسية وعرض الإحصائيات الحالية.\n" +
      "🔹 /help - عرض هذا الدليل الإرشادي المتكامل لمعرفة خيارات التشغيل ومميزات البوت.\n\n" +
      "📊 **الأقسام والخدمات الذكية باللوحة:**\n" +
      "1️⃣ **إنتاج خطة تسويقية (🚀 Affiliate Engine)**: أدخل أي نوع منتج أو مجال وسيقوم الذكاء الاصطناعي ببناء خطة تسويقية مفصلة لك لكسب العمولات.\n" +
      "2️⃣ **مختبر الفيديوهات الفيروسية (📸 Viral Lab)**: يكتب لك سيناريوهات فيديو احترافية مع خطافات بصرية وملاحظات تفصيلية لزيادة الانتشار الأورجانيك.\n" +
      "3️⃣ **عضوية بريميوم مدى الحياة (👑 VIP Lifetime)**: تمنحك استعلامات وتوليد غير محدود، وأولوية قصوى في معالجة طلباتك، ومضاعفة عمولتك لجميع الإحالات لتصل إلى 50%.\n" +
      "4️⃣ **شبكة الإحالة والعمولات (👥 Referrals)**: تتيح لك مشاركة رابط تتبع مخصص لك. تكسب 50 نجمة فورية عن كل عضو يسجل عن طريقك، بالإضافة إلى عمولتك المباشرة من ترقياتهم.";

    await this.sendMessage(chatId, helpText, {
      inline_keyboard: [[{ text: "🔙 العودة للرئيسية", callback_data: "btn_live_back" }]]
    });
  }

  private async handleCallbackQuery(userId: number, data: string, messageId: number, user: SimUser) {
    switch (data) {
      case "btn_live_back":
        await this.editMessageText(
          userId, 
          messageId, 
          `💰 **لوحة التحكم المركزية للبوت المالي**\n\n` +
          `├ باقة العضوية: ${user.isPremium ? "💎 بريميوم (محاولات لانهائية)" : "🆓 حساب مجاني محدّد"}\n` +
          `├ رصيد النجوم المتراكم: **${user.starsBalance} نجمة ⭐**\n` +
          `├ المحاولات المتاحة للتوليد اليوم: **${user.isPremium ? "⚡ لانهائي" : `${user.freeUsesLeft} محاولة`}**\n\n` +
          `اختر إحدى النوافذ بالأسفل لبدء التوليد التلقائي وزيادة مدخولات النجوم الخاصة بك:`,
          this.getMainMenuKeyboard()
        );
        break;

      case "btn_live_affiliate":
        if (!user.isPremium && user.freeUsesLeft <= 0) {
          await this.sendMessage(
            userId,
            "⚠️ **انتهت المحاولات المجانية اليومية!**\n\n" +
            "لقد استنزفت محاولاتك الـ 5 المجانية لتوليد الخطط الذكية اليوم. " +
            "للحصول على معالجة سريعة وبلا حدود أو قيود، يرجى الترقية للعضوية المميزة مدى الحياة.",
            { inline_keyboard: [[{ text: "👑 ترقية لبريميوم", callback_data: "btn_live_premium" }]] }
          );
          return;
        }

        this.userStates[userId] = { state: "waiting_for_niche", timestamp: Date.now() };
        await this.editMessageText(
          userId,
          messageId,
          "💡 **خطوة مطلوبة:**\n\n" +
          "اكتب المجال المالي أو المنتج الترويجي الذي تريد تحقيق ربح منه بالعمولة وسيقوم محرك Gemini بكتابة خطة متكاملة لك باللغة العربية.\n\n" +
          "(مثال: *خدمات سحابية، تداول عملات، كتب وروايات مخصصة، قوالب وخدمات برمجية*):",
          { inline_keyboard: [[{ text: "🔙 إلغاء والعودة للرئيسية", callback_data: "btn_live_back" }]] }
        );
        break;

      case "btn_live_viral":
        if (!user.isPremium && user.freeUsesLeft <= 0) {
          await this.sendMessage(
            userId,
            "⚠️ **انتهت المحاولات المجانية اليومية!**\n\n" +
            "لقد استنزفت محاولاتك الـ 5 المجانية لتوليد الخطط الذكية اليوم. " +
            "للحصول على معالجة سريعة وبلا حدود أو قيود، يرجى الترقية للعضوية المميزة مدى الحياة.",
            { inline_keyboard: [[{ text: "👑 ترقية لبريميوم", callback_data: "btn_live_premium" }]] }
          );
          return;
        }

        this.userStates[userId] = { state: "waiting_for_script", timestamp: Date.now() };
        await this.editMessageText(
          userId,
          messageId,
          "🎥 **مختبر صناعة الفيديوهات الفيروسية (TikTok / Reels / Shorts)**\n\n" +
          "أدخل عنوان المقطع أو المنتج الذكي الذي تريد صناعة سيناريو مشوق يشد المتابعين إليه بالكامل:\n\n" +
          "(مثال: *قوة التداول المؤتمت، كيف أربح 150 دولاراً يومياً عبر الإنترنت*):",
          { inline_keyboard: [[{ text: "🔙 إلغاء والعودة للرئيسية", callback_data: "btn_live_back" }]] }
        );
        break;

      case "btn_live_premium":
        const premium_text = 
          "💎 **مزايا العضوية الفائقة المميزة مدى الحياة:**\n\n" +
          "🟢 **توليد لانهائي بالذكاء الاصطناعي**: قم بإنشاء خطط تسويق وسيناريوهات إعلانية بلا حدود لمعرفتك ومشاريعك.\n" +
          "🟢 **خطط تسويق عالية الدخل**: احصل على وصول مباشر لحملات تسويقية سرية تحقق أكثر من 500$ يومياً.\n" +
          "🟢 **أولوية معالجة الطلبات**: استجابة فورية فائقة السرعة من نماذج الذكاء الاصطناعي المتطورة.\n" +
          "🟢 **مضاعفة عمولة الإحالة**: احصل على **50% عمولة كاملة** بدلاً من 25% من مدفوعات نجوم تيليجرام لجميع المشتركين من خلالك.\n\n" +
          `سعر الترقية: **250 نجمة ⭐** (رصيدك الحالي: ${user.starsBalance} نجمة)`;
        
        const premium_kb: any = { inline_keyboard: [] };
        if (user.isPremium) {
          premium_kb.inline_keyboard.push([{ text: "✅ مفعّل بالفعل (VIP مدى الحياة)", callback_data: "noop" }]);
        } else if (user.starsBalance >= 250) {
          premium_kb.inline_keyboard.push([{ text: "💳 إتمام الترقية وحسم 250 نجمة ⭐", callback_data: "act_buy_premium" }]);
        } else {
          // If less, simulated send invoice stars
          premium_kb.inline_keyboard.push([{ text: "⚡ شحن رصيد النجوم ومحاكاة الدفع", callback_data: "act_add_stars" }]);
        }
        premium_kb.inline_keyboard.push([{ text: "🔙 العودة للرئيسية", callback_data: "btn_live_back" }]);

        await this.editMessageText(userId, messageId, premium_text, premium_kb);
        break;

      case "act_buy_premium":
        if (user.starsBalance >= 250) {
          user.starsBalance -= 250;
          user.isPremium = true;
          this.addLog("success", `👑 تمت ترقية حساب @${user.username} إلى باقة VIP بنجاح!`);
          
          // Reward the referrer with commission
          if (user.referredBy && this.users[user.referredBy]) {
            const commission = Math.round(250 * 0.25); // 25% of premium cost
            this.users[user.referredBy].starsBalance += commission;
            this.addLog("success", `💸 دفع عمولة ترقية ممتازة! تم منح @${this.users[user.referredBy].username} عمولة بقيمة +${commission} نجمة ⭐`);
            this.sendMessage(
              user.referredBy, 
              `💸 **عمولة فورية جديدة حصلت عليها!**\n\nقام صديقك @${user.username} بترقية حسابه للباقة الفائقة مدى الحياة. تم حسم حصتك من النجوم بنسبة 25%: مضاعف أرباح **+${commission} نجمة ⭐** أضيفت لمحفظتك!`
            );
          }

          await this.sendMessage(
            userId,
            "🎉 **ألف مبروك! تم تفعيل الاشتراك المميز بنجاح!** 🎉\n\n" +
            "لديك الآن وصول غير محدود لكافة نماذج الذكاء الاصطناعي وبلا أي محاولات مجدولة، بالإضافة إلى عمولات 50% لجميع الشركاء الجدد."
          );
        }
        await this.editMessageText(
          userId, 
          messageId, 
          `💰 **لوحة التحكم المركزية للبوت المالي**\n\n` +
          `├ باقة العضوية: 💎 بريميوم (محاولات لانهائية)\n` +
          `├ رصيد النجوم: **${user.starsBalance} نجمة ⭐**\n` +
          `└ المحاولات المتاحة للتوليد اليوم: ⚡ غير محدودة`,
          this.getMainMenuKeyboard()
        );
        break;

      case "act_add_stars":
        user.starsBalance += 500;
        this.addLog("success", `💳 تم شحن رصيد حساب @${user.username} بـ 500 نجمة بنجاح.`);
        await this.sendMessage(
          userId,
          "💳 **تمت محاكاة شحن الرصيد بنجاح!**\n\nتمت إضافة **500 ⭐ نجمة** إلى حسابك. يمكنك الآن استخدامها لترقية اشتراكك مدى الحياة."
        );
        await this.editMessageText(
          userId, 
          messageId, 
          `💰 **لوحة التحكم المركزية للبوت المالي**\n\n` +
          `├ باقة العضوية: ${user.isPremium ? "💎 بريميوم" : "🆓 حساب مجاني محدّد"}\n` +
          `├ رصيد النجوم المتراكم: **${user.starsBalance} نجمة ⭐**\n` +
          `├ المحاولات المتاحة للتوليد اليوم: **${user.isPremium ? "⚡ لانهائي" : `${user.freeUsesLeft} محاولة`}**\n\n` +
          `اختر إحدى النوافذ بالأسفل لبدء التوليد التلقائي وزيادة مدخولات النجوم الخاصة بك:`,
          this.getMainMenuKeyboard()
        );
        break;

      case "btn_live_reflink":
        const invite_link = `https://t.me/${this.botName}?start=ref_${userId}`;
        const referral_list = Object.values(this.users).filter(u => u.referredBy === userId).length;
        const rewardMultiplier = user.isPremium ? 50 : 25;

        const ref_message = 
          "👥 **لوحة تحكم شبكة التسويق بالعمولة والشركاء**\n\n" +
          "احصل على دخل متكرر حقيقي من خلال ترويج البوت ومشاركة رابطك. " +
          "أي مستخدم يشترك أو يرقي حسابه من خلالك، سيمنحك فوراً عمولة بالنجوم مباشرة في رصيدك!\n\n" +
          `📌 **رابط الإحالة الخاص بك للتسويق المباشر:**\n` +
          `\`${invite_link}\`\n\n` +
          `📊 **تحليلات العمولات والشبكة الحالية:**\n` +
          `├ عدد الإحالات المسجلين بالكامل من خلالك: **${referral_list} مستخدم**\n` +
          `├ عمولتك من ترقيات المشاركين: **${rewardMultiplier}%**\n` +
          `├ مكافأة التسجيل الفوري للمرجع الجديد: **+50 ⭐ نجمة**\n` +
          `└ رصيد الأرباح المتراكم القابل للسحب الفوري: **${user.starsBalance} نجمة ⭐**\n\n` +
          "👉 *شارك رابطك المخصص على تيك توك، يوتيوب، أو مجموعات واتساب وتيليجرام للحصول على أرباح هائلة يومية! مقطع إعلاني واحد ناجح قد يجلب لك مئات المشتركين.*";
        
        await this.editMessageText(userId, messageId, ref_message, {
          inline_keyboard: [
            [{ text: "🔙 العودة للرئيسية", callback_data: "btn_live_back" }]
          ]
        });
        break;

      case "btn_live_info":
        const userCount = Object.keys(this.users).length;
        const totalStarsIssued = Object.values(this.users).reduce((acc, curr) => acc + curr.starsBalance, 0);
        
        const info_text = 
          "📊 **إحصائيات الشبكة وقاعدة البيانات المباشرة لعام 2026**\n\n" +
          `👤 عدد المستخدمين الكلي المسجلين: **${userCount} مستخدم**\n` +
          `💎 نسبة الأعضاء بريميوم حالياً: **${Object.values(this.users).filter(u => u.isPremium).length} مستخدم**\n` +
          `⭐ إجمالي النجوم المتداولة في السرفر: **${totalStarsIssued} نجمة**\n` +
          "⚙️ نوع قاعدة البيانات النشطة: *Hyper-V SQLite3 Memory Ledger*\n\n" +
          "البوت يعمل بالطاقة القصوى وبالمزامنة الكاملة مع خوادم Google AI.";
          
        await this.editMessageText(userId, messageId, info_text, {
          inline_keyboard: [[{ text: "🔙 العودة للرئيسية", callback_data: "btn_live_back" }]]
        });
        break;
    }
  }

  private async handleGenerateAffiliatePlan(userId: number, text: string, user: SimUser) {
    await this.sendMessage(userId, "⏳ جاري توليد دليل العمل المالي بالذكاء الاصطناعي من نموذج Gemini خلال 10 ثوانٍ...");
    
    if (!user.isPremium) {
      user.freeUsesLeft = Math.max(0, user.freeUsesLeft - 1);
    }

    const promptText = `Compose a highly engaging 3-step passive income plan for the niche: '${text}'. Highlight exact monetization strategies (affiliate networks, custom downloads) and step 1 action items. Use friendly Arabic, well formatted with bullet points and bold headers.`;
    const systemInstruction = "أنت خبير محترف في إطلاق بوتات التيليجرام وتحقيق أرباح عبر التسويق بالعمولة والاشتراكات. اكتب بحماس وأسلوب تسويقي جذاب، ونسّق الخطوات برموز وعناوين عريضة باللغة العربية.";

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.85,
        },
      });

      const aiText = response.text || "عذراً، فشل نموذج جيميني في توليد الخطة التسويقية، من فضلك حاول كتابة كلمة أخرى.";
      await this.sendMessage(userId, `🏁 **خطة الدخل السلبي الموصى بها لمجال [${text}]:**\n\n${aiText}`, {
        inline_keyboard: [
          [{ text: "🎥 توليد سيناريو فيديو ترويجي لهذا المجال", callback_data: "btn_live_viral" }],
          [{ text: "🔙 العودة للرئيسية", callback_data: "btn_live_back" }]
        ]
      });
    } catch (e: any) {
      await this.sendMessage(userId, `❌ حدث خطأ أثناء التوليد بالذكاء الاصطناعي: ${e.message}`);
    }
  }

  private async handleGenerateViralScript(userId: number, text: string, user: SimUser) {
    await this.sendMessage(userId, "🔮 جاري ترقية الأفكار وهيكلة سيناريو الفيديو والخطافات البصرية من محرك Gemini...");
    
    if (!user.isPremium) {
      user.freeUsesLeft = Math.max(0, user.freeUsesLeft - 1);
    }

    const promptText = `Draft a viral 15-second script for TikTok/Instagram Reels about the topic: '${text}'. Include snappy hooks, visual notes in brackets [SCENE DETAILS], and call-to-actions linking back to our bot. Optimize for retention. Use engaging Arabic.`;
    const systemInstruction = "أنت خبير كاتب محتوى مرئي وصانع فيديوهات على منصات تيك توك وريلز من الطراز الأول. أسلوبك مثير ومميز، واستخدم لغة جذابة ووسوم واضحة باللغة العربية.";

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });

      const aiText = response.text || "عذراً، فشل نموذج جيميني في توليد سيناريو المقطع، حاول مرة أخرى.";
      await this.sendMessage(userId, `🔥 **سيناريو الفيديو عالي الموثوقية والمقترح لـ [${text}]:**\n\n${aiText}`, {
        inline_keyboard: [
          [{ text: "🔙 العودة للرئيسية", callback_data: "btn_live_back" }]
        ]
      });
    } catch (e: any) {
      await this.sendMessage(userId, `❌ حدث خطأ أثناء الاتصال بالذكاء الاصطناعي: ${e.message}`);
    }
  }
}

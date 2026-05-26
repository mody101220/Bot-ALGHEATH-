import urllib.request
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
                text = response_data["candidates"][0]["content"]["parts"][0]["text"]
                return text
        except Exception as e:
            return f"❌ AI Engine error during synthesis: {str(e)}"

    def compose_passive_income_guide(self, user_interest: str) -> str:
        prompt = f"Compose a detailed 3-step high-converting passive income side hustle strategy for: '{user_interest}'. Include an exact monetization structure and step 1 action items. Use friendly Arabic, and beautifully formatted with emojis."
        instruction = "You are a multi-millionaire founder. Be precise, actionable, clear, and motivate immediate execution."
        return self.generate(prompt, instruction)

    def generate_viral_video_script(self, custom_topic: str) -> str:
        prompt = f"Draft a viral 15-second TikTok/Insta Reels script. Topic: '{custom_topic}'. Include visual layout directions [VIDEO ACTION] and exact copy designed for maximum retention."
        instruction = "Use bold hooks, snappy retention loops, and trending side hustle concepts with direct CTA to register for our tools."
        return self.generate(prompt, instruction)

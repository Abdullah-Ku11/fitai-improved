import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are FitAI, a friendly nutrition assistant.

LANGUAGE RULES (very important):
- If the user writes in Arabic, respond ENTIRELY in clean, natural Modern Standard Arabic.
- If the user writes in English, respond ENTIRELY in English.
- Never mix the two languages in one reply. Detect the language from the user's last message.

The user describes food they ate.

For ENGLISH replies, use EXACTLY this format (keep the line breaks):

Calories: xxx kcal
Protein: xx g
Carbs: xx g
Fat: xx g

Then ONE short explanation (1-2 lines max).

For ARABIC replies, use EXACTLY this format (keep the line breaks):

السعرات: xxx سعرة
البروتين: xx غ
الكربوهيدرات: xx غ
الدهون: xx غ

ثم سطر أو سطرين قصيرين كشرح.

Rules:
- Always estimate, even from short inputs. Never refuse.
- Numbers must be whole integers.
- If the input is not food, politely say so in 1 line (in the user's language) and ask for food.
- No extra headings, no markdown, no bullet points.`;

function isArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { reply: "Please send a message." },
        { status: 400 }
      );
    }

    // Use OpenAI if API key is configured, otherwise fall back to mock
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const openai = new OpenAI({ apiKey });
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          temperature: 0.3,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: message },
          ],
        });
        const reply = completion.choices[0]?.message?.content?.trim();
        if (reply) return NextResponse.json({ reply });
      } catch (err) {
        console.error("OpenAI error, falling back to mock:", err);
      }
    }

    // Mock fallback so the app still works without an API key
    return NextResponse.json({ reply: mockNutrition(message) });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { reply: "Sorry, something went wrong on the server." },
      { status: 500 }
    );
  }
}

/**
 * Lightweight rule-based nutrition estimator used when no API key is set.
 * Recognizes common foods in English & Arabic and sums estimated macros.
 * Not medical-grade — it's just enough to let the demo work offline.
 */
function mockNutrition(input: string): string {
  const arabic = isArabic(input);
  const text = input.toLowerCase();

  // Per-unit macro table (calories, protein, carbs, fat).
  // Includes English keys and common Arabic keys for the same food.
  const foods: Record<string, [number, number, number, number]> = {
    // proteins
    egg: [78, 6, 1, 5],
    eggs: [78, 6, 1, 5],
    "بيضة": [78, 6, 1, 5],
    "بيض": [78, 6, 1, 5],
    "بيضتان": [156, 12, 2, 10],
    chicken: [165, 31, 0, 4],
    "دجاج": [165, 31, 0, 4],
    beef: [250, 26, 0, 15],
    "لحم": [250, 26, 0, 15],
    "لحمة": [250, 26, 0, 15],
    salmon: [208, 20, 0, 13],
    "سلمون": [208, 20, 0, 13],
    tuna: [130, 28, 0, 1],
    "تونة": [130, 28, 0, 1],
    fish: [180, 25, 0, 8],
    "سمك": [180, 25, 0, 8],
    "سمكة": [180, 25, 0, 8],
    shrimp: [99, 24, 0, 1],
    "روبيان": [99, 24, 0, 1],
    "جمبري": [99, 24, 0, 1],
    tofu: [144, 17, 3, 9],
    "توفو": [144, 17, 3, 9],
    bacon: [43, 3, 0, 3],
    sausage: [210, 12, 2, 18],
    "سجق": [210, 12, 2, 18],
    "نقانق": [210, 12, 2, 18],
    steak: [271, 26, 0, 18],
    "ستيك": [271, 26, 0, 18],

    // carbs
    bread: [80, 3, 15, 1],
    toast: [80, 3, 15, 1],
    "خبز": [80, 3, 15, 1],
    "توست": [80, 3, 15, 1],
    rice: [200, 4, 45, 0],
    "أرز": [200, 4, 45, 0],
    "رز": [200, 4, 45, 0],
    pasta: [220, 8, 43, 1],
    "معكرونة": [220, 8, 43, 1],
    "مكرونة": [220, 8, 43, 1],
    pizza: [285, 12, 36, 10],
    "بيتزا": [285, 12, 36, 10],
    burger: [354, 17, 29, 17],
    "برغر": [354, 17, 29, 17],
    "برجر": [354, 17, 29, 17],
    sandwich: [300, 15, 35, 12],
    "ساندويش": [300, 15, 35, 12],
    "ساندويتش": [300, 15, 35, 12],
    oats: [150, 5, 27, 3],
    oatmeal: [150, 5, 27, 3],
    "شوفان": [150, 5, 27, 3],
    potato: [161, 4, 37, 0],
    "بطاطا": [161, 4, 37, 0],
    "بطاطس": [161, 4, 37, 0],
    fries: [365, 4, 48, 17],

    // fruits & veg
    salad: [120, 3, 11, 7],
    "سلطة": [120, 3, 11, 7],
    apple: [95, 0, 25, 0],
    "تفاحة": [95, 0, 25, 0],
    "تفاح": [95, 0, 25, 0],
    banana: [105, 1, 27, 0],
    "موزة": [105, 1, 27, 0],
    "موز": [105, 1, 27, 0],
    orange: [62, 1, 15, 0],
    "برتقالة": [62, 1, 15, 0],
    "برتقال": [62, 1, 15, 0],
    avocado: [240, 3, 12, 22],
    "أفوكادو": [240, 3, 12, 22],

    // dairy
    milk: [149, 8, 12, 8],
    "حليب": [149, 8, 12, 8],
    "لبن": [149, 8, 12, 8],
    yogurt: [100, 10, 12, 2],
    "زبادي": [100, 10, 12, 2],
    cheese: [113, 7, 1, 9],
    "جبن": [113, 7, 1, 9],
    "جبنة": [113, 7, 1, 9],
    butter: [102, 0, 0, 12],
    "زبدة": [102, 0, 0, 12],
    oil: [120, 0, 0, 14],
    "زيت": [120, 0, 0, 14],

    // drinks
    coffee: [2, 0, 0, 0],
    "قهوة": [2, 0, 0, 0],
    tea: [2, 0, 0, 0],
    "شاي": [2, 0, 0, 0],
    coke: [140, 0, 39, 0],
    soda: [140, 0, 39, 0],
    juice: [110, 1, 26, 0],
    "عصير": [110, 1, 26, 0],

    // snacks
    chocolate: [210, 2, 24, 13],
    "شوكولاتة": [210, 2, 24, 13],
    "شوكولا": [210, 2, 24, 13],
    cookie: [50, 1, 7, 2],
    cookies: [50, 1, 7, 2],
    "بسكويت": [50, 1, 7, 2],
    donut: [253, 4, 31, 14],
    "دونات": [253, 4, 31, 14],
    nuts: [170, 6, 5, 15],
    "مكسرات": [170, 6, 5, 15],
    almonds: [170, 6, 5, 15],
    "لوز": [170, 6, 5, 15],
    peanut: [190, 8, 6, 16],
    "فول_سوداني": [190, 8, 6, 16],
    pancake: [175, 5, 22, 7],
    pancakes: [175, 5, 22, 7],
    "بانكيك": [175, 5, 22, 7],
    waffle: [218, 6, 25, 11],
    "وافل": [218, 6, 25, 11],
    soup: [120, 6, 15, 4],
    "شوربة": [120, 6, 15, 4],
    "حساء": [120, 6, 15, 4],
  };

  // Map common Eastern Arabic numerals to ASCII so quantities work.
  const easternNumerals: Record<string, string> = {
    "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
    "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
  };
  const normalized = text.replace(/[٠-٩]/g, (d) => easternNumerals[d] ?? d);

  let cal = 0,
    pro = 0,
    carb = 0,
    fat = 0;
  const found: string[] = [];

  // Tokenize on common separators (keep Arabic letters)
  const tokens = normalized
    .split(/[\s,+&/]+|\band\b|\bو\b/)
    .filter(Boolean);

  for (let i = 0; i < tokens.length; i++) {
    // Keep letters (incl. Arabic) and digits
    const t = tokens[i].replace(/[^a-z0-9\u0600-\u06FF]/g, "");
    if (!t) continue;
    let qty = 1;
    const prev = tokens[i - 1]?.replace(/[^a-z0-9\u0600-\u06FF]/g, "");
    if (prev && /^\d+$/.test(prev)) qty = parseInt(prev, 10);
    if (foods[t]) {
      const [c, p, cb, f] = foods[t];
      cal += c * qty;
      pro += p * qty;
      carb += cb * qty;
      fat += f * qty;
      found.push(t);
    }
  }

  if (found.length === 0) {
    if (arabic) {
      return `السعرات: 250 سعرة
البروتين: 10 غ
الكربوهيدرات: 30 غ
الدهون: 8 غ
تقدير تقريبي — لم أتعرّف على الأطعمة بدقة. جرّب كتابة شيء مثل "بيضتان + شريحة خبز" للحصول على تحليل أوضح.`;
    }
    return `Calories: 250 kcal
Protein: 10 g
Carbs: 30 g
Fat: 8 g
Rough estimate — I couldn't recognize the specific items. Try listing foods like "2 eggs + 1 toast" for a better breakdown.`;
  }

  if (arabic) {
    return `السعرات: ${Math.round(cal)} سعرة
البروتين: ${Math.round(pro)} غ
الكربوهيدرات: ${Math.round(carb)} غ
الدهون: ${Math.round(fat)} غ
تقدير تقريبي بناءً على أحجام الحصص المعتادة.`;
  }

  return `Calories: ${Math.round(cal)} kcal
Protein: ${Math.round(pro)} g
Carbs: ${Math.round(carb)} g
Fat: ${Math.round(fat)} g
Estimated for: ${found.join(", ")}. Quick approximation based on typical serving sizes.`;
}

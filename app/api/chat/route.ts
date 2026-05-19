import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";



const SYSTEM_PROMPT = `
You are FitAI, an AI fitness and nutrition coach.

Your job is to:
- Help users lose fat, gain muscle, and improve fitness
- Calculate calories and macros
- Suggest meals and workout advice
- Help users stay consistent and motivated
- Answer clearly and briefly

LANGUAGE RULES:
- If the user writes in Arabic, respond entirely in Arabic.
- If the user writes in English, respond entirely in English.
- Never mix languages.

WHEN USERS MENTION FOOD:
- Estimate calories, protein, carbs, and fats
- Mention that values are approximate when needed

WHEN INFORMATION IS MISSING:
Ask for:
- weight
- height
- age
- gender
- fitness goal

STYLE:
- Short and practical responses
- Friendly and motivating
- Use bullet points when useful
- No long essays

IMPORTANT:
- Do not give dangerous medical advice
- Do not invent exact nutrition values if uncertain
`;

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { reply: "Please send a message." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          reply: isArabic(message)
            ? "لم يتم إعداد مفتاح Groq. يرجى تكوين GROQ_API_KEY لتفعيل المساعد التنفيذي."
            : "Groq API key is not configured. Please set GROQ_API_KEY to enable the executive assistant.",
        },
        { status: 503 }
      );
    }

    const groq = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json(
        {
          reply: isArabic(message)
            ? "لم أتمكن من توليد رد. حاول مرة أخرى."
            : "I couldn't generate a response. Please try again.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { reply: "Sorry, something went wrong on the server." },
      { status: 500 }
    );
  }
}

function isArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}
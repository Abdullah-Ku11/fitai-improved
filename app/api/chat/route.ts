import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const getSystemPrompt = (agent: string) => {
  if (agent === "Nutrition Agent") {
    return `
You are FitAI Nutrition Agent.

You specialize in:
- calories
- macros
- meal plans
- fat loss
- muscle gain
- healthy eating

LANGUAGE RULES:
- If the user writes in Arabic, respond ENTIRELY in clean Modern Standard Arabic.
- If the user writes in English, respond ENTIRELY in English.
- Never mix languages in one reply.

Reply clearly and briefly.
`;
  }

  if (agent === "Fitness Agent") {
    return `
You are FitAI Fitness Agent.

You specialize in:
- workouts
- exercises
- gym routines
- strength training
- cardio

LANGUAGE RULES:
- If the user writes in Arabic, respond ENTIRELY in clean Modern Standard Arabic.
- If the user writes in English, respond ENTIRELY in English.
- Never mix languages in one reply.

Reply clearly and briefly.
`;
  }

  if (agent === "Analytics Agent") {
    return `
You are FitAI Analytics Agent.

You specialize in:
- health analytics
- user progress
- calorie tracking
- dashboards
- insights

LANGUAGE RULES:
- If the user writes in Arabic, respond ENTIRELY in clean Modern Standard Arabic.
- If the user writes in English, respond ENTIRELY in English.
- Never mix languages in one reply.

Reply clearly and briefly.
`;
  }

  return `
You are FitAI Executive Agent.

You specialize in:
- leadership
- business decisions
- productivity
- executive summaries
- strategic recommendations

LANGUAGE RULES:
- If the user writes in Arabic, respond ENTIRELY in clean Modern Standard Arabic.
- If the user writes in English, respond ENTIRELY in English.
- Never mix languages in one reply.

Reply clearly and briefly.
`;
};

function isArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message: string = body.message;
    const history: ChatMessage[] = body.history || [];
    const agent: string = body.agent || "Nutrition Agent";

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { reply: "Please send a message." },
        { status: 400 }
      );
    }

    console.log("ENV:", process.env.GROQ_API_KEY);
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          reply: isArabic(message)
            ? "لم يتم إعداد مفتاح Groq. يرجى تكوين GROQ_API_KEY لتفعيل المساعد."
            : "Groq API key is not configured. Please set GROQ_API_KEY to enable the assistant.",
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
        {
          role: "system",
          content: getSystemPrompt(agent),
        },
        ...history.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        {
          role: "user",
          content: message,
        },
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
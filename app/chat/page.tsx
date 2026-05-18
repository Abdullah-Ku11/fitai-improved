"use client";

import { useEffect, useRef, useState, FormEvent } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

/** Returns true if the text contains Arabic script characters. */
function isArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm FitAI ✨\nTell me what you ate (e.g. \"2 eggs + 1 slice of bread\") and I'll break down the macros for you.\n\nمرحبًا! أنا FitAI ✨\nأخبرني بما تناولته (مثل: \"بيضتان + شريحة خبز\") وسأحسب لك السعرات والعناصر الغذائية.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            data.reply ??
            (isArabic(text)
              ? "عذرًا، حدث خطأ ما."
              : "Sorry, something went wrong."),
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: isArabic(text)
            ? "خطأ في الاتصال. حاول مرة أخرى."
            : "Network error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // The placeholder + footer follow whatever language the user is currently typing.
  const inputIsArabic = isArabic(input);

  return (
    <main className="flex flex-col h-screen">
      {/* Header */}
      <header className="glass border-0 border-b border-border px-4 py-3 flex items-center gap-3">
        <div className="relative">
        <img src="/fitai-logo.jpeg" alt="FitAI Logo" className="w-9 h-9 rounded-xl shadow-glow" />
        </div>
        <div>
          <h1 className="text-base font-semibold gradient-text leading-tight">
            FitAI
          </h1>
          <p className="text-[11px] text-gray-400">
            Your AI nutrition assistant · مساعد التغذية الذكي
          </p>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} content={m.content} />
          ))}
          {loading && <TypingIndicator />}
        </div>
      </div>

      {/* Input */}
      <div className="glass border-0 border-t border-border px-4 py-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto flex gap-2 items-end"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as FormEvent);
              }
            }}
            placeholder={
              inputIsArabic
                ? "ماذا تناولت؟ مثال: بيضتان + خبز"
                : "What did you eat? e.g. 2 eggs + bread"
            }
            dir={inputIsArabic ? "rtl" : "ltr"}
            rows={1}
            className="flex-1 resize-none bg-white/[0.03] border border-border rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/30 transition-all max-h-32 backdrop-blur"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label={inputIsArabic ? "إرسال" : "Send"}
            className="send-btn text-white font-medium rounded-2xl px-5 py-3 text-sm flex items-center gap-2"
          >
            <span>{inputIsArabic ? "إرسال" : "Send"}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={inputIsArabic ? "rotate-180" : ""}
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>
        <p className="text-[10px] text-gray-500 text-center mt-2">
          {inputIsArabic
            ? "قد تكون تقديرات FitAI الغذائية غير دقيقة."
            : "FitAI may produce inaccurate nutritional estimates."}
        </p>
      </div>
    </main>
  );
}

function MessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";
  const rtl = isArabic(content);

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl avatar-gradient flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-glow">
          F
        </div>
      )}
      <div
        dir={rtl ? "rtl" : "ltr"}
        className={
          isUser
            ? "max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed bg-accent-gradient text-white shadow-glow"
            : "max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed glass text-gray-100"
        }
      >
        {content}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-border flex-shrink-0 flex items-center justify-center text-white text-sm font-bold backdrop-blur">
          U
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 rounded-xl avatar-gradient flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-glow">
        F
      </div>
      <div className="glass rounded-2xl px-4 py-3 text-sm flex gap-1.5 items-center">
        <span className="dot w-2 h-2 bg-accent-purple rounded-full inline-block" />
        <span className="dot w-2 h-2 bg-accent rounded-full inline-block" />
        <span className="dot w-2 h-2 bg-accent-blue rounded-full inline-block" />
      </div>
    </div>
  );
}

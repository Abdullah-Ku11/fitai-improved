"use client";

import {
  useEffect,
  useRef,
  useState,
  FormEvent,
  RefObject,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type AgentName =
  | "Nutrition Agent"
  | "Fitness Agent"
  | "Analytics Agent"
  | "Executive Agent";

const AGENTS: AgentName[] = [
  "Nutrition Agent",
  "Fitness Agent",
  "Analytics Agent",
  "Executive Agent",
];

const STORAGE_KEY = "fitai-chat";

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm FitAI ✨\nYour AI nutrition and fitness assistant. Ask me anything about meals, macros, workouts, or healthy habits.\n\nمرحبًا! أنا FitAI ✨\nمساعدك الذكي للتغذية واللياقة. اسألني عن الوجبات، السعرات، التمارين، أو العادات الصحية.",
};

function isArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

function ChatPageContent() {
  const searchParams = useSearchParams();
  const agentFromUrl = searchParams.get("agent");
  const initialAgent: AgentName =
    agentFromUrl && AGENTS.includes(agentFromUrl as AgentName)
      ? (agentFromUrl as AgentName)
      : "Nutrition Agent";

  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [agent, setAgent] = useState<AgentName>(initialAgent);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore quota errors
    }
  }, [messages, hydrated]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  function handleNewChat() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setLoading(false);
  }

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
        body: JSON.stringify({
          message: text,
          history: messages,
          agent,
        }),
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

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        onNewChat={handleNewChat}
        messageCount={messages.length}
        agent={agent}
        setAgent={setAgent}
      />
      <MainChatArea
        messages={messages}
        input={input}
        setInput={setInput}
        loading={loading}
        scrollRef={scrollRef}
        handleSubmit={handleSubmit}
        agent={agent}
        setAgent={setAgent}
      />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-bg" />}>
      <ChatPageContent />
    </Suspense>
  );
}

function Sidebar({
  onNewChat,
  messageCount,
  agent,
  setAgent,
}: {
  onNewChat: () => void;
  messageCount: number;
  agent: AgentName;
  setAgent: (a: AgentName) => void;
}) {
  return (
    <aside className="hidden md:flex flex-col w-[280px] shrink-0 glass border-0 border-r border-border h-full">
      <div className="px-4 py-4 flex items-center gap-2.5 border-b border-border">
        <div className="w-8 h-8 rounded-lg avatar-gradient flex items-center justify-center text-white font-bold text-sm shadow-glow">
          F
        </div>
        <div>
          <div className="font-semibold text-white text-sm leading-tight">
            Fit<span className="gradient-text">AI</span>
          </div>
          <div className="text-[10px] text-gray-500">
            Nutrition &amp; Fitness Assistant
          </div>
        </div>
      </div>

      <div className="px-3 pt-3">
        <button
          type="button"
          onClick={onNewChat}
          className="btn-primary w-full text-white font-medium rounded-xl px-4 py-2.5 text-sm flex items-center justify-center gap-2"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      </div>

      <div className="px-3 pt-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 px-1 mb-2">
          Agents
        </div>
        <div className="flex flex-col gap-1.5">
          {AGENTS.map((a) => {
            const active = agent === a;
            return (
              <button
                key={a}
                type="button"
                onClick={() => setAgent(a)}
                className={`text-left text-xs rounded-lg px-3 py-2 border transition-all ${
                  active
                    ? "bg-accent-gradient text-white border-transparent shadow-glow"
                    : "glass border-border text-gray-300 hover:text-white"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 px-1 mb-2">
          Chats
        </div>
        <div className="glass rounded-xl p-3 border border-accent-purple/30 cursor-default">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-purple pulse-dot" />
            <div className="text-xs font-medium text-white">Current Chat</div>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {messageCount} {messageCount === 1 ? "message" : "messages"}
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            Active agent:{" "}
            <span className="text-accent-purple">{agent}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-border text-[10px] text-gray-500">
        © {new Date().getFullYear()} FitAI
      </div>
    </aside>
  );
}

function MainChatArea({
  messages,
  input,
  setInput,
  loading,
  scrollRef,
  handleSubmit,
  agent,
  setAgent,
}: {
  messages: Message[];
  input: string;
  setInput: (v: string) => void;
  loading: boolean;
  scrollRef: RefObject<HTMLDivElement>;
  handleSubmit: (e: FormEvent) => void;
  agent: AgentName;
  setAgent: (a: AgentName) => void;
}) {
  const inputIsArabic = isArabic(input);

  return (
    <main className="flex flex-col flex-1 h-full min-w-0">
      <header className="glass border-0 border-b border-border px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl avatar-gradient flex items-center justify-center text-white font-bold shadow-glow">
          F
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-semibold gradient-text leading-tight">
            FitAI
          </h1>
          <p className="text-[11px] text-gray-400 truncate">
            {agent} · مساعد التغذية واللياقة
          </p>
        </div>
      </header>

      {/* Agent selector bar */}
      <div className="border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-2 flex-wrap">
          {AGENTS.map((a) => {
            const active = agent === a;
            return (
              <button
                key={a}
                type="button"
                onClick={() => setAgent(a)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm border transition-all ${
                  active
                    ? "bg-accent-gradient text-white border-transparent shadow-glow"
                    : "glass border-border text-gray-300 hover:text-white"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} content={m.content} />
          ))}
          {loading && <TypingIndicator />}
        </div>
      </div>

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
                ? "اسأل عن وجباتك، تمارينك، أو أهدافك..."
                : "Ask about meals, workouts, or your goals..."
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
            ? "قد تحتوي ردود FitAI على معلومات تقديرية. استشر مختصًا عند الحاجة."
            : "FitAI may produce estimates. Consult a professional when needed."}
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
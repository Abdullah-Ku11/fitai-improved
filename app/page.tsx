import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <DashboardPreview />
      <CTA />
      <Footer />
    </main>
  );
}

/* ───────────────────────── Navbar ───────────────────────── */

function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 border-0 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/fitai-logo.jpeg" alt="FitAI Logo" className="w-8 h-8 rounded-lg shadow-glow" />
          <span className="font-semibold text-white tracking-tight">
            Fit<span className="gradient-text">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#dashboard" className="hover:text-white transition-colors">
            Dashboard
          </a>
          <a href="#cta" className="hover:text-white transition-colors">
            Get started
          </a>
        </div>

        <Link
          href="/chat"
          className="btn-primary text-white text-sm font-medium rounded-xl px-4 py-2"
        >
          Launch Assistant
        </Link>
      </div>
    </nav>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center relative">
        <div className="fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-gray-300 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-purple pulse-dot" />
          Powered by next-gen AI · Built for HealthTech
        </div>

        <h1 className="fade-up-delay-1 text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight max-w-4xl mx-auto">
          <span className="text-white">AI Executive Assistant for </span>
          <span className="gradient-text-bright">HealthTech Companies</span>
        </h1>

        <p className="fade-up-delay-2 mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Turn operational chaos into clarity. FitAI gives your leadership team
          an executive co-pilot that surfaces insights, tracks KPIs, and
          recommends actions — in real time.
        </p>

        <div className="fade-up-delay-3 mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/chat"
            className="btn-primary text-white font-medium rounded-xl px-6 py-3 text-sm w-full sm:w-auto flex items-center justify-center gap-2"
          >
            Launch Assistant
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
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <a
            href="#dashboard"
            className="btn-secondary text-white font-medium rounded-xl px-6 py-3 text-sm w-full sm:w-auto text-center"
          >
            View Dashboard
          </a>
        </div>

        {/* Stat strip */}
        <div className="fade-up-delay-4 mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
          {[
            { v: "10×", l: "Faster decisions" },
            { v: "24/7", l: "Always-on insights" },
            { v: "SOC 2", l: "Enterprise ready" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">
                {s.v}
              </div>
              <div className="text-xs text-gray-500 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Features ─────────────────────── */

const FEATURES = [
  {
    title: "AI Insights",
    desc: "Real-time analysis of operational, clinical, and financial signals. FitAI surfaces what matters before it lands in your inbox.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Analytics Dashboard",
    desc: "A single source of truth for every KPI — patient outcomes, retention, revenue, and team performance, beautifully visualized.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="3" y1="20" x2="21" y2="20" />
      </svg>
    ),
  },
  {
    title: "Smart Recommendations",
    desc: "Actionable next steps generated from your data. From staffing to product launches, FitAI tells you what to do — not just what happened.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2z" />
      </svg>
    ),
  },
];

function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-purple/80 mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Everything your <span className="gradient-text">leadership</span> needs
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            FitAI replaces dashboards, status meetings, and back-of-envelope analyses
            with one calm, intelligent assistant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="feature-card glass rounded-2xl p-6 sm:p-7"
            >
              <div className="w-11 h-11 rounded-xl avatar-gradient flex items-center justify-center text-white shadow-glow mb-5">
                <div className="w-5 h-5">{f.icon}</div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── Dashboard Preview ──────────────────── */

function DashboardPreview() {
  // Static "mock" dashboard built entirely in CSS — no images, no extra deps.
  const bars = [42, 68, 51, 79, 63, 88, 72, 95, 81, 90, 76, 92];
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

  return (
    <section id="dashboard" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-purple/80 mb-3">
            Dashboard preview
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Your operations, <span className="gradient-text">at a glance</span>
          </h2>
        </div>

        <div className="glass-strong rounded-3xl p-3 sm:p-5 shadow-[0_30px_80px_-20px_rgba(124,92,255,0.35)]">
          {/* Window chrome */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
            </div>
            <div className="text-[11px] text-gray-500 hidden sm:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
              fitai.app / dashboard
            </div>
            <span className="text-[11px] text-gray-500">v1.0</span>
          </div>

          {/* Dashboard body */}
          <div className="mt-2 rounded-2xl bg-black/40 p-4 sm:p-6 border border-border">
            {/* Top KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
  { label: "Active Patients", v: "12,438", d: "+8.2%" },
  { label: "Monthly Revenue", v: "$284k", d: "+14%" },
  { label: "AI Recommendations", v: "148", d: "+2.1%" },
  { label: "Staff Efficiency", v: "94%", d: "+11%" },
].map((k) => (
  <div
    key={k.label}
    className="glass rounded-xl p-3 sm:p-4"
  >
    <div className="text-[11px] text-gray-500">{k.label}</div>

    <div className="text-lg sm:text-xl font-semibold text-white mt-1">
      {k.v}
    </div>

    <div className="text-[11px] text-green-400 mt-1">
      {k.d}
    </div>
  </div>
))}
</div>
            {/* Chart + side panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              {/* Bar chart */}
              <div className="lg:col-span-2 glass rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-white font-medium">
                      Engagement trend
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Last 12 months
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-accent-blue" />
                    Active sessions
                  </div>
                </div>
                <div className="flex items-end gap-1.5 sm:gap-2 h-36 sm:h-44">
                  {bars.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1.5"
                    >
                      <div
                        className="w-full rounded-md bg-gradient-to-t from-blue-500 via-purple-500 to-pink-400"
                        style={{
                          height: `${h}%`,
                          minHeight: `${h}px`,
                          width: "100%",
                        }}
                      ></div>                     
                      <span className="text-[10px] text-gray-600">
                        {months[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI insights panel */}
              <div className="glass rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg avatar-gradient flex items-center justify-center text-white text-xs font-bold">
                    F
                  </div>
                  <div className="text-sm text-white font-medium">
                    AI insights
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    {
                      tag: "Opportunity",
                      text: "Patient onboarding drops 18% after step 3. Simplify the form.",
                    },
                    {
                      tag: "Alert",
                      text: "Support queue +34% this week — consider routing to Team B.",
                    },
                    {
                      tag: "Trend",
                      text: "Cohort April shows highest 90-day retention. Reuse the campaign.",
                    },
                  ].map((it) => (
                    <li
                      key={it.text}
                      className="flex gap-2.5 items-start text-[12.5px]"
                    >
                      <span className="mt-0.5 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider bg-accent-gradient-soft text-accent-purple border border-border whitespace-nowrap">
                        {it.tag}
                      </span>
                      <span className="text-gray-300 leading-relaxed">
                        {it.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── CTA ────────────────────────── */

function CTA() {
  return (
    <section id="cta" className="py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden glass-strong rounded-3xl p-8 sm:p-14 text-center">
          {/* CTA glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-accent-purple/30 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="text-white">Ready to give your team an </span>
              <span className="gradient-text-bright">AI executive partner?</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              Launch the assistant now — no setup, no signup. See what FitAI
              feels like in under 30 seconds.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/chat"
                className="btn-primary text-white font-medium rounded-xl px-6 py-3 text-sm w-full sm:w-auto"
              >
                Launch Assistant
              </Link>
              <a
                href="#dashboard"
                className="btn-secondary text-white font-medium rounded-xl px-6 py-3 text-sm w-full sm:w-auto"
              >
                View Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── Footer ────────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg avatar-gradient flex items-center justify-center text-white font-bold text-xs">
            F
          </div>
          <span className="text-gray-400">
            Fit<span className="gradient-text">AI</span>
          </span>
          <span className="text-gray-600">·</span>
          <span>AI Executive Assistant for HealthTech</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a>
          <Link href="/chat" className="hover:text-white transition-colors">Assistant</Link>
        </div>
        <div className="text-xs text-gray-600">
          © {new Date().getFullYear()} FitAI
        </div>
      </div>
    </footer>
  );
}

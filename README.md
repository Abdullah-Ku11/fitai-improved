# FitAI 🥗

A minimal ChatGPT-style nutrition chatbot. Tell it what you ate, get instant macros.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- OpenAI API (optional — falls back to a built-in mock estimator)

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Use OpenAI (optional)

```bash
cp .env.local.example .env.local
# Add your key to OPENAI_API_KEY
```

Without a key, the app uses a local rule-based estimator that handles common foods (eggs, bread, chicken, rice, pizza, etc.) — perfect for demos.

## Structure

```
app/
  page.tsx          # Chat UI (single page)
  layout.tsx        # Root layout
  globals.css       # Tailwind + tiny custom styles
  api/chat/route.ts # Single API route
```

That's it. One page, one API route.

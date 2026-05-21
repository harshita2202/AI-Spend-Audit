# SpendSense AI — Standalone React + JS

Free AI spend audit tool for startup founders. Built with plain JavaScript + React.

## Stack

- React 18
- Vite 5
- Tailwind CSS 3
- Wouter (routing)
- Lucide React (icons)
- No TypeScript · No complex monorepo setup

## Getting started

```bash
# 1. Install dependencies
npm install
# or: pnpm install

# 2. Start dev server
npm run dev
# or: pnpm dev

# Opens at http://localhost:5173
```

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── main.jsx          # Entry point
├── App.jsx           # Router
├── index.css         # Tailwind + custom utilities
├── lib/
│   └── mockData.js   # All tool configs + mock audit result
├── hooks/
│   └── useFormPersistence.js
├── components/
│   ├── Navbar.jsx
│   ├── ProgressBar.jsx
│   ├── ToolCard.jsx
│   ├── SavingsHero.jsx
│   ├── AuditResultCard.jsx
│   ├── EmailCaptureModal.jsx
│   ├── CredexCTA.jsx
│   └── ShareButtons.jsx
└── pages/
    ├── Landing.jsx
    ├── AuditForm.jsx
    ├── AuditResults.jsx
    └── SharedAudit.jsx
```

## Adding more tools

Edit `src/lib/mockData.js` — add an entry to the `TOOLS` array:

```js
{
  id: "my-tool",
  name: "My Tool",
  initials: "MT",
  color: "#123456",
  plans: [
    { label: "Free", pricePerSeat: 0 },
    { label: "Pro", pricePerSeat: 20 },
  ],
}
```

## Connecting a real backend

Search for `// TODO` comments in the codebase — each one marks a place where a real API call should replace the mock data.

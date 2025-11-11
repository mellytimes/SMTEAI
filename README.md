# Chat4Mind Studio

Chat4Mind Studio is a bilingual (TH/EN) React + Vite application that delivers a therapeutic-inspired chat experience. The project pairs a polished UI with server-driven AI responses, allowing visitors to journal moods, explore guided conversations, and review contributors.

## Tech Stack

- React 19 + Vite 5
- Tailwind utility classes & custom styling
- AOS (Animate on Scroll)
- Custom chat client fetching `/api/chat`
- ESLint + modern npm toolchain

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` (default Vite port).

## Environment Variables

Create a `.env` (or `.env.local`) and define:

```
VITE_GEMINI_API_KEY=your_google_gemini_key
VITE_CHAT_API_BASE_URL=https://api.example.com (optional)
VITE_CHAT_API_PATH=/api/chat (optional)
```

The chat client will call `/api/chat` relative to the frontend unless a base URL is supplied.

## Production Build

```bash
npm run build
npm run preview
```

The optimized bundle lands in `dist/`.

## Deploying

1. Build the frontend with `npm run build`.
2. Host the `dist/` directory on your static provider or have Express serve it.
3. Deploy the backend `/api/chat` endpoint (e.g., Express/Fly.io/Render) and set `VITE_CHAT_API_BASE_URL` accordingly.
4. Configure environment variables on the hosting platform.

## Contributors

- **MellyTimes** — Lead Developer
- **Memo** — Product Designer
- **JO** — AI Engineer

## License

MIT © 2025 MellyDevs

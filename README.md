# J.A.R.V.I.S.

A browser voice assistant with an Iron Man holographic interface. The React, Vite and Three.js interface remains the face and voice; a local Node bridge securely calls the **OpenAI Responses API** as the reasoning engine.

**JARVIS uses OpenAI, not Claude.** No Claude Code installation or Claude login is required. The OpenAI API key stays in the bridge process and is never exposed through a `VITE_*` browser variable.

## Requirements

- Node.js 20+
- Chrome or Edge in a real browser window (microphone and WebGL required)
- An OpenAI API key with API access
- Optional: Picovoice access key for the offline wake-word engine

## Quick start

```bash
npm install
```

Create `.env.local` in the project root:

```dotenv
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-6-astra
```

Then run:

```bash
npm start
```

Open the local URL printed by Vite (normally http://localhost:5173), click **INITIALISE**, allow microphone access, and say **“Hey Jarvis”**.

You can also run the two processes separately:

```bash
npm run bridge
npm run dev
```

## Architecture

```text
Browser (face + voice)                 Local Node bridge
┌─────────────────────────┐  WebSocket  ┌────────────────────────────┐
│ React / Three.js HUD    │◄───────────►│ OpenAI Responses API       │
│ Wake word + local VAD   │             │ Server-side API key        │
│ Speech + barge-in       │             │ Streaming + tool dispatch  │
│ Panels + reactor UI     │             │ Display / interface tools  │
└─────────────────────────┘             └────────────────────────────┘
```

- The bridge calls `https://api.openai.com/v1/responses`.
- Text deltas stream to the existing voice pipeline.
- Web search is provided by the Responses API web-search tool.
- Display and interface function calls update the existing holographic HUD.
- Conversation continuity is maintained with Responses API response IDs per WebSocket session.
- The bridge binds to loopback by default.

## Current tool support

The OpenAI bridge currently exposes web search, the JARVIS display, and interface controls (theme, reactor, chrome, effects, screen clear and reset).

**Migration boundary:** the previous Claude Agent SDK bridge also loaded local stdio MCP servers, Chrome-control tools, camera tools and other machine integrations. Those Claude-specific adapters are not silently treated as OpenAI tools. They need explicit OpenAI-compatible function/MCP adapters and permission tests before being re-enabled. This branch does not claim parity for those integrations yet.

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | required | Server-side OpenAI API key. Never prefix with `VITE_`. |
| `OPENAI_MODEL` | `gpt-6-astra` | OpenAI model used by the bridge. |
| `JARVIS_BRIDGE_PORT` | `8787` | Bridge HTTP/WebSocket port. |
| `JARVIS_BRIDGE_HOST` | `127.0.0.1` | Bind address; keep loopback for local use. |
| `JARVIS_ALLOWED_ORIGINS` | local dev origins | Additional trusted browser origins. |
| `VITE_PICOVOICE_ACCESS_KEY` | unset | Optional wake-word engine key. |
| `VITE_TTS_ENGINE` | `system` | Browser speech or Kokoro voice. |

Do not put the OpenAI API key in frontend variables, source code, commits, screenshots, or client-side storage.

## Scripts

- `npm start` — start the OpenAI bridge and Vite interface together.
- `npm run bridge` — start only the OpenAI bridge.
- `npm run dev` — start only the Vite interface.
- `npm run build` — TypeScript and production build.
- `npm test` — Node test suite.
- `npm run lint` — Oxlint.
- `npm run setup` — check Node and OpenAI configuration.

## Local and cloud deployment

This implementation is the **local** OpenAI-backed runtime. The API key is kept on the server and the bridge remains loopback-bound. A public cloud deployment needs an authenticated user/session layer, TLS, rate limiting, secret management and strict per-user isolation; do not expose port 8787 directly to the internet. Local computer actions should remain behind a separately authenticated local agent, not be granted to a cloud process by default.

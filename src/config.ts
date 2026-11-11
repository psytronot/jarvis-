/**
 * JARVIS frontend configuration.
 * All model credentials stay in the local Node bridge; browser bundles contain
 * no OpenAI, Anthropic, or third-party MCP bearer tokens.
 */
function str(raw: unknown): string | undefined {
  const value = typeof raw === 'string' ? raw.trim() : ''
  return value || undefined
}
function choice<T extends string>(name: string, raw: unknown, allowed: readonly T[], fallback: T): T {
  const value = str(raw)
  if (value && (allowed as readonly string[]).includes(value)) return value as T
  if (value) console.warn(`[jarvis] ${name}="${value}" is not supported; using "${fallback}".`)
  return fallback
}

/** OpenAI is the sole active model backend. */
export const BACKEND: 'bridge' | 'direct' = 'bridge'
export const BRIDGE_WS_URL = str(import.meta.env.VITE_BRIDGE_URL) ?? 'ws://localhost:8787'
export const BRIDGE_HTTP_URL = BRIDGE_WS_URL.replace(/^ws/, 'http')

/** ElevenLabs proxy endpoints are not enabled in the OpenAI bridge yet. */
export const USE_ELEVENLABS = false

export const TTS_ENGINE: 'kokoro' | 'system' = choice(
  'VITE_TTS_ENGINE', import.meta.env.VITE_TTS_ENGINE,
  ['kokoro', 'system'] as const, 'system',
)
export const KOKORO_VOICE = choice(
  'VITE_KOKORO_VOICE', import.meta.env.VITE_KOKORO_VOICE,
  ['bm_george', 'bm_fable', 'bm_lewis', 'bm_daniel'] as const, 'bm_george',
)

/** Only the optional wake-word key is browser-side; it is not an AI API secret. */
export const env = {
  porcupineKey: str(import.meta.env.VITE_PICOVOICE_ACCESS_KEY) ?? '',
  elevenKey: '',
  elevenVoiceId: 'JBFqnCBsd6RMkjVDRZzb',
}
export const WAKE_ENGINE: 'speech' | 'porcupine' = env.porcupineKey ? 'porcupine' : 'speech'

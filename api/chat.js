// /api/chat.js
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function callGemini({ apiKey, model, payload, signal }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })
  const data = await r.json().catch(() => ({}))
  return { ok: r.ok, status: r.status, data }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt, mood, mode, model = 'gemini-2.5-pro' } = req.body || {}
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'Missing GEMINI_API_KEY environment variable' })

    const clean = (s) => (s ?? '').toString().slice(0, 4000)
    let systemInstruction = ''
    if (mode === 'psychiatrist') systemInstruction = 'You are a compassionate therapist. who have a lots of experience in therapy and coaching. Do not diagnose or prescribe.'
    else if (mode === 'coach')   systemInstruction = 'You are a supportive coach. who have a lots of experience in coaching and therapy. No medical diagnosis.'
    else if (mode === 'listener') systemInstruction = 'You are an empathetic listener. to help the user express their feelings and thoughts.'

    const parts = [{ text: systemInstruction ? `${systemInstruction}\n\nUser: ${clean(prompt)}` : clean(prompt) }]
    if (mood || mode) parts.push({ text: `meta: mood=${mood ?? 'default'}, mode=${mode ?? 'default'}` })
    const payload = { contents: [{ role: 'user', parts }] }

    const retriable = new Set([503, 502, 429])
    const maxAttempts = 4
    let attempt = 0
    let currModel = model 

    let last
    while (attempt < maxAttempts) {
      // ใส่ timeout ต่อคำขอ (กันแขวน)
      const ac = new AbortController()
      const t = setTimeout(() => ac.abort(), 25000) // 25s
      try {
        last = await callGemini({ apiKey, model: currModel, payload, signal: ac.signal })
      } finally {
        clearTimeout(t)
      }

      if (last.ok) break
      if (!retriable.has(last.status)) break

      // ลอง fallback เป็นรุ่นเร็วขึ้นหลังพยายาม 2 ครั้ง
      if (attempt === 1 && currModel === 'gemini-2.5-pro') {
        currModel = 'gemini-2.5-flash'
      }

      const delay = Math.floor(300 * Math.pow(2, attempt) + Math.random() * 200)
      await sleep(delay)
      attempt++
    }

    const status = last?.ok ? 200 : (last?.status ?? 500)
    return res.status(status).json(last?.data ?? { error: 'Unknown error' })

  } catch (err) {
    console.error('[api/chat] Fatal error:', err)
    return res.status(500).json({ error: 'Server error', detail: String(err) })
  }
}

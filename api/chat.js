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
    if (mode === 'psychiatrist') {
      systemInstruction = `
    You are a compassionate, highly experienced therapist who blends principles of psychotherapy, emotional intelligence, and human empathy.
    Your primary goal is to **help users process emotions, reflect on their experiences, and discover healthier perspectives** — not to diagnose or prescribe any medical treatment.
    
    Your style is:
    - Calm, safe, and professional, as if you were speaking in a peaceful therapy room.
    - Emotionally validating — you acknowledge feelings before offering insight.
    - Deeply empathetic — you try to understand the emotion *behind* the words.
    
    Guidelines:
    1. Avoid any medical or clinical diagnosis (e.g., depression, anxiety, trauma, ADHD).
    2. Ask **gentle, open-ended questions** like “What do you think makes you feel that way?” or “Can you tell me more about that moment?”
    3. Offer **supportive reflections**, such as “It sounds like you felt unseen,” or “That must have been difficult for you.”
    4. Avoid generic positivity; instead, encourage **authentic self-compassion and reflection.**
    5. You may use metaphors, mindfulness principles, or short psychological insights to help users gain perspective.
    6. Never make assumptions about medical history, medications, or physical health.
    7. Stay calm, slow-paced, and nurturing — tone matters more than quantity.
    
    Example tone:
    > “I can sense how painful that must have been for you. Sometimes we carry emotions quietly for a long time before we notice how heavy they are.”`;
    }
    
    else if (mode === 'coach') {
      systemInstruction = `
    You are a skilled and motivational life coach who also understands emotional depth and psychology, but you do **not** diagnose or treat mental illness.
    Your goal is to help users build clarity, confidence, and action plans toward their goals while maintaining warmth and realism.
    
    Your coaching style:
    - Encouraging but honest — you challenge gently, never harshly.
    - You balance emotional validation with **forward movement**.
    - You celebrate small wins and help users learn from setbacks without shame.
    
    Guidelines:
    1. Use empowering, constructive language (e.g., “You can start small — what’s one step you could take today?”).
    2. Avoid medical framing or diagnostic terms.
    3. Focus on **growth, self-improvement, purpose, and mindset**.
    4. Help users articulate goals, break them into steps, and explore inner motivation.
    5. Recognize resistance or fear with empathy, not pressure.
    6. Occasionally summarize the user’s progress to help them reflect (“You’ve already realized X and are working on Y — that’s growth.”).
    7. Keep the tone positive but grounded — never toxic positivity.
    
    Example tone:
    > “It sounds like you’re ready to take control of your situation, even if it feels scary right now. Growth often begins in uncertainty.”`;
    }
    
    else if (mode === 'listener') {
      systemInstruction = `
    You are an empathetic, nonjudgmental listener whose role is to provide a **safe conversational space** for the user to express emotions, memories, and thoughts freely.
    You don’t give advice unless the user explicitly asks — your goal is to **understand, validate, and accompany** the user.
    
    Your listening style:
    - Gentle and curious.
    - Emotionally reflective (“It sounds like you were hoping for understanding but didn’t get it.”).
    - Never dismissive, never overly analytical.
    
    Guidelines:
    1. Let silence or pauses “exist” — avoid rushing the user’s expression.
    2. Ask gentle reflection prompts (“What was that like for you?” / “How long have you felt that way?”).
    3. Focus entirely on **emotional presence**, not solutions.
    4. Avoid moral judgments or redirections.
    5. Never mention diagnoses or medical advice.
    
    Example tone:
    > “I’m here with you. Take your time — it’s okay to let it out. What’s been on your mind lately?”`;
    }
    else if (mode === 'Goofy') systemInstruction = 'You are a aggessive to anyone talking to him whatever user sent he will answer with an upset and anger tone and ragebait them'

    
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

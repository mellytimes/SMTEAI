export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).json({ error: 'Method not allowed' })
    }
  
    try {
      const { prompt, mood, mode, model = 'gemini-2.5-pro' } = req.body || {}
      const apiKey = process.env.GEMINI_API_KEY
      if (!apiKey) {
        return res.status(500).json({ error: 'Missing GEMINI_API_KEY environment variable' })
      }
  
      let systemInstruction = ''
      if (mode === 'psychiatrist') {
        systemInstruction = 'You are a compassionate, professional therapist...'
      } else if (mode === 'coach') {
        systemInstruction = 'You are a compassionate, professional coach...'
      } else if (mode === 'listener') {
        systemInstruction = 'You are a compassionate, professional listener...'
      }
  
      const fullPrompt = systemInstruction
        ? `${systemInstruction}\n\nUser Message: ${prompt}`
        : prompt
  
      const parts = [{ text: fullPrompt }]
      if (mood || mode) {
        const meta = [`mood: ${mood ?? 'default'}`, `mode: ${mode ?? 'default'}`]
        parts.push({ text: `\n\nMetadata Context:\n${meta.join('\n')}` })
      }
  
      const payload = { contents: [{ role: 'user', parts }] }
  
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
  
      const data = await response.json().catch(() => ({}))
      return res.status(response.ok ? 200 : response.status).json(data)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Server error', detail: String(err) })
    }
  }
  
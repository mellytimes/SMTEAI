// chatClient.js

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-2.5-flash'

export async function sendChatMessage({ prompt, mood, mode }) {
    try {
        if (!GEMINI_API_KEY) {
            throw new Error('Missing VITE_GEMINI_API_KEY environment variable')
        }
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
            GEMINI_MODEL,
        )}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`

        
        let systemInstruction = '';
        if (mode === 'psychiatrist') {
            systemInstruction = 
                'You are a compassionate, professional therapist and listener. Your primary goal is to provide **empathetic support**, ask open-ended, probing questions, and offer constructive, non-judgemental perspectives based on established psychological principles. **STRICTLY DO NOT** diagnose medical conditions or prescribe medication. Keep your tone gentle and professional.';
        } else if (mode === 'coach') {
            systemInstruction = 
                'You are a compassionate, professional coach and listener. Your primary goal is to provide **empathetic support**, ask open-ended, probing questions, and offer constructive, non-judgemental perspectives based on established psychological principles. **STRICTLY DO NOT** diagnose medical conditions or prescribe medication. Keep your tone gentle and professional.';
        } else if (mode === 'listener') {
            systemInstruction = 
                'You are a compassionate, professional listener. Your primary goal is to provide **empathetic support**, ask open-ended, probing questions, and offer constructive, non-judgemental perspectives based on established psychological principles. **STRICTLY DO NOT** diagnose medical conditions or prescribe medication. Keep your tone gentle and professional.';
        }
        const fullPrompt = systemInstruction ? `${systemInstruction}\n\nUser Message: ${prompt}` : prompt;
        
        const parts = [{ text: fullPrompt }];
        
        if (mood || mode) {
            const meta = [`mood: ${mood ?? 'default'}`, `mode: ${mode ?? 'default'}`];
            parts.push({
                text: `\n\nMetadata Context:\n${meta.join('\n')}`,
            });
        }
        

        const payload = {
            contents: [
                {
                    role: 'user',
                    parts,
                },
            ],
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(
                `Chat API error (${response.status}): ${errorText || 'Unknown error'}`,
            )
        }

        const data = await response.json()
        const text =
            data?.candidates?.[0]?.content?.parts
                ?.map((part) => part.text)
                .join('')
                ?.trim() ?? null

        return {
            raw: data,
            text,
        }
    } catch (err) {
        console.error('Error in sendChatMessage:', err) // Log for debugging
        throw err 
    }
}
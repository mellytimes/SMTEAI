export async function sendChatMessage({ prompt, mood, mode }) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, mood, mode }),
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
  
      return { raw: data, text }
    } catch (err) {
      console.error('Error in sendChatMessage:', err)
      throw err
    }
  }
  
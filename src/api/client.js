const parseBody = async (res) => {
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) {
      try { return await res.json() } catch { return { error: 'Invalid JSON' } }
    }
    const text = await res.text()
    return { error: text || 'Unknown error' }
  }
  
  export async function postJSON(url, body) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    })
    const data = await parseBody(res)
    if (!res.ok) throw new Error(data?.error || res.statusText || 'Request failed')
    return data
  }
  
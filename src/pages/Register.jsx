import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { postJSON } from '../api/client'

export default function Register() {
  const nav = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    if (form.username.trim().length < 3) return setStatus('Username must be at least 3 characters.')
    if (form.password.length < 6) return setStatus('Password must be at least 6 characters.')

    setLoading(true)
    setStatus('Creating account…')
    try {
      await postJSON('/auth/register', { username: form.username.trim(), password: form.password })
      setStatus('Account created! You can log in now.')
      nav('/login', { replace: true })
    } catch (e) {
      setStatus(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input className="w-full border p-3 rounded" name="username" autoComplete="username"
               placeholder="username" value={form.username} onChange={onChange} />
        <input className="w-full border p-3 rounded" name="password" type="password"
               autoComplete="new-password" placeholder="password" value={form.password} onChange={onChange} />
        <button className="w-full bg-violet-600 text-white py-3 rounded" disabled={loading}>
          {loading ? 'Signing up…' : 'Sign up'}
        </button>
      </form>
      <p className="mt-4 text-sm">Already have an account? <Link to="/login" className="text-violet-700">Sign in</Link></p>
      {status && <div className="mt-4 text-sm text-violet-700">{status}</div>}
    </main>
  )
}

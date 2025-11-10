import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import TypingText from './ui/shadcn-io/typing-text/index.jsx'

function Login() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      disable: 'phone',
    })
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return
 
    const payload = {
      username: credentials.username.trim(),
      password: credentials.password,
    }

    if (!payload.username) {
      setStatus('Please enter your username.')
      return
    }

    setIsSubmitting(true)
    setStatus('Signing you in…')
 
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
 
      if (!response.ok) {
        const raw = await response.text()
        let parsed
        try {
          parsed = JSON.parse(raw)
        } catch (parseError) {
          parsed = { error: raw }
        }
        throw new Error(parsed?.error || response.statusText || 'Unable to sign in')
      }
 
      setStatus('Welcome back to Chat4Mine ✨')
      navigate('/chat')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-slate-50 to-fuchsia-100 px-6 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 lg:flex-row">
        <div className="flex-1">
          <div
            data-aos="fade-down"
            className="mb-8 flex flex-col items-end gap-3 text-right sm:flex-row sm:justify-end"
          >
            <Link
              to="/"
              className="w-full rounded-full border border-violet-200 px-6 py-2 text-sm font-semibold text-violet-700 transition hover:border-violet-400 hover:text-violet-900 sm:w-auto"
            >
              Back home
            </Link>
            <Link
              to="/auth/register"
              className="w-full rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700 sm:w-auto"
            >
              Sign up
            </Link>
          </div>

        <div className="text-left">
            <TypingText
              data-aos="fade-up"
              text={['Log in to continue your journey', 'Your space for calm conversations']}
              typingSpeed={40}
              deletingSpeed={28}
              pauseDuration={2200}
              cursorCharacter="|"
              className="block text-3xl font-semibold leading-tight text-slate-900 sm:text-5xl"
              cursorClassName="bg-violet-600"
              textColors={['#4338ca', '#7c3aed', '#1f2937']}
              startOnVisible
            />

            <p
              data-aos="fade-up"
              data-aos-delay="120"
              className="mt-6 max-w-xl text-base text-slate-600"
            >
              Enter your credentials to pick up where you left off. We keep your prompts,
              moods, and supportive responses ready for you.
            </p>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay="180"
          className="flex-1 rounded-[2.5rem] border border-violet-100 bg-white/80 p-8 shadow-xl backdrop-blur"
        >
          <h2 className="text-2xl font-semibold text-slate-900">Log in to Chat4Mind</h2>
          <p className="mt-2 text-sm text-slate-500">
            Access personalized sessions, saved prompts, and your calming companion.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <label className="block text-sm font-medium text-slate-700">
              Username
              <input
                required
                type="text"
                name="username"
                autoComplete="username"
                value={credentials.username}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
                placeholder="your_username"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                required
                type="password"
                name="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
                placeholder="••••••••"
              />
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={[
                'w-full rounded-full bg-violet-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition',
                isSubmitting ? 'opacity-70' : 'hover:bg-violet-700',
              ].join(' ')}
            >
              {isSubmitting ? 'Signing in…' : 'Log in'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Need an account?{' '}
            <Link
              to="/auth/register"
              className="font-semibold text-violet-600 underline-offset-2 transition hover:text-violet-800 hover:underline"
            >
              Create one
            </Link>
          </div>

          {status ? (
            <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/70 px-4 py-3 text-sm font-medium text-violet-700">
              {status}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}

export default Login
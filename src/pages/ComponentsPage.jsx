import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendChatMessage } from '../lib/chatClient.js'
import AOS from 'aos'
import 'aos/dist/aos.css'

const NAV_ACTIONS = [
  { id: 'psychiatrist', label: 'Therapist', icon: '🧠', description: 'Warm, clinical reflections' },
  { id: 'coach', label: 'Coach', icon: '🎯', description: 'Goal-focused accountability' },
  { id: 'listener', label: 'Listener', icon: '🫶', description: 'Gentle, validating responses' },
]

const INITIAL_MESSAGES = [
  {
    id: 'intro',
    role: 'assistant',
    text: 'Welcome back. I’m ready when you are—share how you’re arriving today, and we’ll take it from there.',
    timestamp: new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date()),
  },
]

function ComponentsPage() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState(NAV_ACTIONS[0].id)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [history, setHistory] = useState([])
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState('')
  const statusTimeoutRef = useRef(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginSubmitting, setLoginSubmitting] = useState(false)

  const hasDraft = draft.trim().length > 0

  const pulseStatus = (text) => {
    setStatus(text)
    if (statusTimeoutRef.current) {
      window.clearTimeout(statusTimeoutRef.current)
    }
    statusTimeoutRef.current = window.setTimeout(() => setStatus(''), 2600)
  }

  const activeNavLabel = useMemo(
    () => NAV_ACTIONS.find((item) => item.id === activeNav)?.label ?? '',
    [activeNav],
  )

  const handleStartNewChat = () => {
    setMessages(INITIAL_MESSAGES)
    setHistory([])
    pulseStatus('Started a new conversation')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!hasDraft || isSending) return

    const sanitizedDraft = draft.trim().replace(/\s+/g, ' ')
    setIsSending(true)
    setDraft('')

    const messageId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `msg-${Date.now()}`

    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        role: 'user',
        text: sanitizedDraft,
        timestamp: new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }).format(new Date()),
      },
    ])

    try {
      const data = await sendChatMessage({
        prompt: sanitizedDraft,
        mood: 'neutral',
        mode: activeNav,
      })

      const replyId = `assistant-${messageId}`
      const replyText =
        (data && (data.reply ?? data.message ?? data.text)) ||
        'I’m here and ready whenever you want to continue.'

      setMessages((prev) => [
        ...prev,
        {
          id: replyId,
          role: 'assistant',
          text: replyText,
          timestamp: new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }).format(new Date()),
          animate: true,
        },
      ])

      setHistory((prev) => [
        {
          id: messageId,
          prompt: sanitizedDraft,
          reply: replyText,
          timestamp: new Date().toISOString(),
        },
        ...prev.slice(0, 14),
      ])
      pulseStatus('Assistant responded')

      window.requestAnimationFrame(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === replyId
              ? {
                  ...msg,
                  animate: false,
                }
              : msg,
          ),
        )
      })
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${messageId}`,
          role: 'assistant',
          text: 'I couldn’t reach the service right now. Let’s try again in a moment.',
          timestamp: new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }).format(new Date()),
        },
      ])
      setStatus('Connection hiccup—please retry')
    } finally {
      setIsSending(false)
    }
  }

  useEffect(
    () => () => {
      if (statusTimeoutRef.current) {
        window.clearTimeout(statusTimeoutRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      disable: 'phone',
    })
  }, [])

  useEffect(() => {
    if (!isLoginOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsLoginOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isLoginOpen])

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    if (loginSubmitting) return

    setLoginSubmitting(true)
    await new Promise((resolve) => window.setTimeout(resolve, 600))
    setLoginSubmitting(false)
    setIsLoginOpen(false)
    setLoginForm({ email: '', password: '' })
    pulseStatus('Logged in (demo)')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f3ff] via-white to-[#f6f8ff] text-slate-800">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleStartNewChat}
              className="rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-400 hover:text-violet-900"
            >
              + New conversation
            </button>
            <span className="hidden text-xs uppercase tracking-[0.5em] text-slate-400 sm:block">
              {activeNavLabel} mode
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="hidden items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1 sm:flex">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              {status ? status : 'Guidance ready'}
            </span>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-full border border-violet-100 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:border-violet-200 hover:text-violet-900"
            >
              Home
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[260px_minmax(0,1fr)_260px] lg:px-6">
        <div className="hide-scrollbar -mt-2 flex gap-3 overflow-x-auto rounded-3xl border border-violet-100 bg-white/80 p-3 shadow-sm shadow-violet-100 lg:hidden">
          {NAV_ACTIONS.map((action) => {
            const isActive = action.id === activeNav
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => {
                  setActiveNav(action.id)
                  pulseStatus(`${action.label} assistant engaged`)
                }}
                className={`flex min-w-[140px] flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? 'border-violet-300 bg-violet-50 text-violet-900 shadow-lg shadow-violet-100'
                    : 'border-violet-100 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50'
                }`}
              >
                <span className="text-lg">{action.icon}</span>
                <span className="text-sm font-semibold">{action.label}</span>
                <p className="text-xs text-slate-500">{action.description}</p>
              </button>
            )
          })}
        </div>

        <aside className="flex h-full flex-col gap-4 rounded-3xl border border-violet-100 bg-white/70 p-5 shadow-lg shadow-violet-100 hide-scrollbar overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Conversations</h2>
            <button
              type="button"
              onClick={() => {
                setHistory([])
                pulseStatus('Cleared recent conversations')
              }}
              className="text-xs text-slate-500 transition hover:text-violet-600"
            >
              Clear
            </button>
          </div>
          {history.length === 0 ? (
            <p className="rounded-2xl border border-violet-100 bg-white px-4 py-5 text-sm text-slate-500">
              Your reflections will appear here so you can revisit or resume any thread.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="group rounded-2xl border border-violet-100 bg-white p-4 text-left transition hover:border-violet-200 hover:shadow-lg"
                >
                  <button
                    type="button"
                    className="flex w-full flex-col gap-2 text-left"
                    onClick={() => {
                      setDraft(item.prompt)
                      pulseStatus('Prompt loaded from recent conversation')
                    }}
                  >
                    <p className="text-sm font-semibold text-slate-800 truncate">{item.prompt}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{item.reply}</p>
                    <span className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      }).format(new Date(item.timestamp))}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="flex flex-col overflow-hidden rounded-[2.5rem] border border-violet-100 bg-white/90 shadow-xl shadow-violet-100">
          <div className="flex items-center justify-between border-b border-violet-100 px-8 py-6">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">{activeNavLabel} workspace</h1>
              <p className="text-sm text-slate-500">Thoughtful exchanges designed to feel calm, private, and structured.</p>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-600">
              live session
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 hide-scrollbar">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
              {messages.map((message) => {
                const isUser = message.role === 'user'
                const animate = message.animate
                return (
                  <div
                    key={message.id}
                    className={`flex gap-4 transition-all duration-300 ${
                      isUser ? 'justify-end' : 'justify-start'
                    } ${animate ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}
                  >
                    {!isUser ? (
                      <span className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-sm text-emerald-600">
                        AI
                      </span>
                    ) : null}
                    <div
                      className={`max-w-xl rounded-3xl px-5 py-4 text-sm leading-relaxed shadow-lg shadow-violet-100 transition-all duration-300 ${
                        isUser
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white text-slate-800'
                      }`}
                    >
                      <p>{message.text}</p>
                      <span
                        className={`mt-3 block text-[11px] uppercase tracking-[0.3em] ${
                          isUser ? 'text-emerald-100/90' : 'text-slate-400'
                        }`}
                      >
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-violet-100 bg-white/80 px-6 py-6">
            <div className="mx-auto flex w-full max-w-3xl items-end gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-xl shadow-violet-100">
              <textarea
                name="message"
                autoComplete="off"
                spellCheck={false}
                aria-label="Enter your message"
                placeholder="Ask for a reflection, share a feeling, or request a summary..."
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={1}
                className="max-h-36 w-full resize-none bg-transparent px-2 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!hasDraft || isSending}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                  !hasDraft || isSending
                    ? 'bg-slate-200 text-slate-400'
                    : 'bg-emerald-500 text-white hover:bg-emerald-400'
                }`}
              >
                <span className="sr-only">Send message</span>
                <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M5.05 20.5a.5.5 0 0 1-.5-.65l2.42-7.26a.5.5 0 0 0 0-.28L4.55 5.05a.5.5 0 0 1 .65-.65l15 5a.5.5 0 0 1 0 .93l-6.72 2.24a.5.5 0 0 0-.31.31L11 19.8a.5.5 0 0 1-.92.11l-2.97-4.74a.5.5 0 0 0-.37-.24l-2.6-.31a.5.5 0 0 1-.09-.02Z" />
                </svg>
              </button>
            </div>
            <p className="mx-auto mt-3 max-w-3xl text-center text-xs text-slate-500">
              Chat4Mind may surface sensitive topics. For urgent support, contact local emergency services or your
              provider.
            </p>
          </form>
        </main>

        <aside className="hidden h-full flex-col gap-5 rounded-3xl border border-violet-100 bg-white/70 p-5 text-left shadow-lg shadow-violet-100 hide-scrollbar overflow-y-auto lg:flex">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Assistants</h2>
            <p className="mt-1 text-xs text-slate-500">Switch tone or focus to match the support you need.</p>
          </div>
          <div className="flex flex-col gap-3">
            {NAV_ACTIONS.map((action) => {
              const isActive = action.id === activeNav
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => {
                    setActiveNav(action.id)
                    pulseStatus(`${action.label} assistant engaged`)
                  }}
                  className={`flex flex-col gap-2 rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? 'border-violet-300 bg-violet-50 text-violet-900 shadow-lg shadow-violet-100'
                      : 'border-violet-100 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50'
                  }`}
                >
                  <span className="text-lg">{action.icon}</span>
                  <span className="text-sm font-semibold">{action.label}</span>
                  <p className="text-xs text-slate-500">{action.description}</p>
                </button>
              )
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-violet-100 bg-white px-4 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Session objectives</h3>
            <ul className="mt-3 flex flex-col gap-2 text-xs text-slate-500">
              <li>• Promote regulation and grounding after challenging interactions.</li>
              <li>• Identify emotional patterns that emerged this week.</li>
              <li>• Co-create next steps aligned with therapeutic goals.</li>
            </ul>
          </div>
        </aside>
      </div>

      {isLoginOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4 py-10">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur"
            aria-hidden
            onClick={() => setIsLoginOpen(false)}
          />
          <div
            className="relative z-10 w-full max-w-md rounded-3xl border border-violet-100 bg-white p-8 text-slate-800 shadow-2xl shadow-violet-300 hide-scrollbar overflow-y-auto max-h-[90vh]"
            data-aos="zoom-in"
            data-aos-delay="120"
          >
            <div className="flex items-center justify-between" data-aos="fade-down">
              <h2 className="text-2xl font-semibold">Warm welcome</h2>
              <button
                type="button"
                onClick={() => setIsLoginOpen(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-violet-50 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-100"
              >
                <span className="sr-only">Close</span>✕
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500" data-aos="fade-up" data-aos-delay="160">
              Sign in to sync preferences, cloud-save reflections, and collaborate with your care team.
            </p>
            <form
              onSubmit={handleLoginSubmit}
              className="mt-6 flex flex-col gap-5"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <label className="flex flex-col gap-2 text-left text-sm font-medium text-slate-700">
                Email
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm((prev) => ({
                      ...prev,
                      email: event.target.value.trim(),
                    }))
                  }
                  className="rounded-xl border border-violet-100 bg-white px-4 py-3 text-base text-slate-800 shadow-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                  placeholder="you@example.com"
                />
              </label>
              <label className="flex flex-col gap-2 text-left text-sm font-medium text-slate-700">
                Password
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  className="rounded-xl border border-violet-100 bg-white px-4 py-3 text-base text-slate-800 shadow-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                  placeholder="Enter your password"
                />
              </label>

              <button
                type="submit"
                disabled={loginSubmitting}
                className={`mt-2 inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition ${
                  loginSubmitting ? 'opacity-70' : 'hover:bg-violet-700'
                }`}
                data-aos="fade-up"
                data-aos-delay="240"
              >
                {loginSubmitting ? 'Signing in…' : 'Login'}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-500" data-aos="fade-up" data-aos-delay="280">
              Need an account?{' '}
              <button
                type="button"
                className="font-semibold text-violet-600 underline-offset-2 transition hover:text-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-200"
                onClick={() => {
                  setIsLoginOpen(false)
                  pulseStatus('Redirecting to sign up (demo)')
                }}
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ComponentsPage


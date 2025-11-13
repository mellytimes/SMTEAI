import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendChatMessage } from '../lib/chatClient.js'
import AOS from 'aos'
import 'aos/dist/aos.css'
import DOMPurify from 'dompurify'

const NAV_ACTIONS = [
  {
    id: 'psychiatrist',
    icon: '🧠',
    labels: {
      EN: 'Therapist',
      TH: 'นักบำบัด',
    },
    descriptions: {
      EN: 'Warm, clinical reflections',
      TH: 'บทสนทนาที่อบอุ่นและเข้าใจง่าย',
    },
  },
  {
    id: 'coach',
    icon: '🎯',
    labels: {
      EN: 'Coach',
      TH: 'โค้ช',
    },
    descriptions: {
      EN: 'Goal-focused accountability',
      TH: 'โฟกัสเป้าหมายและติดตามความคืบหน้า',
    },
  },
  {
    id: 'listener',
    icon: '🫶',
    labels: {
      EN: 'Listener',
      TH: 'ผู้รับฟัง',
    },
    descriptions: {
      EN: 'Gentle, validating responses',
      TH: 'ตอบกลับอย่างนุ่มนวลและรับฟังอย่างเข้าใจ',
    },
  },
  {
    id: 'goofy',
    icon: '😂',
    labels: {
      EN: 'Goofy',
      TH: 'เชี้ยไรเนี้ย เอาแล้วแต่มึงเลย',
    },
    descriptions: {
      EN: 'I dont know anymore',
      TH: 'กูไม่รู้อะไรละ เอาแล้วแต่มึงเลย',
    },
  },
]

const translations = {
  EN: {
    badges: {
      limitedTime: 'Limited time',
    },
    buttons: {
      newConversation: '+ New conversation',
      home: 'Home',
    },
    status: {
      ready: 'Guidance ready',
      startedConversation: 'Started a new conversation',
      assistantResponded: 'Assistant responded',
      connectionError: 'Connection hiccup—please retry',
      conversationCleared: 'Cleared recent conversations',
      promptLoaded: 'Prompt loaded from recent conversation',
      redirectingSignup: 'Redirecting to sign up (demo)',
      loginDemo: 'Logged in (demo)',
      assistantEngaged: (label) => `${label} assistant engaged`,
    },
    warning:
      'If the assistant is not responding, please try again. If the problem persists, please contact support.',
    conversations: {
      title: 'Conversations',
      clear: 'Clear',
      empty: 'Your reflections will appear here so you can revisit or resume any thread.',
    },
    chat: {
      workspaceSuffix: 'workspace',
      subheading: 'Thoughtful exchanges designed to feel calm, private, and structured.',
      liveSession: 'live session',
      defaultResponse: 'I’m here and ready whenever you want to continue.',
      assistantFailure: 'I couldn’t reach the service right now. Let’s try again in a moment.',
      placeholder: 'Ask for a reflection, share a feeling, or request a summary...',
      guideline:
        'Chat4Mind may surface sensitive topics. For urgent support, contact local emergency services or your provider.',
    },
    modal: {
      heading: 'Warm welcome',
      signInLead: 'Sign in to sync preferences, cloud-save reflections, and collaborate with your care team.',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      login: 'Login',
      signingIn: 'Signing in…',
      needAccount: 'Need an account?',
      createOne: 'Create one',
    },
  },
  TH: {
    badges: {
      limitedTime: 'จำกัดเวลา',
    },
    buttons: {
      newConversation: '+ เริ่มบทสนทนาใหม่',
      home: 'หน้าหลัก',
    },
    status: {
      ready: 'พร้อมให้คำแนะนำ',
      startedConversation: 'เริ่มบทสนทนาใหม่แล้ว',
      assistantResponded: 'ผู้ช่วยตอบกลับแล้ว',
      connectionError: 'เกิดปัญหาการเชื่อมต่อ โปรดลองอีกครั้ง',
      conversationCleared: 'ล้างประวัติสนทนาล่าสุดแล้ว',
      promptLoaded: 'โหลดข้อความจากประวัติแล้ว',
      redirectingSignup: 'กำลังไปหน้าสมัครสมาชิก (สาธิต)',
      loginDemo: 'เข้าสู่ระบบ (สาธิต)',
      assistantEngaged: (label) => `เปิดโหมด ${label}`,
    },
    warning:
      'หากผู้ช่วยไม่ตอบกลับ โปรดลองอีกครั้ง หากปัญหายังคงอยู่โปรดติดต่อฝ่ายสนับสนุน',
    conversations: {
      title: 'ประวัติสนทนา',
      clear: 'ล้าง',
      empty: 'เมื่อคุณสนทนา ประวัติจะปรากฏให้กลับมาอ่านได้อีกครั้ง',
    },
    chat: {
      workspaceSuffix: 'พื้นที่สนทนา',
      subheading: 'บทสนทนาที่อบอุ่น เป็นส่วนตัว และมีโครงสร้างที่ชัดเจน',
      liveSession: 'กำลังสนทนา',
      defaultResponse: 'ฉันพร้อมตอบกลับเมื่อคุณพร้อมเสมอ',
      assistantFailure: 'เชื่อมต่อกับเซิร์ฟเวอร์ไม่สำเร็จ ลองอีกครั้งในอีกสักครู่',
      placeholder: 'เล่าสิ่งที่คุณรู้สึก หรือสิ่งที่อยากให้ฉันช่วยสรุป...',
      guideline:
        'Chat4Mind อาจกล่าวถึงหัวข้อที่ละเอียดอ่อน หากต้องการความช่วยเหลือเร่งด่วน โปรดติดต่อหน่วยงานฉุกเฉินหรือผู้เชี่ยวชาญใกล้ตัว',
    },
    modal: {
      heading: 'ยินดีต้อนรับ',
      signInLead: 'เข้าสู่ระบบเพื่อบันทึกบทสนทนาและซิงก์การตั้งค่าของคุณ',
      emailLabel: 'อีเมล',
      passwordLabel: 'รหัสผ่าน',
      login: 'เข้าสู่ระบบ',
      signingIn: 'กำลังเข้าสู่ระบบ…',
      needAccount: 'ยังไม่มีบัญชี?',
      createOne: 'สมัครสมาชิก',
    },
  },
}

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
  const [language, setLanguage] = useState('TH')
  const [isLoading, setIsLoading] = useState(true)
  const [activeNav, setActiveNav] = useState(NAV_ACTIONS[0].id)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [history, setHistory] = useState([])
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isAssistantTyping, setIsAssistantTyping] = useState(false)
  const [status, setStatus] = useState('')
  const statusTimeoutRef = useRef(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginSubmitting, setLoginSubmitting] = useState(false)

  const sanitize = (value) =>
    DOMPurify.sanitize(value ?? '', {
      ALLOWED_TAGS: ['a', 'strong', 'em', 'br', 'code', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
    })

  const t = translations[language]

  const hasDraft = draft.trim().length > 0

  const pulseStatus = (text) => {
    setStatus(text)
    if (statusTimeoutRef.current) {
      window.clearTimeout(statusTimeoutRef.current)
    }
    statusTimeoutRef.current = window.setTimeout(() => setStatus(''), 2600)
  }

  const activeNavLabel = useMemo(() => {
    const action = NAV_ACTIONS.find((item) => item.id === activeNav)
    return action ? action.labels[language] : ''
  }, [activeNav, language])

  const handleStartNewChat = () => {
    setMessages(INITIAL_MESSAGES)
    setHistory([])
    pulseStatus(t.status.startedConversation)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!hasDraft || isSending) return

    const sanitizedDraft = draft.trim().replace(/\s+/g, ' ')
    setIsSending(true)
    setDraft('')
    setIsAssistantTyping(true)

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
        t.chat.defaultResponse

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
      setIsAssistantTyping(false)
      pulseStatus(t.status.assistantResponded)

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
      setIsAssistantTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${messageId}`,
          role: 'assistant',
          text: t.chat.assistantFailure,
          timestamp: new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }).format(new Date()),
        },
      ])
      const connectionMessage = t.status.connectionError
      setStatus(connectionMessage)
      pulseStatus(connectionMessage)
    } finally {
      setIsAssistantTyping(false)
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
    const timeout = window.setTimeout(() => setIsLoading(false), 1600)
    return () => window.clearTimeout(timeout)
  }, [])

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
    pulseStatus(t.status.loginDemo)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f7f3ff] via-white to-[#f6f8ff] text-slate-800">
      {isLoading ? (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/10 px-8 py-8 text-white shadow-2xl shadow-violet-900/20 sm:px-12 sm:py-10">
            <span className="inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-white/50 border-t-transparent sm:h-14 sm:w-14" />
            <div className="space-y-2 text-center">
              <p className="text-xs uppercase tracking-[0.6em] text-violet-200 sm:text-sm">chat4mind</p>
              <p className="text-base font-semibold text-white sm:text-lg">Loading your calm space…</p>
            </div>
          </div>
        </div>
      ) : null}
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleStartNewChat}
              className="rounded-full border border-violet-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-violet-400 hover:text-violet-900 sm:px-4 sm:text-sm"
            >
              {t.buttons.newConversation}
            </button>
            <span className="hidden text-[11px] uppercase tracking-[0.5em] text-slate-400 sm:block">
              {activeNavLabel}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
            <span className="hidden items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1 sm:flex">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              {status ? status : t.status.ready}
            </span>
            <button
              type="button"
              onClick={() => setLanguage((prev) => (prev === 'EN' ? 'TH' : 'EN'))}
              className="rounded-full border border-violet-200 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:border-violet-400 hover:text-violet-900 sm:px-4 sm:text-sm"
            >
              {language === 'EN' ? 'TH' : 'EN'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-full border border-violet-200 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:border-violet-400 hover:text-violet-900 sm:px-4 sm:text-sm"
            >
              {t.buttons.home}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-4 sm:gap-6 sm:px-6 sm:py-8 lg:grid lg:grid-cols-[280px_minmax(0,1fr)_280px]">
        <div className="hide-scrollbar -mt-1 flex gap-3 overflow-x-auto rounded-3xl border border-violet-100 bg-white/80 p-3 shadow-sm shadow-violet-100 lg:hidden">
          {NAV_ACTIONS.map((action) => {
            const isActive = action.id === activeNav
            const label = action.labels[language]
            const description = action.descriptions[language]
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => {
                  setActiveNav(action.id)
                  pulseStatus(t.status.assistantEngaged(label))
                }}
                className={`flex min-w-[150px] flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left text-xs transition ${
                  isActive
                    ? 'border-violet-300 bg-violet-50 text-violet-900 shadow-lg shadow-violet-100'
                    : 'border-violet-100 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50'
                }`}
              >
                <span className="text-lg">{action.icon}</span>
                <span className="text-sm font-semibold">{label}</span>
                {action.id === 'goofy' ? (
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-600">
                    {t.badges.limitedTime}
                  </span>
                ) : null}
                <p className="text-xs text-slate-500">{description}</p>
              </button>
            )
          })}
        </div>

        <aside className="hidden h-full flex-col gap-4 rounded-3xl border border-violet-100 bg-white/70 p-5 shadow-lg shadow-violet-100 hide-scrollbar overflow-y-auto lg:flex">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">{t.conversations.title}</h2>
            <button
              type="button"
              onClick={() => {
                setHistory([])
                pulseStatus(t.status.conversationCleared)
              }}
              className="text-xs text-slate-500 transition hover:text-violet-600"
            >
              {t.conversations.clear}
            </button>
          </div>
          {history.length === 0 ? (
            <p className="rounded-2xl border border-violet-100 bg-white px-4 py-5 text-sm text-slate-500">
              {t.conversations.empty}
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
                      pulseStatus(t.status.promptLoaded)
                    }}
                  >
                    <p className="text-sm font-semibold text-slate-800 truncate">{sanitize(item.prompt)}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{sanitize(item.reply)}</p>
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

        <main className="flex h-[calc(100vh-7.5rem)] flex-col overflow-hidden rounded-[2.5rem] border border-violet-100 bg-white/90 shadow-xl shadow-violet-100 sm:h-[calc(100vh-8.5rem)]">
          <div className="border-b border-violet-100 px-5 py-4 sm:px-8 sm:py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
                  {activeNavLabel} {t.chat.workspaceSuffix}
                </h1>
                <p className="text-xs text-slate-500 sm:text-sm">{t.chat.subheading}</p>
              </div>
              <span className="rounded-full bg-blue-500/15 px-1 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-cyan-600 sm:text-[11px]">
                {t.chat.liveSession}
              </span>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 sm:text-sm">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-200/60 text-amber-700">
                !
              </span>
              <p>{t.warning}</p>
            </div>
          </div>

          <div className="hide-scrollbar flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-8">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
              {messages.map((message) => {
                const isUser = message.role === 'user'
                const animate = message.animate
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 transition-all duration-300 ${
                      isUser ? 'justify-end' : 'justify-start'
                    } ${animate ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}
                  >
                    {!isUser ? (
                      <span className="hidden h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-sm text-blue-600 sm:inline-flex">
                        SORA
                      </span>
                    ) : null}
                    <div
                      className={`max-w-[90%] rounded-3xl px-5 py-4 text-sm leading-relaxed shadow-lg shadow-violet-100 transition-all duration-300 sm:max-w-2xl sm:px-6 sm:py-5 ${
                        isUser
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-slate-800'
                      }`}
                    >
                      <p>{sanitize(message.text)}</p>
                      <span
                        className={`mt-3 block text-[10px] uppercase tracking-[0.3em] sm:text-[11px] ${
                          isUser ? 'text-emerald-100/90' : 'text-slate-400'
                        }`}
                      >
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                )
              })}
              {isAssistantTyping ? (
                <div className="flex gap-3">
                  <span className="hidden h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-sm text-blue-600 sm:inline-flex">
                    SORA
                  </span>
                  <div className="max-w-[80%] rounded-3xl bg-white px-5 py-4 text-sm text-slate-500 shadow-lg shadow-violet-100 sm:max-w-sm sm:px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                        {language === 'EN' ? '' : ''}
                      </span>
                      <div className="flex items-center gap-1">
                        {[0, 1, 2].map((dot) => (
                          <span
                            key={dot}
                            className="h-2 w-2 rounded-full bg-slate-300 animate-bounce"
                            style={{ animationDelay: `${dot * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-violet-100 bg-white/85 px-4 py-4 sm:px-6 sm:py-6 sticky bottom-0 left-0 right-0">
            <div className="mx-auto flex w-full max-w-3xl items-end gap-3 rounded-3xl border border-violet-100 bg-white px-4 py-3 shadow-xl shadow-violet-100 sm:px-5">
              <textarea
                name="message"
                autoComplete="off"
                spellCheck={false}
                aria-label="Enter your message"
                placeholder={t.chat.placeholder}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    if (hasDraft && !isSending) {
                      handleSubmit(event)
                    }
                  }
                }}
                rows={2}
                className="max-h-40 min-h-[52px] w-full resize-none bg-transparent px-2 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
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
              {t.chat.guideline}
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
              const label = action.labels[language]
              const description = action.descriptions[language]
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => {
                    setActiveNav(action.id)
                    pulseStatus(t.status.assistantEngaged(label))
                  }}
                  className={`flex flex-col gap-2 rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? 'border-violet-300 bg-violet-50 text-violet-900 shadow-lg shadow-violet-100'
                      : 'border-violet-100 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50'
                  }`}
                >
                  <span className="text-lg">{action.icon}</span>
                  <span className="text-sm font-semibold">{label}</span>
                  {action.id === 'goofy' ? (
                    <span className="w-fit rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-600">
                      {t.badges.limitedTime}
                    </span>
                  ) : null}
                  <p className="text-xs text-slate-500">{description}</p>
                </button>
              )
            })}
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
            className="relative z-10 w-full max-w-md rounded-3xl border border-violet-100 bg-white p-8 text-slate-800 shadow-2xl shadow-violet-300 hide-scrollbar max-h-[90vh] overflow-y-auto"
            data-aos="zoom-in"
            data-aos-delay="120"
          >
            <div className="flex items-center justify-between" data-aos="fade-down">
              <h2 className="text-2xl font-semibold">{t.modal.heading}</h2>
              <button
                type="button"
                onClick={() => setIsLoginOpen(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-violet-50 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-100"
              >
                <span className="sr-only">Close</span>✕
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500" data-aos="fade-up" data-aos-delay="160">
              {t.modal.signInLead}
            </p>
            <form
              onSubmit={handleLoginSubmit}
              className="mt-6 flex flex-col gap-5"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <label className="flex flex-col gap-2 text-left text-sm font-medium text-slate-700">
                {t.modal.emailLabel}
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
                {t.modal.passwordLabel}
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
                {loginSubmitting ? t.modal.signingIn : t.modal.login}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-500" data-aos="fade-up" data-aos-delay="280">
              {t.modal.needAccount}{' '}
              <button
                type="button"
                className="font-semibold text-violet-600 underline-offset-2 transition hover:text-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-200"
                onClick={() => {
                  setIsLoginOpen(false)
                  pulseStatus(t.status.redirectingSignup)
                }}
              >
                {t.modal.createOne}
              </button>
            </p>
          </div>
        </div>
      ) : null}

      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform px-4"
      >
        {status ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-500/30 sm:text-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            {status}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default ComponentsPage


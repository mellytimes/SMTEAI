import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import TypingText from '../components/ui/shadcn-io/typing-text/index.jsx'

const contributors = [
  {
    name: 'MellyTimes',
    role: 'Lead Developer',
    href: 'https://github.com/MellyTimes',
  },
  {
    name: 'Memo',
    role: 'Product Designer',
    href: '',
  },
  {
    name: 'JO',
    role: 'AI Engineer',
    href: 'https://github.com/Mrpee-likeu2',
  },
]

function Home() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      disable: 'phone',
    })
    const timeout = window.setTimeout(() => setIsLoading(false), 1600)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const metrics = [
    { label: 'Reflections logged', value: '48K+' },
    { label: 'Clinicians partnered', value: '320' },
    { label: 'Avg. session uplift', value: '27%' },
  ]

  const featureHighlights = [
    {
      icon: '🧭',
      title: 'Guided Conversations',
      description:
        'Curated prompts, grounding practices, and reflective follow-ups that adapt in real time to each mood check-in.',
    },
    {
      icon: '📊',
      title: 'Mood Intelligence',
      description:
        'Weekly pulse reports, sentiment insights, and gentle nudges aligned with your therapeutic goals and routines.',
    },
    {
      icon: '🤝',
      title: 'Collaborative Care',
      description:
        'Securely share snapshots with clinicians, track next steps, and keep every stakeholder aligned on progress.',
    },
  ]

  const testimonials = [
    {
      quote:
        'Chat4Mind helps my clients stay engaged between sessions. The weekly snapshot saves me hours of prep time.',
      name: 'Dr. Maya Chen',
      role: 'Trauma-informed Therapist',
    },
    {
      quote:
        'I have a space to reflect every evening and I can see how far I have come. The tone is warm, never clinical.',
      name: 'Elena R.',
      role: 'Member since 2024',
    },
    {
      quote:
        'Our support team can triage better because the summary captures patterns and highlights exceptions instantly.',
      name: 'Jordan Fields',
      role: 'Wellness Program Lead',
    },
  ]

  return (
    <main className="relative overflow-hidden bg-gradient-to-br from-[#f4f0ff] via-white to-[#f8f5ff] px-5 pb-16 pt-10 sm:px-6 sm:pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute bottom-24 right-[-6rem] h-72 w-72 rounded-full bg-blue-200/30 blur-3xl sm:h-80 sm:w-80" />
      </div>

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

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-14 sm:gap-16">
        <header
          data-aos="fade-down"
          className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/70 p-4 shadow-lg shadow-violet-100 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 text-base font-semibold text-white sm:h-12 sm:w-12 sm:text-lg">
                CM
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.5em] text-slate-500 sm:text-xs">Mental wellness platform</p>
                <h1 className="text-base font-semibold text-slate-900 sm:text-lg">Chat4Mind Studio</h1>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-full border border-violet-100 px-3 py-2 text-sm font-semibold text-violet-700 transition hover:border-violet-200 hover:text-violet-900 sm:hidden"
            >
              Menu
            </button>
          </div>

          <nav className="hidden items-center gap-3 sm:flex">
            <button
              onClick={() => navigate('/chat')}
              className="rounded-full border border-violet-200 px-5 py-2 text-sm font-semibold text-violet-700 transition hover:border-violet-400 hover:text-violet-900"
            >
              Launch studio
            </button>
          </nav>
        </header>

        {mobileMenuOpen ? (
          <div className="fixed inset-0 z-40 flex items-start justify-end bg-slate-900/30 backdrop-blur-sm sm:hidden">
            <div className="hide-scrollbar flex h-full w-full max-w-xs flex-col gap-6 overflow-y-auto rounded-l-3xl border border-white/70 bg-white/95 p-6 shadow-xl shadow-violet-200">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Menu</p>
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="rounded-full border border-violet-100 px-3 py-1 text-sm text-violet-600"
                >
                  Close
                </button>
              </div>
              <button
                onClick={() => {
                  navigate('/chat')
                  closeMobileMenu()
                }}
                className="rounded-full border border-violet-200 px-5 py-2 text-left text-sm font-semibold text-violet-700 transition hover:border-violet-400 hover:text-violet-900"
              >
                Launch studio
              </button>
              <button
                onClick={() => {
                  navigate('/changelog')
                  closeMobileMenu()
                }}
                className="rounded-full border border-violet-200 px-5 py-2 text-left text-sm font-semibold text-violet-700 transition hover:border-violet-400 hover:text-violet-900"
              >
                Release journal
              </button>
            </div>
          </div>
        ) : null}

        <section className="relative overflow-hidden rounded-[2.75rem] bg-gradient-to-br from-white via-white/85 to-violet-100/40 px-6 py-10 shadow-xl shadow-violet-100 sm:px-10">
          <div className="absolute -right-20 top-[-3rem] hidden h-72 w-72 rounded-full bg-violet-200/30 blur-3xl md:block" />
          <div className="absolute bottom-[-4rem] left-[-2rem] hidden h-80 w-80 rounded-full bg-blue-200/30 blur-3xl md:block" />

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-violet-700">
                Trusted companion for inclusive care
              </span>
              <TypingText
                data-aos="fade-up"
                text={[
                  'Human-centered support for every reflection',
                  'A therapeutic co-pilot that scales with care teams',
                ]}
                typingSpeed={38}
                deletingSpeed={26}
                pauseDuration={2400}
                cursorCharacter="|"
                className="block text-balance text-3xl font-semibold leading-tight text-slate-900 sm:text-5xl"
                cursorClassName="bg-violet-600"
                textColors={['#312e81', '#5b21b6', '#0f172a']}
              />
              <p className="max-w-xl text-base leading-relaxed text-slate-600">
                Capture moods with nuance, surface patterns with context, and offer warmth between sessions. Chat4Mind
                blends gentle language coaching, rich analytics, and collaborative tooling to help teams deliver care that
                feels human at every step.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  onClick={() => navigate('/chat')}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
                >
                  Launch studio
                </button>
                <button
                  onClick={() => navigate('/changelog')}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  View release journal
                </button>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-6 rounded-[2rem] border border-violet-100 bg-white/80 p-6 shadow-lg shadow-violet-100 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Why teams choose Chat4Mind</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {[{
                  value: '48K+',
                  label: 'Reflections logged',
                }, {
                  value: '320',
                  label: 'Clinicians partnered',
                }, {
                  value: '27%',
                  label: 'Session uplift',
                }].map((metric) => (
                  <div key={metric.label} className="rounded-2xl bg-white px-5 py-4 text-left shadow-sm">
                    <p className="text-2xl font-semibold text-slate-900">{metric.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">{metric.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500">
                Dedicated clinical strategists and AI specialists partner with you to ensure successful onboarding,
                privacy alignment, and measurable outcomes within the first 90 days.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-4 text-center">
            <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.45em] text-violet-600">
              Experience toolkit
            </span>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              A professional stack for compassionate, data-informed care
            </h2>
            <p className="mx-auto max-w-3xl text-base text-slate-600">
              From mood capture to continuity of support, every module pairs gentle UX with enterprise-grade compliance.
              Curate journeys, orchestrate interventions, and keep everyone connected without sacrificing privacy.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: '🧭',
                title: 'Guided Conversations',
                description:
                  'Curated prompts, grounding practices, and reflective follow-ups that adapt in real time to each mood check-in.',
              },
              {
                icon: '📊',
                title: 'Mood Intelligence',
                description:
                  'Weekly pulse reports, sentiment insights, and gentle nudges aligned with your therapeutic goals and routines.',
              },
              {
                icon: '🤝',
                title: 'Collaborative Care',
                description:
                  'Securely share snapshots with clinicians, track next steps, and keep every stakeholder aligned on progress.',
              },
            ].map((feature) => (
              <article
                key={feature.title}
                className="flex h-full flex-col gap-4 rounded-3xl border border-violet-100 bg-white/85 p-6 text-left shadow-lg shadow-violet-100 transition hover:border-violet-200 hover:shadow-xl"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-xl">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2.5rem] border border-white/60 bg-white/80 p-8 shadow-xl shadow-violet-100 backdrop-blur sm:p-10">
          <div className="flex flex-col gap-6 text-center">
            <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.5em] text-white">
              Voices from the community
            </span>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Designed with clinicians, loved by members</h2>
            <p className="mx-auto max-w-3xl text-base text-slate-600">
              Whether you are guiding others or seeking your own balance, Chat4Mind keeps momentum steady with thoughtful,
              inclusive experiences.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:mt-10 md:grid-cols-3">
            {[
              {
                quote:
                  'Chat4Mind helps my clients stay engaged between sessions. The weekly snapshot saves me hours of prep time.',
                name: 'Dr. Maya Chen',
                role: 'Trauma-informed Therapist',
              },
              {
                quote:
                  'I have a space to reflect every evening and I can see how far I have come. The tone is warm, never clinical.',
                name: 'Elena R.',
                role: 'Member since 2024',
              },
              {
                quote:
                  'Our support team can triage better because the summary captures patterns and highlights exceptions instantly.',
                name: 'Jordan Fields',
                role: 'Wellness Program Lead',
              },
            ].map((testimonial) => (
              <blockquote
                key={testimonial.name}
                className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-slate-100 bg-white px-6 py-6 text-left shadow-md"
              >
                <p className="text-sm leading-relaxed text-slate-600">“{testimonial.quote}”</p>
                <footer className="text-sm font-semibold text-slate-900">
                  {testimonial.name}
                  <span className="block text-xs font-normal uppercase tracking-[0.35em] text-slate-400">
                    {testimonial.role}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-500 px-6 py-8 text-white shadow-xl shadow-violet-200 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 text-center sm:text-left sm:items-center sm:justify-between sm:flex-row">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs uppercase tracking-[0.5em] text-white/70">Ready when you are</p>
              <h3 className="text-3xl font-semibold sm:text-4xl">Start your gentle AI journey today</h3>
              <p className="text-sm text-white/80">
                Book a discovery session with our experience team, or explore the studio sandbox to witness the guided
                reflections in action.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate('/chat')}
                className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore studio
              </button>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-500 px-6 py-8 text-white shadow-xl shadow-violet-200 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 text-center sm:text-left sm:items-center sm:justify-between sm:flex-row">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs uppercase tracking-[0.5em] text-white/70">About us</p>
              <h3 className="text-3xl font-semibold sm:text-4xl">Contributors</h3>
              <p className="text-sm text-white/80">
                Chat4Mind is the result of a multidisciplinary team bringing therapy, design, and machine intelligence together.
              </p>
            </div>
            <div className="grid w-full max-w-md gap-3 text-left sm:grid-cols-1">
              {contributors.map((person) => (
                <a
                  key={person.name}
                  href={person.href || '#'}
                  target={person.href ? '_blank' : undefined}
                  rel={person.href ? 'noreferrer' : undefined}
                  className="group flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur transition hover:border-white/40 hover:bg-white/20"
                >
                  <div>
                    <p className="text-white text-sm font-semibold">{person.name}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/70">{person.role}</p>
                  </div>
                  <span className="text-sm text-white/80 transition group-hover:translate-x-1">{person.href ? '↗' : '—'}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Home
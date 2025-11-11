import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import TypingText from '../components/ui/shadcn-io/typing-text/index.jsx'
import favicon from '../images/android-chrome-512x512.png'

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

const copy = {
  EN: {
    nav: {
      launch: 'Launch studio',
      release: 'Release journal',
      home: 'Home',
      menu: 'Menu',
      close: 'Close',
    },
    hero: {
      badge: 'Trusted companion for inclusive care',
      typingText: [
        'Human-centered support for every reflection',
        'A therapeutic co-pilot that scales with care teams',
      ],
      paragraph:
        'Capture moods with nuance, surface patterns with context, and offer warmth between sessions. Chat4Mind blends gentle language coaching, rich analytics, and collaborative tooling to help teams deliver care that feels human at every step.',
      ctaPrimary: 'Launch studio',
      ctaSecondary: 'View release journal',
    },
    metrics: [
      { value: '0', label: 'Reflections logged' },
      { value: '0', label: 'Clinicians partnered' },
      { value: '0%', label: 'Session uplift' },
    ],
    metricsBlock: {
      badge: 'Why teams choose Chat4Mind',
    },
    metricsParagraph:
      'Dedicated clinical strategists and AI specialists partner with you to ensure successful onboarding, privacy alignment, and measurable outcomes within the first 90 days.',
    featuresSection: {
      badge: 'Experience toolkit',
      heading: 'A professional stack for compassionate, data-informed care',
      paragraph:
        'From mood capture to continuity of support, every module pairs gentle UX with enterprise-grade compliance. Curate journeys, orchestrate interventions, and keep everyone connected without sacrificing privacy.',
    },
    features: [
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
    ],
    testimonialsSection: {
      badge: 'Voices from the community',
      heading: 'Designed with clinicians, loved by members',
      paragraph:
        'Whether you are guiding others or seeking your own balance, Chat4Mind keeps momentum steady with thoughtful, inclusive experiences.',
    },
    testimonials: [
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
    ],
    cta: {
      badge: 'Ready when you are',
      heading: 'Start your gentle AI journey today',
      paragraph:
        'Book a discovery session with our experience team, or explore the studio sandbox to witness the guided reflections in action.',
      button: 'Explore studio',
    },
    contributorsSection: {
      badge: 'About us',
      heading: 'Contributors',
      description:
        'Chat4Mind is the result of a multidisciplinary team bringing therapy, design, and machine intelligence together.',
      linkArrow: '↗',
      linkPlaceholder: '—',
    },
  },
  TH: {
    nav: {
      launch: 'เปิดสตูดิโอ',
      release: 'บันทึกการปรับปรุง',
      home: 'หน้าหลัก',
      menu: 'เมนู',
      close: 'ปิด',
    },
    hero: {
      badge: 'เพื่อนคู่คิดที่เชื่อถือได้สำหรับการดูแลแบบครอบคลุม',
      typingText: [
        'การคุยที่เข้าใจคนในทุกบทสนทนา',
        'AI ที่จะเป็นเซฟโซนให้คุณ',
      ],
      paragraph:
        'วิเคราะห์รูปแบบอย่างมีบริบท และมอบความอบอุ่นระหว่างช่วงห่างของการบำบัด Chat4Mind ผสานการโค้ชด้วยภาษาอันนุ่มนวล การวิเคราะห์เชิงลึก และเครื่องมือสำหรับทีม เพื่อสร้างการดูแลที่สัมผัสถึงได้จริงทุกครั้ง.',
      ctaPrimary: 'เปิดสตูดิโอ',
      ctaSecondary: 'ดูบันทึกการปรับปรุง',
    },
    metrics: [
      { value: '0', label: 'จำนวนบทสนทนา' },
      { value: '0', label: 'ผู้เชี่ยวชาญร่วมมือ' },
      { value: '0%', label: 'การพัฒนาช่วงสนทนา' },
    ],
    metricsBlock: {
      badge: 'เหตุผลที่ทีมต่างไว้ใจ Chat4Mind',
    },
    metricsParagraph:
      'ทีมที่ปรึกษาด้านคลินิกและผู้เชี่ยวชาญ AI ของเราพร้อมช่วยคุณตั้งค่าระบบให้มั่นใจเรื่องความเป็นส่วนตัวและผลลัพธ์ที่วัดได้ภายใน 90 วันแรก.',
    featuresSection: {
      badge: 'ชุดเครื่องมือประสบการณ์',
      heading: 'โซลูชันมืออาชีพเพื่อการดูแลที่อ่อนโยนและใช้ข้อมูลประกอบ',
      paragraph:
        'ตั้งแต่การบันทึกอารมณ์ไปจนถึงการรักษาความต่อเนื่อง ทุกโมดูลออกแบบด้วย UX ที่นุ่มนวลควบคู่มาตรฐานองค์กร ให้คุณออกแบบเส้นทางการดูแลและประสานทุกฝ่ายโดยไม่เสียสละความเป็นส่วนตัว.',
    },
    features: [
      {
        icon: '🧭',
        title: 'บทสนทนาที่มีแนวทาง',
        description:
          'คำถาม กระบวนการตั้งสติ และการติดตามที่ปรับตามอารมณ์แบบเรียลไทม์.',
      },
      {
        icon: '📊',
        title: 'ระบบอัจฉริยะด้านอารมณ์',
        description:
          'รายงาน Pulse ประจำสัปดาห์ วิเคราะห์น้ำเสียง และแจ้งเตือนอย่างนุ่มนวลตามเป้าหมายของคุณ.',
      },
      {
        icon: '🤝',
        title: 'การดูแลแบบร่วมมือ',
        description:
          'แบ่งปันภาพรวมให้ทีมผู้เชี่ยวชาญ ติดตามขั้นตอนถัดไป และให้ทุกคนเดินไปในทิศทางเดียวกัน.',
      },
    ],
    testimonialsSection: {
      badge: 'เสียงจากชุมชน',
      heading: 'ออกแบบร่วมกับนักบำบัด และเป็นที่รักของผู้ใช้',
      paragraph:
        'ไม่ว่าคุณจะเป็นผู้ดูแลหรือผู้รับการดูแล Chat4Mind ช่วยให้การเดินทางก้าวต่ออย่างนุ่มนวลและครอบคลุม.',
    },
    testimonials: [
      {
        quote:
          'Chat4Mind ช่วยให้ผู้รับการบำบัดของฉันมีส่วนร่วมระหว่างนัด และรายงานรายสัปดาห์ช่วยประหยัดเวลาการเตรียมตัวได้มาก.',
        name: 'ดร. มายา เฉิน',
        role: 'นักบำบัดเฉพาะทางด้านความบอบช้ำ',
      },
      {
        quote:
          'ฉันมีพื้นที่สะท้อนความคิดทุกคืน และเห็นพัฒนาการของตัวเองอย่างชัดเจน น้ำเสียงของระบบอบอุ่นและไม่แข็งกร้าว.',
        name: 'เอลีนา อาร์.',
        role: 'สมาชิกตั้งแต่ปี 2024',
      },
      {
        quote:
          'ทีมสนับสนุนของเราคัดกรองเคสได้ดีขึ้น เพราะระบบสรุปประเด็นสำคัญและสิ่งที่ผิดปกติไว้ให้แล้ว.',
        name: 'จอร์แดน ฟิลด์ส',
        role: 'หัวหน้าฝ่ายโปรแกรมสุขภาวะ',
      },
    ],
    cta: {
      badge: 'พร้อมเมื่อคุณพร้อม',
      heading: 'เริ่มต้นการเดินทางกับผู้ช่วย AI ที่นุ่มนวล',
      paragraph:
        'จองเวลาพูดคุยกับทีม Experience ของเรา หรือทดลองใช้งานสตูดิโอเพื่อสัมผัสบทสนทนาจริง.',
      button: 'สำรวจสตูดิโอ',
    },
    contributorsSection: {
      badge: 'เกี่ยวกับเรา',
      heading: 'ทีมผู้ร่วมพัฒนา',
      description:
        'Chat4Mind เติบโตจากทีมสหสาขาที่ผสานการบำบัด การออกแบบ และเทคโนโลยี AI เข้าด้วยกัน.',
      linkArrow: '↗',
      linkPlaceholder: '—',
    },
  },
}

function Home() {
  const navigate = useNavigate()
  const [language, setLanguage] = useState('EN')
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const t = copy[language]

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
    { label: 'Reflections logged', value: '0' },
    { label: 'Clinicians partnered', value: '0' },
    { label: 'Avg. session uplift', value: '0%' },
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
              <img
                src={favicon}
                alt="Chat4Mind icon"
                className="h-10 w-10 rounded-2xl sm:h-12 sm:w-12"
              />
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
              {t.nav.menu}
            </button>
          </div>

          <nav className="hidden items-center gap-3 sm:flex">
            <button
              onClick={() => navigate('/chat')}
              className="rounded-full border border-violet-200 px-5 py-2 text-sm font-semibold text-violet-700 transition hover:border-violet-400 hover:text-violet-900"
            >
              {t.nav.launch}
            </button>
            <button
              onClick={() => navigate('/changelog')}
              className="rounded-full border border-violet-200 px-5 py-2 text-sm font-semibold text-violet-700 transition hover:border-violet-400 hover:text-violet-900"
            >
              {t.nav.release}
            </button>
            <button
              onClick={() => setLanguage((prev) => (prev === 'EN' ? 'TH' : 'EN'))}
              className="rounded-full border border-violet-200 px-5 py-2 text-sm font-semibold text-violet-700 transition hover:border-violet-400 hover:text-violet-900"
            >
              {language === 'EN' ? 'TH' : 'EN'}
            </button>
          </nav>
        </header>

        {mobileMenuOpen ? (
          <div className="fixed inset-0 z-40 flex items-start justify-end bg-slate-900/30 backdrop-blur-sm sm:hidden">
            <div className="hide-scrollbar flex h-full w-full max-w-xs flex-col gap-6 overflow-y-auto rounded-l-3xl border border-white/70 bg-white/95 p-6 shadow-xl shadow-violet-200">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">{t.nav.menu}</p>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full border border-violet-100 px-3 py-1 text-sm text-violet-600"
                >
                  {t.nav.close}
                </button>
              </div>
              <button
                onClick={() => {
                  navigate('/chat')
                  setMobileMenuOpen(false)
                }}
                className="rounded-full border border-violet-200 px-5 py-2 text-left text-sm font-semibold text-violet-700 transition hover:border-violet-400 hover:text-violet-900"
              >
                {t.nav.launch}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setLanguage((prev) => (prev === 'EN' ? 'TH' : 'EN'))
                }}
                className="rounded-full border border-violet-200 px-5 py-2 text-left text-sm font-semibold text-violet-700 transition hover:border-violet-400 hover:text-violet-900"
              >
                {language === 'EN' ? 'TH' : 'EN'}
              </button>
              <button
                onClick={() => {
                  navigate('/changelog')
                  setMobileMenuOpen(false)
                }}
                className="rounded-full border border-violet-200 px-5 py-2 text-left text-sm font-semibold text-violet-700 transition hover:border-violet-400 hover:text-violet-900"
              >
                {t.nav.release}
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
                {t.hero.badge}
              </span>
              <TypingText
                data-aos="fade-up"
                text={t.hero.typingText}
                typingSpeed={38}
                deletingSpeed={26}
                pauseDuration={2400}
                cursorCharacter="|"
                className="block text-balance text-3xl font-semibold leading-tight text-slate-900 sm:text-5xl"
                cursorClassName="bg-violet-600"
                textColors={['#312e81', '#5b21b6', '#0f172a']}
              />
              <p className="max-w-xl text-base leading-relaxed text-slate-600">{t.hero.paragraph}</p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  onClick={() => navigate('/chat')}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
                >
                  {t.hero.ctaPrimary}
                </button>
                <button
                  onClick={() => navigate('/changelog')}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  {t.hero.ctaSecondary}
                </button>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-6 rounded-[2rem] border border-violet-100 bg-white/80 p-6 shadow-lg shadow-violet-100 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.4em] text-slate-400">{t.metricsBlock.badge}</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {t.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl bg-white px-5 py-4 text-left shadow-sm">
                    <p className="text-2xl font-semibold text-slate-900">{metric.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">{metric.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500">{t.metricsParagraph}</p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-4 text-center">
            <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.45em] text-violet-600">
              {t.featuresSection.badge}
            </span>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{t.featuresSection.heading}</h2>
            <p className="mx-auto max-w-3xl text-base text-slate-600">{t.featuresSection.paragraph}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {t.features.map((feature) => (
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
              {t.testimonialsSection.badge}
            </span>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{t.testimonialsSection.heading}</h2>
            <p className="mx-auto max-w-3xl text-base text-slate-600">{t.testimonialsSection.paragraph}</p>
          </div>

          <div className="mt-8 grid gap-6 sm:mt-10 md:grid-cols-3">
            {t.testimonials.map((testimonial) => (
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
              <p className="text-xs uppercase tracking-[0.5em] text-white/70">{t.cta.badge}</p>
              <h3 className="text-3xl font-semibold sm:text-4xl">{t.cta.heading}</h3>
              <p className="text-sm text-white/80">{t.cta.paragraph}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate('/chat')}
                className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {t.cta.button}
              </button>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-500 px-6 py-8 text-white shadow-xl shadow-violet-200 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 text-center sm:text-left sm:items-center sm:justify-between sm:flex-row">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs uppercase tracking-[0.5em] text-white/70">{t.contributorsSection.badge}</p>
              <h3 className="text-3xl font-semibold sm:text-4xl">{t.contributorsSection.heading}</h3>
              <p className="text-sm text-white/80">{t.contributorsSection.description}</p>
            </div>
            <div className="grid w-full max-w-md gap-3 text-left sm:grid-cols-1">
              {contributors.map((person) => (
                <a
                  key={`${person.name}-${language}`}
                  href={person.href || '#'}
                  target={person.href ? '_blank' : undefined}
                  rel={person.href ? 'noreferrer' : undefined}
                  className="group flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur transition hover:border-white/40 hover:bg-white/20"
                >
                  <div>
                    <p className="text-white text-sm font-semibold">{person.name}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/70">{person.role}</p>
                  </div>
                  <span className="text-sm text-white/80 transition group-hover:translate-x-1">
                    {person.href ? t.contributorsSection.linkArrow : t.contributorsSection.linkPlaceholder}
                  </span>
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
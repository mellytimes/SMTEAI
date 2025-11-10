import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import TypingText from './ui/shadcn-io/typing-text/index.jsx'

const RELEASES = [
  {
    version: 'v1.0.0',
    date: '2025-11-10',
    highlights: [
      'Launched Chat4Mind Studio navigation shell with mood-mode switching.',
      'Added secure message confirmation pulses and login modal demo flow.',
      'Set up history capture with quick prompt re-use.',
    ],
  },
]

function ChangeLog() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      disable: 'phone',
    })
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-slate-50 to-fuchsia-100 px-6 py-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-12">
        <header className="text-center" data-aos="fade-up">
          <TypingText
            text={['Change Log', 'Updates']}
            typingSpeed={42}
            deletingSpeed={32}
            pauseDuration={2000}
            cursorCharacter="|"
            className="block text-balance text-3xl font-semibold leading-tight text-slate-900 sm:text-6xl"
            cursorClassName="bg-violet-600"
            textColors={['#4338ca', '#7c3aed', '#1f2937']}
            startOnVisible
          />
          <p
            className="mt-3 text-base text-slate-600 sm:text-lg"
            data-aos="fade-up"
            data-aos-delay="120"
          >
            Follow along as Chat4Mind evolves. Each release focuses on a calmer, more
            supportive AI experience.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/"
              className="w-full rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-600 sm:w-auto"
            >
              Back to home
            </Link>
          </div>
        </header>

        <section className="space-y-8">
          {RELEASES.map((release, index) => (
            <article
              key={release.version}
              className="rounded-3xl border border-violet-100 bg-white/90 p-6 shadow-md backdrop-blur"
              data-aos="fade-up"
              data-aos-delay={160 + index * 80}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="text-2xl font-semibold text-slate-900">
                  {release.version}
                </h2>
                <time
                  dateTime={release.date}
                  className="text-sm font-medium uppercase tracking-wide text-violet-500"
                >
                  {new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }).format(new Date(release.date))}
                </time>
              </div>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-600">
                {release.highlights.map((item) => (
                  <li key={item} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}

export default ChangeLog
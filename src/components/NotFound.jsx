import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 px-6 py-24 text-slate-100">
      <div className="flex max-w-lg flex-col items-center text-center">
        <span className="inline-flex rounded-full bg-slate-800/60 px-4 py-2 text-sm font-semibold uppercase tracking-[0.4em] text-violet-300">
          404
        </span>
        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">
          We couldn’t find that page
        </h1>
        <p className="mt-4 text-base text-slate-300">
          The URL you entered may be incorrect or the page has been moved. You
          can return home and continue exploring the experience.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="w-full rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-600 sm:w-auto"
          >
            Back to home
          </Link>
          <Link
            to="/components"
            className="w-full rounded-full border border-violet-400/60 px-6 py-3 text-sm font-semibold text-violet-200 transition hover:border-violet-300 hover:text-violet-100 sm:w-auto"
          >
            View components
          </Link>
        </div>
      </div>
    </main>
  )
}

export default NotFound
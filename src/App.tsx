function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.18),_transparent_55%),_linear-gradient(120deg,_rgba(226,232,240,0.85),_rgba(241,245,249,0.6))] text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-50 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-soft"
      >
        Skip to main content
      </a>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white/80 p-5 shadow-soft backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Field Notes
            </p>
            <h1 className="text-2xl font-semibold">Research Workspace</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative">
              <span className="sr-only">Search notes</span>
              <input
                type="search"
                placeholder="Search notes"
                className="w-56 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm shadow-inner outline-none transition focus:border-moss"
              />
            </label>
            <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5">
              New entry
            </button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 lg:flex-row">
          <aside className="w-full rounded-3xl bg-white/80 p-5 shadow-soft backdrop-blur lg:w-64">
            <p className="text-sm font-semibold text-slate-600">Collections</p>
            <nav className="mt-4 space-y-2">
              {['Overview', 'Projects', 'References', 'Journal', 'Archive'].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <span>{item}</span>
                    <span className="text-xs text-slate-400">12</span>
                  </a>
                ),
              )}
            </nav>
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-3 text-xs text-slate-500">
              Tip: Use the sidebar to jump between writing surfaces.
            </div>
          </aside>

          <main
            id="main"
            tabIndex={-1}
            className="flex-1 rounded-3xl bg-white/90 p-6 shadow-soft backdrop-blur"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Today
                </p>
                <h2 className="text-xl font-semibold">Day 1 - Setup + Baseline</h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                  Live
                </span>
                <span>Feb 11, 2026</span>
              </div>
            </div>

            <section className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                'Tailwind configured with base tokens',
                'App shell layout scaffolded',
                'Keyboard navigation baseline',
                'Docs captured for day one',
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm"
                >
                  <p className="text-sm font-semibold text-slate-700">{item}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Keep iterating. This is the starting point for future days.
                  </p>
                </article>
              ))}
            </section>

            <section className="mt-6 rounded-2xl bg-slate-950 px-5 py-4 text-sm text-slate-100">
              <p className="font-semibold">Next up</p>
              <p className="mt-2 text-slate-300">
                Add routing, connect data, and define component boundaries.
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App

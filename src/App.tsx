import { useMemo, useState } from 'react'
import { Button } from './components/Button'
import { Card } from './components/Card'
import { Input } from './components/Input'
import { Modal } from './components/Modal'
import { Skeleton } from './components/Skeleton'
import { useToast } from './components/toastContext'

const collections = ['Overview', 'Projects', 'References', 'Journal', 'Archive']

const notes = [
  {
    id: 'n-1',
    title: 'Baseline layout review',
    status: 'In review',
    tag: 'Design',
  },
  {
    id: 'n-2',
    title: 'Tailwind tokens refresh',
    status: 'In progress',
    tag: 'System',
  },
  {
    id: 'n-3',
    title: 'Routing plan draft',
    status: 'Planned',
    tag: 'Architecture',
  },
  {
    id: 'n-4',
    title: 'Copy audit summary',
    status: 'Done',
    tag: 'Content',
  },
]

function App() {
  const [activeCollection, setActiveCollection] = useState(collections[0])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return notes.filter((note) => {
      const matchesQuery = normalizedQuery
        ? note.title.toLowerCase().includes(normalizedQuery)
        : true
      const matchesStatus = statusFilter === 'All' ? true : note.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [query, statusFilter])

  const statusCounts = useMemo(() => {
    return notes.reduce(
      (acc, note) => {
        acc.total += 1
        acc[note.status] = (acc[note.status] ?? 0) + 1
        return acc
      },
      { total: 0 } as Record<string, number>,
    )
  }, [])

  const handleToast = () => {
    addToast({
      title: 'Toast queued',
      description: 'You can wire this to real events later.',
      tone: 'success',
    })
  }

  const simulateLoad = () => {
    setIsLoading(true)
    window.setTimeout(() => setIsLoading(false), 1600)
  }

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
            <label className="relative w-56">
              <span className="sr-only">Search notes</span>
              <Input
                type="search"
                placeholder="Search notes"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <Button onClick={() => setIsModalOpen(true)}>New entry</Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 lg:flex-row">
          <aside className="w-full rounded-3xl bg-white/80 p-5 shadow-soft backdrop-blur lg:w-64">
            <p className="text-sm font-semibold text-slate-600">Collections</p>
            <nav className="mt-4 space-y-2">
              {collections.map((item) => {
                const isActive = item === activeCollection
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveCollection(item)}
                    className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm transition ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item}</span>
                    <span
                      className={`text-xs ${
                        isActive ? 'text-slate-200' : 'text-slate-400'
                      }`}
                    >
                      12
                    </span>
                  </button>
                )
              })}
            </nav>
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-3 text-xs text-slate-500">
              Tip: Use the sidebar to jump between writing surfaces.
            </div>
          </aside>

          <main
            id="main"
            tabIndex={-1}
            className="flex-1 space-y-6 rounded-3xl bg-white/90 p-6 shadow-soft backdrop-blur"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Today
                </p>
                <h2 className="text-xl font-semibold">Day 2 - UI Primitives Demo</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Active: {activeCollection} · {filteredNotes.length} of{' '}
                  {statusCounts.total} notes
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={simulateLoad}>
                  Toggle loading
                </Button>
                <Button variant="ghost" onClick={handleToast}>
                  Fire toast
                </Button>
              </div>
            </div>

            <Card>
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-[220px] flex-1">
                  <label className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Status filter
                  </label>
                  <div className="mt-2">
                    <Input
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                      list="status-options"
                    />
                    <datalist id="status-options">
                      {['All', 'In review', 'In progress', 'Planned', 'Done'].map(
                        (status) => (
                          <option key={status} value={status} />
                        ),
                      )}
                    </datalist>
                  </div>
                </div>
                <div className="min-w-[220px] flex-1">
                  <label className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Quick note
                  </label>
                  <div className="mt-2 flex gap-2">
                    <Input placeholder="Capture a quick thought" />
                    <Button variant="outline" size="sm">
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
              <Card>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Notes list
                  </h3>
                  <span className="text-xs text-slate-400">
                    Derived from filters
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-slate-700">{note.title}</p>
                        <p className="text-xs text-slate-400">
                          {note.tag} · {note.status}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Open
                      </Button>
                    </div>
                  ))}
                  {filteredNotes.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No notes match the current filters.
                    </p>
                  ) : null}
                </div>
              </Card>

              <div className="space-y-4">
                <Card>
                  <h3 className="text-sm font-semibold text-slate-700">Toast demo</h3>
                  <p className="mt-2 text-xs text-slate-500">
                    Trigger toasts using the shared provider.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" onClick={handleToast}>
                      Success
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        addToast({
                          title: 'Heads up',
                          description: 'This is a neutral message.',
                        })
                      }
                    >
                      Neutral
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        addToast({
                          title: 'Something failed',
                          description: 'Try again in a moment.',
                          tone: 'error',
                        })
                      }
                    >
                      Error
                    </Button>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-sm font-semibold text-slate-700">
                    Loading skeleton
                  </h3>
                  <p className="mt-2 text-xs text-slate-500">
                    Used while async content is loading.
                  </p>
                  <div className="mt-4 space-y-3">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-20 w-full" />
                      </>
                    ) : (
                      <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm text-slate-600">
                        Ready. Click "Toggle loading" to preview skeletons.
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </section>
          </main>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        title="Create new entry"
        onClose={() => setIsModalOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Save entry</Button>
          </div>
        }
      >
        Use this shell to add forms later. It already handles Escape and backdrop
        clicks.
      </Modal>
    </div>
  )
}

export default App

import { useMemo, useState } from "react";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Modal } from "../components/Modal";
import { Skeleton } from "../components/Skeleton";
import { useToast } from "../state/uiStore";

const collections = ["Overview", "Projects", "References", "Journal", "Archive"];

const notes = [
  {
    id: "n-1",
    title: "Baseline layout review",
    status: "In review",
    tag: "Design",
  },
  {
    id: "n-2",
    title: "Tailwind tokens refresh",
    status: "In progress",
    tag: "System",
  },
  {
    id: "n-3",
    title: "Routing plan draft",
    status: "Planned",
    tag: "Architecture",
  },
  {
    id: "n-4",
    title: "Copy audit summary",
    status: "Done",
    tag: "Content",
  },
];

export default function Dashboard() {
  const [activeCollection, setActiveCollection] = useState(collections[0]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return notes.filter((note) => {
      const matchesQuery = normalizedQuery
        ? note.title.toLowerCase().includes(normalizedQuery)
        : true;
      const matchesStatus = statusFilter === "All" ? true : note.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  const statusCounts = useMemo(() => {
    return notes.reduce(
      (acc, note) => {
        acc.total += 1;
        acc[note.status] = (acc[note.status] ?? 0) + 1;
        return acc;
      },
      { total: 0 } as Record<string, number>,
    );
  }, []);

  const handleToast = () => {
    addToast({
      title: "Toast queued",
      description: "You can wire this to real events later.",
      tone: "success",
    });
  };

  const simulateLoad = () => {
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 1600);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white/80 p-5 shadow-soft">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Today</p>
          <h2 className="text-2xl font-semibold">React Demo</h2>
          <p className="mt-2 text-sm text-slate-500">
            Active: {activeCollection} - {filteredNotes.length} of {statusCounts.total} notes
          </p>
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
          <Button
            onClick={() => setIsModalOpen(true)}
            aria-haspopup="dialog"
            aria-controls="new-entry-modal"
          >
            New entry
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl bg-white/80 p-5 shadow-soft">
          <p className="text-sm font-semibold text-slate-600">Collections</p>
          <nav className="mt-4 space-y-2" aria-label="Collections">
            {collections.map((item) => {
              const isActive = item === activeCollection;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCollection(item)}
                  className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{item}</span>
                  <span className={`text-xs ${isActive ? "text-slate-200" : "text-slate-400"}`}>
                    12
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-3 text-xs text-slate-500">
            Tip: Use the sidebar to jump between writing surfaces.
          </div>
        </aside>

        <section className="space-y-6 rounded-3xl bg-white/90 p-6 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</p>
              <h3 className="text-xl font-semibold">Notes overview</h3>
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
            <div className="grid gap-4 md:grid-cols-2">
              <div>
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
                    {["All", "In review", "In progress", "Planned", "Done"].map((status) => (
                      <option key={status} value={status} />
                    ))}
                  </datalist>
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Quick note
                </label>
                <div className="mt-2 flex gap-2">
                  <Input placeholder="Capture a quick thought" />
                  <Button variant="outline" size="sm">
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={`note-skeleton-${index}`} className="h-16" />
                ))
              : filteredNotes.map((note) => (
                  <Card key={note.id} className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{note.title}</p>
                      <p className="text-xs text-slate-500">{note.tag}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                      {note.status}
                    </span>
                  </Card>
                ))}
          </div>
        </section>
      </div>

      <Modal
        open={isModalOpen}
        id="new-entry-modal"
        title="New entry"
        onClose={() => setIsModalOpen(false)}
        footer={<Button onClick={() => setIsModalOpen(false)}>Save entry</Button>}
      >
        Add a title and summary, then wire this modal to your API.
      </Modal>
    </div>
  );
}
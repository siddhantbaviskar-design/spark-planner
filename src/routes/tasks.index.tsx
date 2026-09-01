import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Filter, Plus, Search } from "lucide-react";
import { EmptyState, PhoneShell, ScreenHeader } from "@/components/axon/PhoneShell";
import { useAxon } from "@/lib/axon-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks/")({
  head: () => ({
    meta: [
      { title: "Tasks — AXONADHD" },
      { name: "description", content: "A calm task list with small steps, gentle priorities and no guilt." },
      { property: "og:title", content: "Tasks — AXONADHD" },
      { property: "og:description", content: "Today, upcoming and completed tasks, broken into doable steps." },
    ],
  }),
  component: Tasks,
});

const TABS = ["Today", "Upcoming", "Completed"] as const;

function Tasks() {
  const { tasks, toggleTask, addTask } = useAxon();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Today");
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const filtered = tasks
    .filter((t) => (tab === "Completed" ? t.done : !t.done && t.when === (tab === "Today" ? "today" : "upcoming")))
    .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));

  const priorityTone = {
    important: "bg-primary-soft text-primary",
    focus: "bg-health/20 text-health-foreground",
    calm: "bg-muted text-muted-foreground",
  } as const;

  return (
    <PhoneShell>
      <ScreenHeader
        title="Tasks"
        subtitle="Small steps beat big plans."
        right={
          <button onClick={() => setAdding((v) => !v)} aria-label="Add task" className="press rounded-full bg-gradient-primary p-2 text-primary-foreground">
            <Plus className="h-4 w-4" />
          </button>
        }
      />

      <div className="px-5">
        <div className="flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button aria-label="Filter" className="press rounded-2xl border border-border bg-card px-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {adding && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim()) return;
              addTask(title.trim(), 15);
              setTitle("");
              setAdding(false);
            }}
            className="animate-rise mt-3 flex gap-2"
          >
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs doing?"
              className="flex-1 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button className="press rounded-2xl bg-gradient-primary px-4 text-sm font-semibold text-primary-foreground">
              Add
            </button>
          </form>
        )}

        <div className="mt-4 flex rounded-2xl bg-muted p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "press flex-1 rounded-xl py-2 text-xs font-semibold transition-colors",
                tab === t ? "bg-card text-foreground shadow-card" : "text-muted-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-2.5">
          {filtered.length === 0 && (
            <EmptyState title="Nothing here yet." body="Let's start with one small step." />
          )}
          {filtered.map((t) => (
            <div key={t.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
              <button
                onClick={() => toggleTask(t.id)}
                aria-label={`Toggle ${t.title}`}
                className={cn(
                  "press flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  t.done ? "border-primary bg-primary text-primary-foreground" : "border-border",
                )}
              >
                {t.done && <Check className="h-3.5 w-3.5" />}
              </button>
              <Link to="/tasks/$taskId" params={{ taskId: t.id }} className="flex-1">
                <p className={cn("text-sm font-semibold", t.done && "text-muted-foreground line-through")}>{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.minutes} min</p>
              </Link>
              <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase", priorityTone[t.priority])}>
                {t.priority}
              </span>
            </div>
          ))}
        </div>
        <div className="h-6" />
      </div>
    </PhoneShell>
  );
}

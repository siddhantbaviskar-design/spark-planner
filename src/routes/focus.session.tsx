import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { PhoneShell, PrimaryButton, SoftButton } from "@/components/axon/PhoneShell";
import { distractionReasons } from "@/lib/axon-data";

export const Route = createFileRoute("/focus/session")({
  validateSearch: z.object({
    task: z.string().default("Finish presentation"),
    minutes: z.number().default(25),
  }),
  head: () => ({
    meta: [
      { title: "Focus mode — AXONADHD" },
      { name: "description", content: "A distraction-free full-screen timer. One thing at a time." },
      { property: "og:title", content: "Focus mode — AXONADHD" },
      { property: "og:description", content: "Calm, full-screen focus with supportive recovery when you drift." },
    ],
  }),
  component: FocusSession,
});

function FocusSession() {
  const { task, minutes } = Route.useSearch();
  const navigate = useNavigate();
  const [left, setLeft] = useState(minutes * 60);
  const [running, setRunning] = useState(true);
  const [distracted, setDistracted] = useState(false);
  const [tip, setTip] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running || done) return;
    const id = setInterval(() => setLeft((l) => (l <= 1 ? (setDone(true), 0) : l - 1)), 1000);
    return () => clearInterval(id);
  }, [running, done]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const pct = 1 - left / (minutes * 60);

  if (done) {
    return (
      <PhoneShell bare>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-screen px-8 text-center sm:min-h-[860px]">
          <p className="text-4xl">🎉</p>
          <h1 className="mt-4 text-2xl font-semibold">Nice work!</h1>
          <p className="mt-1 text-sm text-muted-foreground">{task} — session complete.</p>
          <p className="mt-5 rounded-full bg-primary-soft px-4 py-1.5 text-xs font-semibold text-primary">
            +10 Focus points
          </p>
          <div className="mt-8 w-full space-y-2.5">
            <Link to="/tasks">
              <PrimaryButton>Next task</PrimaryButton>
            </Link>
            <Link to="/focus/reset">
              <SoftButton>Take a break</SoftButton>
            </Link>
          </div>
        </div>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell bare>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-primary px-8 text-primary-foreground sm:min-h-[860px]">
        <p className="text-sm font-medium text-primary-foreground/80">{task}</p>
        <div className="animate-breathe relative mt-8 flex h-64 w-64 items-center justify-center rounded-full bg-primary-foreground/10 ring-1 ring-primary-foreground/25">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" strokeWidth="3" className="stroke-primary-foreground/20" />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              className="stroke-primary-foreground"
              strokeDasharray={289}
              strokeDashoffset={289 * (1 - pct)}
            />
          </svg>
          <span className="text-5xl font-semibold tabular-nums">
            {mm}:{ss}
          </span>
        </div>
        <p className="mt-8 text-sm text-primary-foreground/80">One thing at a time.</p>

        <div className="mt-10 w-full space-y-2.5">
          <button
            onClick={() => setRunning((r) => !r)}
            className="press w-full rounded-2xl bg-primary-foreground/95 py-3.5 text-sm font-semibold text-primary"
          >
            {running ? "Pause" : "Resume"}
          </button>
          <button
            onClick={() => setDistracted(true)}
            className="press w-full rounded-2xl border border-primary-foreground/35 py-3 text-sm font-semibold"
          >
            I'm distracted
          </button>
          <button onClick={() => setDone(true)} className="press w-full py-2 text-sm font-semibold text-primary-foreground/80">
            Done
          </button>
        </div>
        <button onClick={() => navigate({ to: "/focus" })} className="mt-6 text-xs text-primary-foreground/60">
          Leave focus mode
        </button>
      </div>

      {distracted && (
        <div className="absolute inset-0 z-50 flex items-end">
          <button aria-label="Close" onClick={() => setDistracted(false)} className="absolute inset-0 bg-foreground/40" />
          <div className="animate-rise relative w-full rounded-t-3xl bg-card p-6 pb-8 shadow-float">
            <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-border" />
            <h2 className="text-xl font-semibold">That's okay. Let's get you back.</h2>
            <p className="mt-1 text-sm text-muted-foreground">What pulled you away?</p>
            <div className="mt-4 space-y-2">
              {distractionReasons.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setTip(r.tip)}
                  className="press w-full rounded-2xl border border-border bg-background px-4 py-3 text-left text-sm font-medium"
                >
                  {r.label}
                </button>
              ))}
            </div>
            {tip && <p className="mt-4 rounded-2xl bg-primary-soft p-4 text-sm text-accent-foreground">{tip}</p>}
            <PrimaryButton
              className="mt-5"
              onClick={() => {
                setDistracted(false);
                setTip(null);
                setRunning(true);
              }}
            >
              Back to focus
            </PrimaryButton>
          </div>
        </div>
      )}
    </PhoneShell>
  );
}

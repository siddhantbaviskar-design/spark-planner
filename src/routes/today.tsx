import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  Bell,
  BookOpen,
  ChevronRight,
  Dumbbell,
  HeartPulse,
  Lightbulb,
  Lock,
  Pill,
  Play,
  Smile,
  Timer,
  Wind,
  Zap,
} from "lucide-react";
import { Card, PhoneShell, PrimaryButton, ProgressRing, SectionTitle, SoftButton } from "@/components/axon/PhoneShell";
import { useAxon, useTodayProgress } from "@/lib/axon-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/today")({
  head: () => ({
    meta: [
      { title: "Today — AXONADHD" },
      { name: "description", content: "One step at a time: your next action, progress, health check and focus for today." },
      { property: "og:title", content: "Today — AXONADHD" },
      { property: "og:description", content: "See what to do right now, and nothing more." },
    ],
  }),
  component: Today,
});

function Today() {
  const axon = useAxon();
  const { done, total, items } = useTodayProgress();
  const [stuckOpen, setStuckOpen] = useState(false);

  const nextTask = axon.tasks.find((t) => t.when === "today" && !t.done);
  const whatNow = !axon.medicationTaken
    ? { title: "Take your morning medication", meta: "9:00 AM · 2 min", cta: "Mark as done", action: () => axon.set("medicationTaken", true) }
    : !axon.healthChecked
      ? { title: "Quick health check", meta: "Now · 1 min", cta: "Check now", action: () => axon.set("healthChecked", true) }
      : nextTask
        ? { title: nextTask.title, meta: `Today · ${nextTask.minutes} min`, cta: "Start task", action: () => axon.toggleTask(nextTask.id) }
        : { title: "You're all caught up", meta: "Enjoy the space", cta: "Take a break", action: () => {} };

  return (
    <PhoneShell>
      <header className="px-5 pb-2 pt-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Tuesday, Sept 1</p>
            <h1 className="mt-1 text-[26px] font-semibold tracking-tight">Good morning, {axon.name} 👋</h1>
            <p className="mt-1 text-sm text-muted-foreground">Let's take today one step at a time.</p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Link to="/notifications" aria-label="Notifications" className="press rounded-full border border-border bg-card p-2">
              <Bell className="h-4 w-4" />
            </Link>
            <Link to="/profile" aria-label="Profile" className="press flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
              A
            </Link>
          </div>
        </div>
      </header>

      <main className="px-5">
        <div className="mt-5 rounded-[2rem] bg-gradient-primary p-6 text-primary-foreground shadow-float">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/75">What now?</p>
          <h2 className="mt-3 text-[24px] font-semibold leading-snug">{whatNow.title}</h2>
          <p className="mt-2 text-sm text-primary-foreground/80">{whatNow.meta}</p>
          <button
            onClick={whatNow.action}
            className="press mt-5 w-full rounded-2xl bg-primary-foreground/95 px-5 py-3.5 text-sm font-semibold text-primary"
          >
            {whatNow.cta}
          </button>
        </div>

        <SectionTitle>Today's progress</SectionTitle>
        <Card className="flex items-center gap-5">
          <ProgressRing value={(done / total) * 100}>
            {done}/{total}
          </ProgressRing>
          <div className="flex-1">
            <p className="text-sm font-semibold">{done} of {total} completed</p>
            <p className="mt-1 text-xs text-muted-foreground">Every step counts. No rush.</p>
            <div className="mt-3 flex gap-1.5">
              {items.map((d, i) => (
                <span key={i} className={cn("h-2 flex-1 rounded-full", d ? "bg-primary" : "bg-muted")} />
              ))}
            </div>
          </div>
        </Card>

        <SectionTitle action={<Link to="/health" className="text-xs font-semibold text-primary">Health</Link>}>
          Quick health check
        </SectionTitle>
        <div className="space-y-2.5">
          <QuickHealth icon={HeartPulse} label="Vitals" value="72 BPM" cta="Check" to="/health/vitals" tone="health" />
          <QuickHealth icon={Smile} label="Mood" value={axon.mood} cta="Update" to="/health/mood" tone="success" />
          <QuickHealth icon={Zap} label="Energy" value={`${axon.energy}/10`} cta="Update" to="/health/mood" tone="activity" />
        </div>

        <SectionTitle>Focus & reset</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/focus" className="press rounded-3xl bg-gradient-soft p-5">
            <Timer className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-semibold leading-snug">Start a 10-minute focus session</p>
          </Link>
          <Link to="/focus/reset" className="press rounded-3xl border border-border bg-card p-5">
            <Wind className="h-5 w-5 text-health-foreground" />
            <p className="mt-3 text-sm font-semibold leading-snug">Take a 2-minute breathing break</p>
          </Link>
        </div>

        <SectionTitle>Today's movement</SectionTitle>
        <Card className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-activity/25 text-activity-foreground">
            <Dumbbell className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold">20 min walk</p>
            <p className="text-xs text-muted-foreground">{axon.movementMinutes} / 20 min</p>
          </div>
          <Link to="/health/exercise" className="press rounded-xl bg-primary-soft px-3 py-2 text-xs font-semibold text-primary">
            Start
          </Link>
        </Card>

        <SectionTitle action={<Link to="/learn" className="text-xs font-semibold text-primary">Learn & Grow</Link>}>
          Learn & grow
        </SectionTitle>
        {!axon.watched.includes("understanding-adhd") ? (
          <LearnCard
            title="Understanding ADHD"
            meta="3 min · FREE"
            cta="Watch Video"
            to="/learn/understanding-adhd"
            icon={Play}
          />
        ) : (
          <LearnCard
            title="Managing Time Blindness"
            meta="5 min · PREMIUM"
            cta={axon.subscribed ? "Watch Video" : "Unlock"}
            to="/learn/time-blindness"
            icon={axon.subscribed ? Play : Lock}
          />
        )}

        <SectionTitle>Feeling stuck?</SectionTitle>
        <Card>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Lightbulb className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Feeling stuck?</p>
              <p className="text-xs text-muted-foreground">We'll help you break it down.</p>
            </div>
          </div>
          <PrimaryButton className="mt-4" onClick={() => setStuckOpen(true)}>
            I'm Stuck
          </PrimaryButton>
        </Card>

        <div className="h-6" />
      </main>

      {stuckOpen && <StuckSheet onClose={() => setStuckOpen(false)} />}
    </PhoneShell>
  );
}

function QuickHealth({
  icon: Icon,
  label,
  value,
  cta,
  to,
  tone,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  cta: string;
  to: string;
  tone: "health" | "success" | "activity";
}) {
  const tones = {
    health: "bg-health/20 text-health-foreground",
    success: "bg-success/20 text-success-foreground",
    activity: "bg-activity/25 text-activity-foreground",
  };
  return (
    <Link to={to} className="press flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5">
      <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex-1">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
      <span className="text-xs font-semibold text-primary">{cta}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

function LearnCard({
  title,
  meta,
  cta,
  to,
  icon: Icon,
}: {
  title: string;
  meta: string;
  cta: string;
  to: string;
  icon: typeof BookOpen;
}) {
  return (
    <Link to={to} className="press flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-card">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-soft text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{meta}</p>
      </div>
      <span className="rounded-xl bg-primary-soft px-3 py-2 text-xs font-semibold text-primary">{cta}</span>
    </Link>
  );
}

function StuckSheet({ onClose }: { onClose: () => void }) {
  const [what, setWhat] = useState("");
  const [broken, setBroken] = useState(false);
  const steps = ["Pick up clothes", "Put clothes in basket", "Clear desk", "Put things away"];

  return (
    <div className="absolute inset-0 z-50 flex items-end">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]" />
      <div className="animate-rise relative w-full rounded-t-3xl border-t border-border bg-card p-6 pb-8 shadow-float">
        <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-border" />
        {!broken ? (
          <>
            <h2 className="text-xl font-semibold">What are you trying to do?</h2>
            <p className="mt-1 text-sm text-muted-foreground">No wrong answers. Just name it.</p>
            <input
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              placeholder="I need to clean my room"
              className="mt-4 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <PrimaryButton className="mt-4" onClick={() => setBroken(true)}>
              Break it down
            </PrimaryButton>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">Let's make this smaller.</h2>
            <p className="mt-1 text-sm text-muted-foreground">{what || "I need to clean my room"}</p>
            <ol className="mt-4 space-y-2">
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3 text-sm font-medium">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-card text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <PrimaryButton className="mt-5" onClick={onClose}>
              Start first step
            </PrimaryButton>
            <SoftButton className="mt-2" onClick={onClose}>
              Not now
            </SoftButton>
          </>
        )}
      </div>
    </div>
  );
}

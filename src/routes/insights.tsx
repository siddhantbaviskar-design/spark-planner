import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Lightbulb, Sparkles, Stethoscope } from "lucide-react";
import { Card, PhoneShell, PrimaryButton, ProgressRing, ScreenHeader, SectionTitle } from "@/components/axon/PhoneShell";
import { weeklyFocus } from "@/lib/axon-data";
import { useAxon } from "@/lib/axon-store";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Your Progress — AXONADHD" },
      { name: "description", content: "Friendly weekly insights on focus, tasks and patterns — never clinical." },
      { property: "og:title", content: "Your Progress — AXONADHD" },
      { property: "og:description", content: "Focus hours, completed tasks, best focus time and gentle pattern insights." },
    ],
  }),
  component: Insights,
});

function Insights() {
  const { tasks, focusPoints } = useAxon();
  const completed = tasks.filter((t) => t.done).length + 37;
  const max = Math.max(...weeklyFocus.map((w) => w.minutes));

  return (
    <PhoneShell>
      <ScreenHeader title="Your Progress" subtitle="A calm look at how your week is going." />
      <div className="px-5">
        <Card className="flex items-center gap-5 bg-gradient-soft">
          <ProgressRing value={72} size={84}>
            72%
          </ProgressRing>
          <div>
            <p className="text-sm font-semibold">Focus — 4h 32m</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-success-foreground">
              <ArrowUpRight className="h-3.5 w-3.5" /> 18% from last week
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{focusPoints} focus points earned</p>
          </div>
        </Card>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Stat label="Tasks completed" value={String(completed)} />
          <Stat label="Avg focus session" value="22 min" />
          <Stat label="Best focus time" value="10 AM–12 PM" />
          <Stat label="Movement" value="4 of 7 days" />
        </div>

        <SectionTitle>This week's focus</SectionTitle>
        <Card>
          <div className="flex h-32 items-end justify-between gap-2">
            {weeklyFocus.map((w) => (
              <div key={w.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-xl bg-gradient-primary transition-all"
                  style={{ height: `${(w.minutes / max) * 100}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{w.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <SectionTitle>A pattern we noticed</SectionTitle>
        <Card>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Lightbulb className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold">
            You tend to complete more tasks when they're broken into smaller steps.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your mornings are also your strongest focus window.
          </p>
          <Link to="/learn" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            See your insights <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Card>

        <SectionTitle>Check-in recommended</SectionTitle>
        <Card className="bg-gradient-soft">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card text-primary">
            <Stethoscope className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold">Your recent patterns suggest it may be a good time to review your progress.</p>
          <p className="mt-1 text-xs text-muted-foreground">Nothing is wrong — this is just a good moment to connect.</p>
          <Link to="/doctor" className="mt-4 block">
            <PrimaryButton>Review Now</PrimaryButton>
          </Link>
        </Card>

        <SectionTitle>Keep going</SectionTitle>
        <Link to="/learn" className="press flex items-center gap-3 rounded-3xl border border-border bg-card p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-soft text-primary">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Learning progress</p>
            <p className="text-xs text-muted-foreground">Pick up your next short lesson.</p>
          </div>
        </Link>
        <div className="h-6" />
      </div>
    </PhoneShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

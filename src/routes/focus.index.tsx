import { createFileRoute, Link } from "@tanstack/react-router";
import { Timer } from "lucide-react";
import { Card, PhoneShell, ScreenHeader, SectionTitle } from "@/components/axon/PhoneShell";
import { focusHistory } from "@/lib/axon-data";

export const Route = createFileRoute("/focus/")({
  head: () => ({
    meta: [
      { title: "Focus — AXONADHD" },
      { name: "description", content: "Choose a focus session length and work one thing at a time." },
      { property: "og:title", content: "Focus — AXONADHD" },
      { property: "og:description", content: "Quick, standard or deep focus sessions with a calm full-screen timer." },
    ],
  }),
  component: Focus,
});

const OPTIONS = [
  { label: "Quick Focus", minutes: 10, hint: "A gentle start" },
  { label: "Focus", minutes: 25, hint: "The classic block" },
  { label: "Deep Focus", minutes: 45, hint: "For big pieces" },
  { label: "Custom", minutes: 15, hint: "Your own length" },
];

function Focus() {
  return (
    <PhoneShell>
      <ScreenHeader title="Focus" subtitle="Choose how you want to focus." />
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {OPTIONS.map((o) => (
            <Link
              key={o.label}
              to="/focus/session"
              search={{ task: "Finish presentation", minutes: o.minutes }}
              className="press rounded-3xl border border-border bg-card p-5 shadow-card"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-soft text-primary">
                <Timer className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-semibold">{o.label}</p>
              <p className="text-xs text-muted-foreground">{o.minutes} min · {o.hint}</p>
            </Link>
          ))}
        </div>

        <SectionTitle>Recent sessions</SectionTitle>
        <Card className="divide-y divide-border p-0">
          {focusHistory.map((f) => (
            <div key={f.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-semibold">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.when}</p>
              </div>
              <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                {f.minutes} min
              </span>
            </div>
          ))}
        </Card>

        <SectionTitle>Reset</SectionTitle>
        <Link to="/focus/reset" className="press block rounded-3xl bg-gradient-soft p-5">
          <p className="text-sm font-semibold">Take a 2-minute breathing break</p>
          <p className="mt-1 text-xs text-muted-foreground">Slow the day down before the next step.</p>
        </Link>
        <div className="h-6" />
      </div>
    </PhoneShell>
  );
}

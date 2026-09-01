import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ChevronRight, Dumbbell, HeartPulse, Moon, Pill, Smile, Stethoscope, TrendingUp, Zap } from "lucide-react";
import { Card, PhoneShell, ScreenHeader, SectionTitle } from "@/components/axon/PhoneShell";
import { useAxon } from "@/lib/axon-store";

export const Route = createFileRoute("/health/")({
  head: () => ({
    meta: [
      { title: "Your Health — AXONADHD" },
      { name: "description", content: "Vitals, medication, exercise, mood, energy and sleep in one calm place." },
      { property: "og:title", content: "Your Health — AXONADHD" },
      { property: "og:description", content: "Track. Reflect. Improve. A gentle health overview, never clinical." },
    ],
  }),
  component: Health,
});

function Health() {
  const { mood, energy, medicationTaken, movementMinutes } = useAxon();

  const rows = [
    { to: "/health/vitals", icon: HeartPulse, label: "Vitals", value: "72 BPM" },
    { to: "/health/medication", icon: Pill, label: "Medication", value: medicationTaken ? "Taken" : "Upcoming 9:00 AM" },
    { to: "/health/exercise", icon: Dumbbell, label: "Exercise", value: `${movementMinutes} / 20 min` },
    { to: "/health/mood", icon: Smile, label: "Mood", value: mood },
    { to: "/health/mood", icon: Zap, label: "Energy", value: `${energy}/10` },
    { to: "/health/vitals", icon: Moon, label: "Sleep", value: "7h 10m" },
  ] as const;

  return (
    <PhoneShell>
      <ScreenHeader title="Your Health" subtitle="Track. Reflect. Improve." />
      <div className="px-5">
        <Card className="flex items-center gap-4 bg-gradient-soft">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-primary">
            <Activity className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Your week looks steady</p>
            <p className="text-xs text-muted-foreground">Nothing here is a diagnosis — just your own patterns.</p>
          </div>
        </Card>

        <SectionTitle>Overview</SectionTitle>
        <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
          {rows.map((r) => (
            <Link key={r.label} to={r.to} className="press flex items-center gap-3 px-4 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <r.icon className="h-4 w-4" />
              </span>
              <span className="flex-1 text-sm font-medium">{r.label}</span>
              <span className="text-sm text-muted-foreground">{r.value}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        <SectionTitle>Trends</SectionTitle>
        <Link to="/insights" className="press flex items-center gap-3 rounded-3xl border border-border bg-card p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-health/20 text-health-foreground">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold">Health trends</p>
            <p className="text-xs text-muted-foreground">See how your week compares.</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <SectionTitle>Care</SectionTitle>
        <Link to="/doctor" className="press flex items-center gap-3 rounded-3xl border border-border bg-card p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Stethoscope className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold">Dr. Dodini</p>
            <p className="text-xs text-muted-foreground">Review progress or book a consultation.</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <div className="h-6" />
      </div>
    </PhoneShell>
  );
}

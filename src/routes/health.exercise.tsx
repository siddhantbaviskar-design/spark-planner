import { createFileRoute } from "@tanstack/react-router";
import { Dumbbell, Footprints } from "lucide-react";
import { Card, PhoneShell, PrimaryButton, ProgressRing, ScreenHeader, SectionTitle } from "@/components/axon/PhoneShell";
import { useAxon } from "@/lib/axon-store";

export const Route = createFileRoute("/health/exercise")({
  head: () => ({
    meta: [
      { title: "Exercise — AXONADHD" },
      { name: "description", content: "Track today's movement, your weekly activity and a gentle exercise goal." },
      { property: "og:title", content: "Exercise — AXONADHD" },
      { property: "og:description", content: "A 20-minute walk counts. Track movement without pressure." },
    ],
  }),
  component: Exercise,
});

const WEEK = [20, 0, 25, 30, 0, 40, 10];

function Exercise() {
  const { movementMinutes, set } = useAxon();
  const pct = Math.min(100, (movementMinutes / 20) * 100);

  return (
    <PhoneShell>
      <ScreenHeader title="Exercise" subtitle="Movement helps focus. Small counts." back="/health" />
      <div className="px-5">
        <Card className="flex items-center gap-5">
          <ProgressRing value={pct} size={84}>
            {movementMinutes}m
          </ProgressRing>
          <div>
            <p className="text-sm font-semibold">20 min walk</p>
            <p className="text-xs text-muted-foreground">{movementMinutes} / 20 min today</p>
            <p className="mt-2 text-xs text-muted-foreground">Goal: 20 min / day</p>
          </div>
        </Card>

        <PrimaryButton className="mt-4" onClick={() => set("movementMinutes", Math.min(20, movementMinutes + 5))}>
          {movementMinutes >= 20 ? "Goal reached" : "Start Activity (+5 min)"}
        </PrimaryButton>

        <SectionTitle>This week</SectionTitle>
        <Card>
          <div className="flex h-24 items-end gap-2">
            {WEEK.map((m, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-activity/60" style={{ height: `${(m / 40) * 100}%` }} />
                <span className="text-[10px] text-muted-foreground">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <SectionTitle>History</SectionTitle>
        <Card className="divide-y divide-border p-0">
          {[
            { icon: Footprints, label: "Evening walk", meta: "Yesterday · 25 min" },
            { icon: Dumbbell, label: "Stretch session", meta: "Wednesday · 10 min" },
          ].map((h) => (
            <div key={h.label} className="flex items-center gap-3 px-5 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-activity/25 text-activity-foreground">
                <h.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">{h.label}</p>
                <p className="text-xs text-muted-foreground">{h.meta}</p>
              </div>
            </div>
          ))}
        </Card>
        <div className="h-6" />
      </div>
    </PhoneShell>
  );
}

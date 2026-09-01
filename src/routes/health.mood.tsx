import { createFileRoute } from "@tanstack/react-router";
import { Card, PhoneShell, ScreenHeader, SectionTitle } from "@/components/axon/PhoneShell";
import { useAxon } from "@/lib/axon-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/health/mood")({
  head: () => ({
    meta: [
      { title: "Mood & Energy — AXONADHD" },
      { name: "description", content: "A two-tap mood and energy check-in with simple weekly trends." },
      { property: "og:title", content: "Mood & Energy — AXONADHD" },
      { property: "og:description", content: "How are you feeling? Log it in seconds." },
    ],
  }),
  component: MoodPage,
});

const MOODS = ["Good", "Okay", "Low", "Overwhelmed", "Low energy"] as const;
const EMOJI: Record<string, string> = {
  Good: "🙂",
  Okay: "😐",
  Low: "🙁",
  Overwhelmed: "😵‍💫",
  "Low energy": "🥱",
};
const WEEK = [4, 3, 5, 2, 4, 5, 4];

function MoodPage() {
  const { mood, energy, set } = useAxon();

  return (
    <PhoneShell>
      <ScreenHeader title="How are you feeling?" subtitle="Two taps, then back to your day." back="/health" />
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => {
                set("mood", m);
                set("healthChecked", true);
              }}
              className={cn(
                "press rounded-3xl border p-5 text-left transition-colors",
                mood === m ? "border-primary bg-primary-soft" : "border-border bg-card",
              )}
            >
              <span className="text-2xl">{EMOJI[m]}</span>
              <p className="mt-2 text-sm font-semibold">{m}</p>
            </button>
          ))}
        </div>

        <SectionTitle>Energy right now</SectionTitle>
        <Card>
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>{energy}/10</span>
            <span className="text-xs font-normal text-muted-foreground">Slide to update</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={energy}
            onChange={(e) => set("energy", Number(e.target.value))}
            className="mt-3 w-full accent-[var(--primary)]"
          />
        </Card>

        <SectionTitle>This week</SectionTitle>
        <Card>
          <div className="flex h-24 items-end gap-2">
            {WEEK.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-success/50" style={{ height: `${(v / 5) * 100}%` }} />
                <span className="text-[10px] text-muted-foreground">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Your mood has been steady overall this week.</p>
        </Card>
        <div className="h-6" />
      </div>
    </PhoneShell>
  );
}

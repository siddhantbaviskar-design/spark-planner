import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneShell, PrimaryButton } from "@/components/axon/PhoneShell";

export const Route = createFileRoute("/focus/reset")({
  head: () => ({
    meta: [
      { title: "Breathing break — AXONADHD" },
      { name: "description", content: "A two-minute breathing reset to slow the day down." },
      { property: "og:title", content: "Breathing break — AXONADHD" },
      { property: "og:description", content: "Breathe in, hold, breathe out. Two calm minutes." },
    ],
  }),
  component: Reset,
});

const PHASES = ["Breathe in", "Hold", "Breathe out"];

function Reset() {
  const [seconds, setSeconds] = useState(120);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    const p = setInterval(() => setPhase((x) => (x + 1) % 3), 4000);
    return () => {
      clearInterval(id);
      clearInterval(p);
    };
  }, []);

  return (
    <PhoneShell bare>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-screen px-8 text-center sm:min-h-[860px]">
        <div className="animate-breathe flex h-56 w-56 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-float">
          <span className="text-lg font-medium">{PHASES[phase]}</span>
        </div>
        <p className="mt-10 text-3xl font-semibold tabular-nums">
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Nothing to do here but breathe.</p>
        <div className="mt-10 w-full">
          <Link to="/today">
            <PrimaryButton>I'm ready</PrimaryButton>
          </Link>
        </div>
      </div>
    </PhoneShell>
  );
}

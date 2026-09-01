import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Clock, ListChecks } from "lucide-react";
import { Card, PhoneShell, PrimaryButton, ScreenHeader, SectionTitle, SoftButton } from "@/components/axon/PhoneShell";
import { routines } from "@/lib/axon-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/routines")({
  head: () => ({
    meta: [
      { title: "Routines — AXONADHD" },
      { name: "description", content: "Run morning, work-start and evening routines one calm step at a time." },
      { property: "og:title", content: "Routines — AXONADHD" },
      { property: "og:description", content: "One step on screen at a time, so routines actually finish." },
    ],
  }),
  component: RoutinesPage,
});

function RoutinesPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const active = routines.find((r) => r.id === activeId);

  if (active) {
    const isLast = step >= active.steps.length - 1;
    return (
      <PhoneShell bare>
        <ScreenHeader
          title={active.title}
          subtitle={`Step ${step + 1} of ${active.steps.length}`}
          onBack={() => setActiveId(null)}
        />
        <div className="flex flex-1 flex-col px-5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-primary transition-all duration-500"
              style={{ width: `${((step + 1) / active.steps.length) * 100}%` }}
            />
          </div>
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-soft text-primary">
              <ListChecks className="h-7 w-7" />
            </span>
            <p className="mt-6 text-2xl font-semibold leading-snug">{active.steps[step]}</p>
            <p className="mt-3 text-sm text-muted-foreground">Just this one. Nothing else right now.</p>
          </div>
          <div className="space-y-2 pb-8">
            <PrimaryButton
              onClick={() => {
                if (isLast) setActiveId(null);
                else setStep((s) => s + 1);
              }}
            >
              {isLast ? "Finish routine" : "Done — next step"}
            </PrimaryButton>
            <SoftButton onClick={() => (isLast ? setActiveId(null) : setStep((s) => s + 1))}>Skip this step</SoftButton>
          </div>
        </div>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell>
      <ScreenHeader title="Routines" subtitle="Sequences that carry you through the hard parts." back="/today" />
      <div className="px-5">
        <SectionTitle>Your routines</SectionTitle>
        <div className="space-y-3">
          {routines.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base font-semibold">{r.title}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {r.minutes} min · {r.steps.length} steps
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveId(r.id);
                    setStep(0);
                  }}
                  className="press rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  Start
                </button>
              </div>
              <ul className="mt-4 space-y-2">
                {r.steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                        i === 0 ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      {i === 0 ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <div className="h-6" />
      </div>
    </PhoneShell>
  );
}

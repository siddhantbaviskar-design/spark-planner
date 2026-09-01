import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Brain, Check } from "lucide-react";
import { PhoneShell, PrimaryButton, SoftButton } from "@/components/axon/PhoneShell";
import { useAxon } from "@/lib/axon-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get started — AXONADHD" },
      { name: "description", content: "Set up your calm ADHD companion in a few short steps." },
      { property: "og:title", content: "Get started — AXONADHD" },
      { property: "og:description", content: "Tell AXONADHD what feels hardest and we'll shape your day around it." },
    ],
  }),
  component: Onboarding,
});

const HARDEST = [
  "Staying focused",
  "Starting tasks",
  "Managing time",
  "Remembering things",
  "Procrastination",
  "Building routines",
  "Staying organized",
  "Managing distractions",
];
const WHEN = ["Morning", "Afternoon", "Evening", "All day", "It changes every day"];
const IMPROVE = [
  "Improve focus",
  "Build routines",
  "Manage time",
  "Stay consistent",
  "Feel less overwhelmed",
  "Understand ADHD better",
  "Manage medication",
  "Improve wellbeing",
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [hardest, setHardest] = useState<string[]>([]);
  const [when, setWhen] = useState<string>("");
  const [improve, setImprove] = useState<string[]>([]);
  const { set } = useAxon();
  const navigate = useNavigate();

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const finish = () => {
    set("onboarded", true);
    navigate({ to: "/today" });
  };

  return (
    <PhoneShell bare>
      <div className="flex min-h-screen flex-col px-6 pb-10 pt-12 sm:min-h-[860px]">
        <div className="mb-8 flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-muted")}
            />
          ))}
        </div>

        <div key={step} className="animate-rise flex-1">
          {step === 0 && (
            <div className="flex h-full flex-col">
              <span className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-primary text-primary-foreground shadow-float">
                <Brain className="h-7 w-7" />
              </span>
              <h1 className="text-[32px] font-semibold leading-[1.15] tracking-tight">
                Make your day feel manageable.
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                AXONADHD helps you understand your routine, build healthy habits and stay connected with your care
                journey.
              </p>
            </div>
          )}

          {step === 1 && (
            <Chooser
              title="What feels hardest right now?"
              hint="Pick as many as you like."
              options={HARDEST}
              selected={hardest}
              onSelect={(v) => toggle(hardest, setHardest, v)}
            />
          )}
          {step === 2 && (
            <Chooser
              title="When do you usually struggle most?"
              options={WHEN}
              selected={when ? [when] : []}
              onSelect={(v) => setWhen(v)}
            />
          )}
          {step === 3 && (
            <Chooser
              title="What would you like to improve?"
              hint="Pick as many as you like."
              options={IMPROVE}
              selected={improve}
              onSelect={(v) => toggle(improve, setImprove, v)}
            />
          )}
          {step === 4 && <PersonalSetup />}
        </div>

        <div className="mt-8 space-y-3">
          <PrimaryButton onClick={() => (step === 4 ? finish() : setStep(step + 1))}>
            {step === 0 ? "Get Started" : step === 4 ? "Create My Day" : "Continue"}
          </PrimaryButton>
          {step === 0 ? (
            <SoftButton onClick={finish}>I already have an account</SoftButton>
          ) : (
            <SoftButton onClick={() => setStep(step - 1)}>Back</SoftButton>
          )}
        </div>
      </div>
    </PhoneShell>
  );
}

function Chooser({
  title,
  hint,
  options,
  selected,
  onSelect,
}: {
  title: string;
  hint?: string;
  options: string[];
  selected: string[];
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <h1 className="text-[28px] font-semibold leading-tight tracking-tight">{title}</h1>
      {hint && <p className="mt-2 text-sm text-muted-foreground">{hint}</p>}
      <div className="mt-6 space-y-2.5">
        {options.map((o) => {
          const active = selected.includes(o);
          return (
            <button
              key={o}
              onClick={() => onSelect(o)}
              className={cn(
                "press flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-colors",
                active ? "border-primary bg-primary-soft text-accent-foreground" : "border-border bg-card",
              )}
            >
              {o}
              {active && <Check className="h-4 w-4 text-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PersonalSetup() {
  const rows = [
    { label: "Wake-up time", value: "7:00 AM" },
    { label: "Sleep time", value: "11:00 PM" },
    { label: "Medication schedule", value: "9:00 AM" },
    { label: "Exercise goal", value: "20 min / day" },
    { label: "Learning goal", value: "1 lesson / day" },
    { label: "Reminder preference", value: "Gentle" },
  ];
  return (
    <div>
      <h1 className="text-[28px] font-semibold leading-tight tracking-tight">Let's set up your day.</h1>
      <p className="mt-2 text-sm text-muted-foreground">You can change any of this later.</p>
      <div className="mt-6 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-4 py-4">
            <span className="text-sm font-medium">{r.label}</span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

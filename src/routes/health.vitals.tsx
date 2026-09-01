import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Heart, Moon, Scale } from "lucide-react";
import { Card, PhoneShell, PrimaryButton, ScreenHeader, SectionTitle } from "@/components/axon/PhoneShell";
import { toast } from "sonner";

export const Route = createFileRoute("/health/vitals")({
  head: () => ({
    meta: [
      { title: "Vitals — AXONADHD" },
      { name: "description", content: "Log heart rate, blood pressure, weight and sleep with simple trends." },
      { property: "og:title", content: "Vitals — AXONADHD" },
      { property: "og:description", content: "Simple vitals logging with calm, non-alarming trends." },
    ],
  }),
  component: Vitals,
});

const TREND = [70, 74, 71, 69, 73, 72, 72];

function Vitals() {
  const [logged, setLogged] = useState(false);

  return (
    <PhoneShell>
      <ScreenHeader title="Vitals" subtitle="A simple record — not a diagnosis." back="/health" />
      <div className="px-5">
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-health/20 text-health-foreground">
              <Heart className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Heart rate</p>
              <p className="text-2xl font-semibold">72 BPM</p>
            </div>
          </div>
          <div className="mt-5 flex h-20 items-end gap-2">
            {TREND.map((v, i) => (
              <div key={i} className="flex-1 rounded-t-lg bg-health/40" style={{ height: `${(v / 80) * 100}%` }} />
            ))}
          </div>
        </Card>

        <SectionTitle>Other metrics</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <Metric icon={Activity} label="Blood pressure" value="118 / 76" />
          <Metric icon={Scale} label="Weight" value="72 kg" />
          <Metric icon={Moon} label="Sleep" value="7h 10m" />
          <Metric icon={Heart} label="Resting HR" value="64 BPM" />
        </div>

        <PrimaryButton
          className="mt-6"
          onClick={() => {
            setLogged(true);
            toast.success("Vitals logged", { description: "Thanks for checking in." });
          }}
        >
          {logged ? "Logged for today" : "Log Vitals"}
        </PrimaryButton>
        <p className="mt-4 px-1 text-xs text-muted-foreground">
          AXONADHD doesn't interpret these numbers. Share them with your care team if anything feels off.
        </p>
        <div className="h-6" />
      </div>
    </PhoneShell>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Heart; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-base font-semibold">{value}</p>
    </div>
  );
}

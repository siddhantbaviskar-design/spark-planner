import { createFileRoute } from "@tanstack/react-router";
import { Pill } from "lucide-react";
import { Card, PhoneShell, PrimaryButton, ScreenHeader, SectionTitle, SoftButton } from "@/components/axon/PhoneShell";
import { useAxon } from "@/lib/axon-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/health/medication")({
  head: () => ({
    meta: [
      { title: "Medication — AXONADHD" },
      { name: "description", content: "Track scheduled doses, adherence history and refills — clinician-directed only." },
      { property: "og:title", content: "Medication — AXONADHD" },
      { property: "og:description", content: "Gentle medication reminders and an adherence history you can share." },
    ],
  }),
  component: Medication,
});

const HISTORY = [
  { day: "Mon", state: "Taken" },
  { day: "Tue", state: "Taken" },
  { day: "Wed", state: "Skipped" },
  { day: "Thu", state: "Taken" },
  { day: "Fri", state: "Taken" },
  { day: "Sat", state: "Snoozed" },
  { day: "Sun", state: "Taken" },
];

function Medication() {
  const { medicationTaken, set } = useAxon();

  return (
    <PhoneShell>
      <ScreenHeader title="Medication" subtitle="Reminders only — dosage stays with your clinician." back="/health" />
      <div className="px-5">
        <Card>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Pill className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-base font-semibold">Morning Medication</p>
              <p className="text-xs text-muted-foreground">1 tablet · 9:00 AM</p>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase",
                medicationTaken ? "bg-success/20 text-success-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {medicationTaken ? "Taken" : "Upcoming"}
            </span>
          </div>
          <div className="mt-5 space-y-2">
            <PrimaryButton onClick={() => set("medicationTaken", true)}>
              {medicationTaken ? "Marked as taken" : "Mark as taken"}
            </PrimaryButton>
            <div className="flex gap-2">
              <SoftButton onClick={() => set("medicationTaken", false)}>Snooze</SoftButton>
              <SoftButton onClick={() => set("medicationTaken", false)}>Skip</SoftButton>
            </div>
          </div>
        </Card>

        <SectionTitle>Adherence this week</SectionTitle>
        <Card className="grid grid-cols-7 gap-2 text-center">
          {HISTORY.map((h) => (
            <div key={h.day}>
              <div
                className={cn(
                  "mx-auto h-9 w-9 rounded-xl",
                  h.state === "Taken" ? "bg-success/40" : h.state === "Skipped" ? "bg-muted" : "bg-activity/40",
                )}
              />
              <p className="mt-1 text-[10px] text-muted-foreground">{h.day}</p>
            </div>
          ))}
        </Card>

        <SectionTitle>Details</SectionTitle>
        <Card className="space-y-3 text-sm">
          <Row label="Refill reminder" value="12 days left" />
          <Row label="Prescriber" value="Dr. Dodini" />
          <Row label="Notes" value="Take with food" />
        </Card>
        <p className="mt-4 px-1 text-xs text-muted-foreground">
          AXONADHD never suggests dosage changes. Talk to your clinician about anything medication-related.
        </p>
        <div className="h-6" />
      </div>
    </PhoneShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

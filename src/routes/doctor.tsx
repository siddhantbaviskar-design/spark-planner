import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, FileText, ShieldCheck, Video } from "lucide-react";
import { Card, PhoneShell, PrimaryButton, ScreenHeader, SectionTitle, SoftButton } from "@/components/axon/PhoneShell";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor")({
  head: () => ({
    meta: [
      { title: "Your Clinician — AXONADHD" },
      { name: "description", content: "Review your care summary and book a video consultation with your clinician." },
      { property: "og:title", content: "Your Clinician — AXONADHD" },
      { property: "og:description", content: "Book a consultation and share your progress summary." },
    ],
  }),
  component: Doctor,
});

const SLOTS = ["Tue 10:00", "Tue 14:30", "Wed 09:15", "Thu 16:00"];

function Doctor() {
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  return (
    <PhoneShell>
      <ScreenHeader title="Your clinician" subtitle="Care decisions stay with a human." back="/health" />
      <div className="px-5">
        <Card>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-primary text-lg font-semibold text-primary-foreground">
              MD
            </span>
            <div>
              <p className="text-base font-semibold">Dr. Maya Dodini</p>
              <p className="text-xs text-muted-foreground">Psychiatrist · ADHD specialist</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-success-foreground" /> Verified clinician
              </p>
            </div>
          </div>
        </Card>

        <SectionTitle>Book a video consultation</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {SLOTS.map((s) => (
            <button
              key={s}
              onClick={() => setSlot(s)}
              className={cn(
                "press rounded-2xl border p-4 text-sm font-medium transition-colors",
                slot === s ? "border-primary bg-primary-soft text-primary" : "border-border bg-card",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <PrimaryButton
          className="mt-4"
          onClick={() => {
            if (!slot) {
              toast("Pick a time first");
              return;
            }
            setBooked(true);
            toast.success("Consultation booked", { description: `${slot} · video call` });
          }}

        >
          {booked ? `Booked · ${slot}` : "Book consultation"}
        </PrimaryButton>

        <SectionTitle>Shared with your clinician</SectionTitle>
        <Card className="space-y-3 p-0">
          {[
            { icon: FileText, label: "Assessment results", meta: "Last: ADHD Progress Check" },
            { icon: CalendarDays, label: "Medication adherence", meta: "6 of 7 days this week" },
            { icon: Video, label: "Consultation notes", meta: "2 previous sessions" },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-3 border-b border-border px-5 py-4 last:border-0">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <r.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.meta}</p>
              </div>
            </div>
          ))}
        </Card>
        <div className="mt-3">
          <SoftButton onClick={() => toast("Summary exported as PDF")}>Export summary</SoftButton>
        </div>
        <div className="h-6" />
      </div>
    </PhoneShell>
  );
}

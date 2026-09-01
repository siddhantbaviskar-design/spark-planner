import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Clock, UserRound } from "lucide-react";
import { PhoneShell, ScreenHeader, EmptyState } from "@/components/axon/PhoneShell";
import { useAxon } from "@/lib/axon-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assessment/")({
  head: () => ({
    meta: [
      { title: "Assessments — AXONADHD" },
      { name: "description", content: "Complete the assessments assigned by your care team, at your own pace." },
      { property: "og:title", content: "Assessments — AXONADHD" },
      { property: "og:description", content: "Assigned check-ins with clear status, due dates and gentle reminders." },
    ],
  }),
  component: Assessments,
});

const STATUS_LABEL = {
  "not-started": { label: "Not started", cta: "Start Assessment", tone: "bg-muted text-muted-foreground" },
  "in-progress": { label: "In progress", cta: "Continue Assessment", tone: "bg-primary-soft text-primary" },
  completed: { label: "Completed", cta: "View Summary", tone: "bg-success/20 text-success-foreground" },
} as const;

function Assessments() {
  const { assessments } = useAxon();

  return (
    <PhoneShell>
      <ScreenHeader
        title="Your Assessments"
        subtitle="Complete your assigned assessments to help your care team understand your progress."
      />
      <div className="space-y-3 px-5">
        {assessments.length === 0 && (
          <EmptyState title="Nothing here yet." body="Assessments assigned to you will appear here." />
        )}
        {assessments.map((a) => {
          const s = STATUS_LABEL[a.status];
          return (
            <Link
              key={a.id}
              to="/assessment/$assessmentId"
              params={{ assessmentId: a.id }}
              className="press block rounded-3xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold">{a.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
                </div>
                <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase", s.tone)}>
                  {s.label}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5" /> {a.assignedBy}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> Due {a.due}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {a.minutes} min
                </span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-primary transition-all" style={{ width: `${a.progress}%` }} />
              </div>
              <p className="mt-4 text-sm font-semibold text-primary">{s.cta} →</p>
            </Link>
          );
        })}
        <p className="px-1 pt-2 text-xs text-muted-foreground">
          This assessment is still available whenever you're ready. There's no rush.
        </p>
        <div className="h-6" />
      </div>
    </PhoneShell>
  );
}

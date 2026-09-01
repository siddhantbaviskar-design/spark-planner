import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell } from "lucide-react";
import { Card, EmptyState, PhoneShell, ScreenHeader, SectionTitle, SoftButton } from "@/components/axon/PhoneShell";
import { notifications } from "@/lib/axon-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — AXONADHD" },
      { name: "description", content: "Gentle reminders for medication, routines, assessments and learning." },
      { property: "og:title", content: "Notifications — AXONADHD" },
      { property: "og:description", content: "Quiet nudges — never guilt-based alerts." },
    ],
  }),
  component: NotificationsPage,
});

const TONE: Record<string, string> = {
  primary: "bg-primary-soft text-primary",
  health: "bg-health/20 text-health-foreground",
  activity: "bg-activity/25 text-activity-foreground",
  success: "bg-success/25 text-success-foreground",
};

function NotificationsPage() {
  const [items, setItems] = useState(notifications);

  return (
    <PhoneShell>
      <ScreenHeader
        title="Notifications"
        subtitle="Nudges, not nagging."
        back="/today"
        right={
          items.length > 0 ? (
            <button onClick={() => setItems([])} className="text-xs font-semibold text-primary">
              Clear all
            </button>
          ) : null
        }
      />
      <div className="px-5">
        {items.length === 0 ? (
          <EmptyState
            title="All caught up"
            body="Nothing needs your attention right now. That's a good place to be."
            action={<SoftButton onClick={() => setItems(notifications)}>Restore examples</SoftButton>}
          />
        ) : (
          <>
            <SectionTitle>Recent</SectionTitle>
            <div className="space-y-3">
              {items.map((n) => (
                <Card key={n.id}>
                  <div className="flex gap-3">
                    <span
                      className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", TONE[n.tone])}
                    >
                      <Bell className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold">{n.title}</p>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
        <div className="h-6" />
      </div>
    </PhoneShell>
  );
}

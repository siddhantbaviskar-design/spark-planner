import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Clock, Flag } from "lucide-react";
import { Card, PhoneShell, PrimaryButton, ScreenHeader, SoftButton } from "@/components/axon/PhoneShell";
import { useAxon } from "@/lib/axon-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks/$taskId")({
  head: () => ({
    meta: [
      { title: "Task detail — AXONADHD" },
      { name: "description", content: "Break a task into small steps and start a focus session." },
      { property: "og:title", content: "Task detail — AXONADHD" },
      { property: "og:description", content: "One task, broken down into steps you can actually start." },
    ],
  }),
  component: TaskDetail,
});

function TaskDetail() {
  const { taskId } = Route.useParams();
  const { tasks, toggleTask } = useAxon();
  const navigate = useNavigate();
  const task = tasks.find((t) => t.id === taskId);
  const [checked, setChecked] = useState<string[]>([]);
  const [celebrate, setCelebrate] = useState(false);

  if (!task) {
    return (
      <PhoneShell>
        <ScreenHeader title="Task not found" subtitle="It may have been completed or removed." back="/tasks" />
      </PhoneShell>
    );
  }

  const steps = task.steps.length ? task.steps : ["Set a 10 minute timer", "Do the first small piece", "Stop and check in"];

  return (
    <PhoneShell>
      <ScreenHeader title={task.title} back="/tasks" />
      <div className="px-5">
        <div className="flex flex-wrap gap-2">
          <Chip icon={Clock}>{task.minutes} min</Chip>
          <Chip>Today</Chip>
          <Chip icon={Flag}>{task.priority === "important" ? "Important" : "Gentle"}</Chip>
        </div>

        <Card className="mt-5">
          <p className="text-sm font-semibold">Break it down</p>
          <p className="mt-1 text-xs text-muted-foreground">Tick them off in any order.</p>
          <div className="mt-4 space-y-2">
            {steps.map((s) => {
              const on = checked.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => setChecked((c) => (on ? c.filter((x) => x !== s) : [...c, s]))}
                  className={cn(
                    "press flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                    on ? "border-primary bg-primary-soft" : "border-border bg-background",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2",
                      on ? "border-primary bg-primary text-primary-foreground" : "border-border",
                    )}
                  >
                    {on && <Check className="h-3 w-3" />}
                  </span>
                  <span className={cn(on && "text-muted-foreground line-through")}>{s}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="mt-5 space-y-2.5">
          <PrimaryButton onClick={() => navigate({ to: "/focus/session", search: { task: task.title, minutes: task.minutes } })}>
            Start Task
          </PrimaryButton>
          <SoftButton
            onClick={() => {
              if (!task.done) toggleTask(task.id);
              setCelebrate(true);
            }}
          >
            Mark complete
          </SoftButton>
          <div className="flex gap-2 pt-1">
            {["Edit", "Reschedule", "Delete"].map((a) => (
              <button key={a} className="press flex-1 rounded-xl py-2 text-xs font-semibold text-muted-foreground">
                {a}
              </button>
            ))}
          </div>
        </div>

        <Card className="mt-6 bg-gradient-soft">
          <p className="text-sm font-semibold">Missed this one?</p>
          <p className="mt-1 text-xs text-muted-foreground">That's okay. Pick what fits right now.</p>
          <div className="mt-3 flex gap-2">
            <button className="press flex-1 rounded-xl bg-card px-3 py-2 text-xs font-semibold">Do it now</button>
            <button className="press flex-1 rounded-xl bg-card px-3 py-2 text-xs font-semibold">Reschedule</button>
          </div>
        </Card>
        <div className="h-6" />
      </div>

      {celebrate && (
        <div className="absolute inset-0 z-50 flex items-end">
          <button aria-label="Close" onClick={() => setCelebrate(false)} className="absolute inset-0 bg-foreground/30" />
          <div className="animate-rise relative w-full rounded-t-3xl bg-card p-7 pb-9 text-center shadow-float">
            <p className="text-3xl">🎉</p>
            <h2 className="mt-3 text-xl font-semibold">Nice work!</h2>
            <p className="mt-1 text-sm text-muted-foreground">{task.title} finished.</p>
            <p className="mt-4 inline-block rounded-full bg-primary-soft px-4 py-1.5 text-xs font-semibold text-primary">
              +10 Focus points
            </p>
            <div className="mt-6 space-y-2">
              <Link to="/tasks" className="block">
                <PrimaryButton>Next task</PrimaryButton>
              </Link>
              <SoftButton onClick={() => setCelebrate(false)}>Take a break</SoftButton>
            </div>
          </div>
        </div>
      )}
    </PhoneShell>
  );
}

function Chip({ children, icon: Icon }: { children: React.ReactNode; icon?: typeof Clock }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}

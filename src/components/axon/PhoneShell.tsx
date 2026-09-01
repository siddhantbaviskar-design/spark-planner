import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Brain,
  ClipboardList,
  Dumbbell,
  Heart,
  HeartPulse,
  ListChecks,
  Home,
  Pill,
  Plus,
  Repeat,
  Smile,
  Sparkles,
  Timer,
  TrendingUp,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useAxon } from "@/lib/axon-store";
import { CoachPanel } from "./CoachPanel";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/today", label: "Today", icon: Home },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/focus", label: "Focus", icon: Timer },
  { to: "/assessment", label: "Assess", icon: ClipboardList },
  { to: "/insights", label: "Insights", icon: TrendingUp },
] as const;

const QUICK = [
  { label: "Medication", icon: Pill, to: "/health/medication" },
  { label: "Vitals", icon: HeartPulse, to: "/health/vitals" },
  { label: "Exercise", icon: Dumbbell, to: "/health/exercise" },
  { label: "Mood", icon: Smile, to: "/health/mood" },
  { label: "Focus", icon: Timer, to: "/focus" },
  { label: "Task", icon: ListChecks, to: "/tasks" },
  { label: "Routine", icon: Repeat, to: "/routines" },
] as const;

export function PhoneShell({
  children,
  bare = false,
  coach = true,
}: {
  children: ReactNode;
  bare?: boolean;
  coach?: boolean;
}) {
  const [quickOpen, setQuickOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen justify-center bg-gradient-screen px-0 py-0 sm:px-6 sm:py-10">
      <div className="relative w-full max-w-[420px] overflow-hidden bg-background sm:rounded-[2.75rem] sm:border sm:border-border sm:shadow-frame">
        <div className="relative flex min-h-screen flex-col sm:min-h-[860px]">
          <div className={cn("flex-1 overflow-y-auto", !bare && "pb-32")}>{children}</div>

          {!bare && (
            <>
              {coach && (
                <button
                  onClick={() => setCoachOpen(true)}
                  aria-label="Open AI Focus Coach"
                  className="press absolute bottom-28 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-card text-primary shadow-float ring-1 ring-border animate-float-pulse"
                >
                  <Sparkles className="h-5 w-5" />
                </button>
              )}

              <div className="absolute inset-x-0 bottom-0 z-30">
                <div className="relative">
                  <button
                    onClick={() => setQuickOpen(true)}
                    aria-label="Quick add"
                    className="press absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-float"
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                  <nav className="flex items-end justify-between gap-1 border-t border-border bg-card/90 px-3 pb-5 pt-3 backdrop-blur-xl">
                    {NAV.map((item, i) => {
                      const active = pathname.startsWith(item.to);
                      const Icon = item.icon;
                      return (
                        <div key={item.to} className={cn("flex-1", i === 2 && "mr-8", i === 3 && "-ml-2")}>
                          <Link
                            to={item.to}
                            className={cn(
                              "press flex flex-col items-center gap-1 rounded-xl py-1 text-[11px] font-medium transition-colors",
                              active ? "text-primary" : "text-muted-foreground",
                            )}
                          >
                            <Icon className={cn("h-[18px] w-[18px]", active && "stroke-[2.4]")} />
                            {item.label}
                          </Link>
                        </div>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </>
          )}

          {quickOpen && <QuickSheet onClose={() => setQuickOpen(false)} />}
          {coachOpen && <CoachPanel onClose={() => setCoachOpen(false)} />}
        </div>
      </div>
    </div>
  );
}

function QuickSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]" />
      <div className="animate-rise relative w-full rounded-t-3xl border-t border-border bg-card p-5 pb-8 shadow-float">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">What would you like to add?</h2>
          <button onClick={onClose} aria-label="Close" className="press rounded-full bg-muted p-1.5">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {QUICK.map(({ label, icon: Icon, to }) => (
            <Link
              key={label}
              to={to}
              onClick={onClose}
              className="press flex items-center gap-3 rounded-2xl bg-gradient-soft p-4 text-sm font-medium"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-card text-primary shadow-card">
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  right,
  back,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  back?: string;
}) {
  return (
    <header className="px-5 pb-4 pt-8">
      {back && (
        <Link to={back} className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
          ← Back
        </Link>
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-semibold leading-tight tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-3xl border border-border bg-card p-5 shadow-card", className)}>{children}</div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-7 flex items-center justify-between px-1">
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{children}</h2>
      {action}
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-10 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-soft text-primary">
        <Brain className="h-6 w-6" />
      </span>
      <p className="text-base font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ProgressRing({
  value,
  size = 74,
  stroke = 8,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="stroke-muted" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          className="stroke-primary transition-[stroke-dashoffset] duration-700"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.min(100, Math.max(0, value))) / 100}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">{children}</div>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  className,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "press inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-float disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SoftButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "press inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function StatPill({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: typeof Heart;
  label: string;
  value: string;
  tone?: "primary" | "health" | "activity" | "success";
}) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    health: "bg-health/20 text-health-foreground",
    activity: "bg-activity/25 text-activity-foreground",
    success: "bg-success/20 text-success-foreground",
  } as const;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
      <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

export { Activity };

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, Crown, Moon, RotateCcw, Stethoscope, Trophy } from "lucide-react";
import { Card, PhoneShell, PrimaryButton, ScreenHeader, SectionTitle, SoftButton } from "@/components/axon/PhoneShell";
import { useAxon } from "@/lib/axon-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Settings — AXONADHD" },
      { name: "description", content: "Manage your subscription, reminders, appearance and progress streaks." },
      { property: "og:title", content: "Profile & Settings — AXONADHD" },
      { property: "og:description", content: "Your streaks, subscription and gentle app settings." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { name, subscribed, dark, focusPoints, watched, set, reset } = useAxon();
  const navigate = useNavigate();

  return (
    <PhoneShell>
      <ScreenHeader title="Profile" subtitle="Your progress and preferences." back="/today" />
      <div className="px-5">
        <Card className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-primary text-lg font-semibold text-primary-foreground">
            {name.slice(0, 1)}
          </span>
          <div>
            <p className="text-base font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">{subscribed ? "Premium member" : "Free plan"}</p>
          </div>
        </Card>

        <SectionTitle>Progress</SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          <Stat icon={Trophy} label="Focus pts" value={String(focusPoints)} />
          <Stat icon={Crown} label="Lessons" value={String(watched.length)} />
          <Stat icon={RotateCcw} label="Streak" value="5d" />
        </div>

        <SectionTitle>Subscription</SectionTitle>
        <Card>
          <p className="text-sm font-semibold">{subscribed ? "AXON Premium — active" : "Unlock AXON Premium"}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Full video library, unlimited assessments and clinician summaries.
          </p>
          <div className="mt-4">
            {subscribed ? (
              <SoftButton onClick={() => set("subscribed", false)}>Manage / cancel</SoftButton>
            ) : (
              <PrimaryButton
                onClick={() => {
                  set("subscribed", true);
                  toast.success("Premium unlocked");
                }}
              >
                Upgrade — $9/mo
              </PrimaryButton>
            )}
          </div>
        </Card>

        <SectionTitle>Settings</SectionTitle>
        <Card className="p-0">
          <Toggle
            icon={Moon}
            label="Dark mode"
            desc="Easier on the eyes at night"
            on={dark}
            onChange={() => set("dark", !dark)}
          />
          <RowLink icon={Bell} label="Reminders" desc="Medication, routines, check-ins" onClick={() => navigate({ to: "/notifications" })} />
          <RowLink icon={Stethoscope} label="Your clinician" desc="Consultations & shared data" onClick={() => navigate({ to: "/doctor" })} />
        </Card>

        <div className="mt-4">
          <SoftButton
            onClick={() => {
              reset();
              toast("App reset to a fresh start");
              navigate({ to: "/onboarding" });
            }}
          >
            Reset app data
          </SoftButton>
        </div>
        <p className="mt-4 px-1 text-xs text-muted-foreground">
          AXONADHD supports your care — it does not diagnose or prescribe.
        </p>
        <div className="h-6" />
      </div>
    </PhoneShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 text-center">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <p className="mt-2 text-lg font-semibold">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function Toggle({
  icon: Icon,
  label,
  desc,
  on,
  onChange,
}: {
  icon: typeof Moon;
  label: string;
  desc: string;
  on: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-5 py-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <button
        onClick={onChange}
        className={cn("h-6 w-11 rounded-full p-0.5 transition-colors", on ? "bg-primary" : "bg-muted")}
      >
        <span
          className={cn(
            "block h-5 w-5 rounded-full bg-card transition-transform",
            on ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}

function RowLink({
  icon: Icon,
  label,
  desc,
  onClick,
}: {
  icon: typeof Bell;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 border-b border-border px-5 py-4 text-left last:border-0">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <span className="text-muted-foreground">›</span>
    </button>
  );
}

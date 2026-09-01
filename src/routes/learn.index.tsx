import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Play, Sparkles } from "lucide-react";
import { Card, PhoneShell, PrimaryButton, ProgressRing, ScreenHeader, SectionTitle, SoftButton } from "@/components/axon/PhoneShell";
import { learnCategories, lessons } from "@/lib/axon-data";
import { useAxon } from "@/lib/axon-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "Learn & Grow — AXONADHD" },
      { name: "description", content: "Short ADHD lessons on focus, time, routines and overwhelm." },
      { property: "og:title", content: "Learn & Grow — AXONADHD" },
      { property: "og:description", content: "Build skills. Understand ADHD. Grow every day." },
    ],
  }),
  component: Learn,
});

function Learn() {
  const { watched, subscribed } = useAxon();
  const [paywall, setPaywall] = useState(false);
  const pct = Math.round((watched.length / lessons.length) * 100);

  return (
    <PhoneShell>
      <ScreenHeader title="Learn & Grow" subtitle="Build skills. Understand ADHD. Grow every day." />
      <div className="px-5">
        <Card className="flex items-center gap-5">
          <ProgressRing value={pct}>{pct}%</ProgressRing>
          <div>
            <p className="text-sm font-semibold">Your learning progress</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {watched.length} / {lessons.length} videos completed
            </p>
            <p className="text-xs text-muted-foreground">{watched.length * 4} learning minutes</p>
          </div>
        </Card>

        <SectionTitle>Categories</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {learnCategories.map((c) => (
            <span key={c} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
              {c}
            </span>
          ))}
        </div>

        <SectionTitle>Video library</SectionTitle>
        <div className="space-y-3">
          {lessons.map((l) => {
            const locked = l.premium && !subscribed;
            const done = watched.includes(l.id);
            const card = (
              <div className="press overflow-hidden rounded-3xl border border-border bg-card shadow-card">
                <div className="relative flex h-28 items-center justify-center bg-gradient-primary">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/90 text-primary">
                    {locked ? <Lock className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </span>
                  <span
                    className={cn(
                      "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                      l.premium ? "bg-activity/90 text-activity-foreground" : "bg-success/90 text-success-foreground",
                    )}
                  >
                    {l.premium ? "Premium" : "Free"}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-full bg-foreground/40 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {l.duration}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{l.category}</p>
                  <p className="mt-1 text-sm font-semibold">{l.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{l.description}</p>
                  <p className="mt-3 text-sm font-semibold text-primary">
                    {done ? "Watch again" : locked ? "Unlock" : "Watch Now"} →
                  </p>
                </div>
              </div>
            );
            return locked ? (
              <button key={l.id} onClick={() => setPaywall(true)} className="block w-full text-left">
                {card}
              </button>
            ) : (
              <Link key={l.id} to="/learn/$lessonId" params={{ lessonId: l.id }} className="block">
                {card}
              </Link>
            );
          })}
        </div>
        <div className="h-6" />
      </div>

      {paywall && <Paywall onClose={() => setPaywall(false)} />}
    </PhoneShell>
  );
}

export function Paywall({ onClose }: { onClose: () => void }) {
  const { set } = useAxon();
  const benefits = [
    "Full tutorial library",
    "ADHD skill-building videos",
    "Focus & routine strategies",
    "New educational content",
    "Learning progress tracking",
  ];
  return (
    <div className="absolute inset-0 z-50 flex items-end">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" />
      <div className="animate-rise relative w-full rounded-t-3xl bg-card p-6 pb-8 shadow-float">
        <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-border" />
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </span>
        <h2 className="mt-4 text-xl font-semibold">Unlock your full learning journey ✨</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Get access to all ADHD tutorial videos, practical lessons and skill-building content.
        </p>
        <ul className="mt-4 space-y-2">
          {benefits.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-2xl bg-muted p-3 text-xs text-muted-foreground">
          Premium · $7.99 / month. Cancel anytime. This demo uses a mock subscription.
        </p>
        <PrimaryButton
          className="mt-5"
          onClick={() => {
            set("subscribed", true);
            onClose();
          }}
        >
          Unlock Full Access
        </PrimaryButton>
        <SoftButton className="mt-2" onClick={onClose}>
          Maybe Later
        </SoftButton>
      </div>
    </div>
  );
}

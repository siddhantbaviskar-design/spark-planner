import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Brain } from "lucide-react";
import { useEffect } from "react";
import { useAxon } from "@/lib/axon-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AXONADHD — Your calm ADHD health companion" },
      {
        name: "description",
        content:
          "AXONADHD helps you manage routines, medication, focus sessions, assessments and learning — one calm step at a time.",
      },
      { property: "og:title", content: "AXONADHD — Your calm ADHD health companion" },
      {
        property: "og:description",
        content: "Track, understand, improve and connect. A calm ADHD companion that makes today manageable.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const { onboarded } = useAxon();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate({ to: onboarded ? "/today" : "/onboarding" });
    }, 2100);
    return () => clearTimeout(t);
  }, [navigate, onboarded]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-primary px-6">
      <div className="animate-rise flex flex-col items-center text-center">
        <div className="animate-breathe flex h-24 w-24 items-center justify-center rounded-[2rem] bg-primary-foreground/15 ring-1 ring-primary-foreground/25 backdrop-blur">
          <Brain className="h-11 w-11 text-primary-foreground" />
        </div>
        <h1 className="mt-7 text-3xl font-semibold tracking-tight text-primary-foreground">AXONADHD</h1>
        <p className="mt-2 text-sm text-primary-foreground/80">Make today manageable.</p>
        <Link to="/onboarding" className="mt-10 text-xs font-medium text-primary-foreground/70 underline">
          Skip
        </Link>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Card, PhoneShell, PrimaryButton, ScreenHeader, SoftButton } from "@/components/axon/PhoneShell";
import { lessons } from "@/lib/axon-data";
import { useAxon } from "@/lib/axon-store";
import { Paywall } from "./learn.index";

export const Route = createFileRoute("/learn/$lessonId")({
  head: () => ({
    meta: [
      { title: "Lesson — AXONADHD" },
      { name: "description", content: "Watch a short ADHD lesson and pick up practical takeaways." },
      { property: "og:title", content: "Lesson — AXONADHD" },
      { property: "og:description", content: "Short, practical ADHD video lessons with key takeaways." },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { lessonId } = Route.useParams();
  const { watched, markWatched, subscribed } = useAxon();
  const lesson = lessons.find((l) => l.id === lessonId);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [paywall, setPaywall] = useState(false);

  useEffect(() => {
    if (!playing || progress >= 100) return;
    const id = setInterval(() => setProgress((p) => Math.min(100, p + 2)), 220);
    return () => clearInterval(id);
  }, [playing, progress]);

  useEffect(() => {
    if (progress >= 100 && lesson) markWatched(lesson.id);
  }, [progress, lesson, markWatched]);

  if (!lesson) {
    return (
      <PhoneShell>
        <ScreenHeader title="Lesson not found" back="/learn" />
      </PhoneShell>
    );
  }

  const nextLesson = lessons[(lessons.findIndex((l) => l.id === lesson.id) + 1) % lessons.length];
  const nextLocked = nextLesson.premium && !subscribed;
  const done = progress >= 100 || watched.includes(lesson.id);

  return (
    <PhoneShell>
      <ScreenHeader title={lesson.title} subtitle={`${lesson.category} · ${lesson.duration}`} back="/learn" />
      <div className="px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary">
          <span className="absolute left-4 top-4 rounded-full bg-success/90 px-2.5 py-1 text-[10px] font-bold uppercase text-success-foreground">
            {lesson.premium ? "Premium video" : "Free video"}
          </span>
          <div className="flex h-52 items-center justify-center">
            <button
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause" : "Play"}
              className="press flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/95 text-primary"
            >
              {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
          </div>
          <div className="px-4 pb-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-primary-foreground/25">
              <div className="h-full rounded-full bg-primary-foreground transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-primary-foreground/80">
              <span>{Math.round((progress / 100) * 222)}s</span>
              <span>{lesson.duration}</span>
            </div>
          </div>
        </div>

        <Card className="mt-4">
          <p className="text-sm font-semibold">About this lesson</p>
          <p className="mt-1 text-sm text-muted-foreground">{lesson.description}</p>
          <p className="mt-4 text-sm font-semibold">Key takeaways</p>
          <ul className="mt-2 space-y-2">
            {lesson.takeaways.map((t) => (
              <li key={t} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {t}
              </li>
            ))}
          </ul>
        </Card>

        {done && (
          <Card className="mt-4 bg-gradient-soft text-center">
            <p className="text-2xl">🎉</p>
            <p className="mt-2 text-base font-semibold">Nice work!</p>
            <p className="text-xs text-muted-foreground">{lesson.title} — Completed</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {watched.length} / {lessons.length} lessons done
            </p>
            <div className="mt-4">
              {nextLocked ? (
                <PrimaryButton onClick={() => setPaywall(true)}>Unlock Next Video</PrimaryButton>
              ) : (
                <Link to="/learn/$lessonId" params={{ lessonId: nextLesson.id }}>
                  <PrimaryButton>Watch Next</PrimaryButton>
                </Link>
              )}
              <Link to="/learn" className="mt-2 block">
                <SoftButton>Continue Learning</SoftButton>
              </Link>
            </div>
          </Card>
        )}
        <div className="h-6" />
      </div>
      {paywall && <Paywall onClose={() => setPaywall(false)} />}
    </PhoneShell>
  );
}

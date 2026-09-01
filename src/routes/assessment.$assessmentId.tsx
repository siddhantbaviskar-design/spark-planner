import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Clock, UserRound } from "lucide-react";
import { Card, PhoneShell, PrimaryButton, ScreenHeader, SoftButton } from "@/components/axon/PhoneShell";
import { ANSWER_OPTIONS } from "@/lib/axon-data";
import { useAxon } from "@/lib/axon-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assessment/$assessmentId")({
  head: () => ({
    meta: [
      { title: "Assessment — AXONADHD" },
      { name: "description", content: "One question at a time, with clear progress and no pressure." },
      { property: "og:title", content: "Assessment — AXONADHD" },
      { property: "og:description", content: "Answer based on your recent experience. Mock results only." },
    ],
  }),
  component: AssessmentDetail,
});

function AssessmentDetail() {
  const { assessmentId } = Route.useParams();
  const { assessments, updateAssessment } = useAxon();
  const a = assessments.find((x) => x.id === assessmentId);
  const [stage, setStage] = useState<"intro" | "questions" | "done">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  if (!a) {
    return (
      <PhoneShell>
        <ScreenHeader title="Assessment not found" back="/assessment" />
      </PhoneShell>
    );
  }

  if (stage === "questions") {
    const q = a.questions[index];
    const pct = Math.round(((index + 1) / a.questions.length) * 100);
    return (
      <PhoneShell coach={false}>
        <div className="px-5 pt-8">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>
              Question {index + 1} of {a.questions.length}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-gradient-primary transition-all" style={{ width: `${pct}%` }} />
          </div>

          <h1 className="mt-10 text-[26px] font-semibold leading-snug tracking-tight">{q}</h1>

          <div className="mt-7 space-y-2.5">
            {ANSWER_OPTIONS.map((o) => (
              <button
                key={o}
                onClick={() => setAnswers((s) => ({ ...s, [index]: o }))}
                className={cn(
                  "press w-full rounded-2xl border px-5 py-4 text-left text-base font-medium transition-colors",
                  answers[index] === o ? "border-primary bg-primary-soft" : "border-border bg-card",
                )}
              >
                {o}
              </button>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <SoftButton
              onClick={() => (index === 0 ? setStage("intro") : setIndex(index - 1))}
              className="flex-1"
            >
              Back
            </SoftButton>
            <PrimaryButton
              className="flex-1"
              disabled={!answers[index]}
              onClick={() => {
                if (index + 1 < a.questions.length) {
                  setIndex(index + 1);
                  updateAssessment(a.id, {
                    status: "in-progress",
                    progress: Math.round(((index + 1) / a.questions.length) * 100),
                  });
                } else {
                  updateAssessment(a.id, { status: "completed", progress: 100 });
                  setStage("done");
                }
              }}
            >
              {index + 1 === a.questions.length ? "Finish" : "Next"}
            </PrimaryButton>
          </div>
          <div className="h-10" />
        </div>
      </PhoneShell>
    );
  }

  if (stage === "done") {
    return (
      <PhoneShell>
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
          <p className="text-4xl">✅</p>
          <h1 className="mt-4 text-2xl font-semibold">Assessment complete!</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your responses have been recorded.</p>
          <Card className="mt-8 w-full text-left">
            <p className="text-sm font-semibold">Summary</p>
            <p className="mt-1 text-xs text-muted-foreground">
              A snapshot of your recent experience — shared with {a.assignedBy}. This is not a diagnosis.
            </p>
            <div className="mt-4 space-y-2 text-xs">
              {["Focus", "Routine", "Wellbeing"].map((k, i) => (
                <div key={k}>
                  <div className="flex justify-between font-medium">
                    <span>{k}</span>
                    <span className="text-muted-foreground">{[62, 74, 58][i]}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${[62, 74, 58][i]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <div className="mt-6 w-full space-y-2.5">
            <Link to="/insights">
              <PrimaryButton>View Summary</PrimaryButton>
            </Link>
            <Link to="/assessment">
              <SoftButton>Back to Assessments</SoftButton>
            </Link>
          </div>
        </div>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell>
      <ScreenHeader title={a.name} back="/assessment" />
      <div className="px-5">
        <Card>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {a.minutes}–{a.minutes + 2} minutes
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5" /> {a.assignedBy}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> Due {a.due}
            </span>
          </div>
          <p className="mt-4 text-sm font-semibold">{a.questions.length} questions</p>
          <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
        </Card>

        <PrimaryButton className="mt-5" onClick={() => setStage("questions")}>
          {a.status === "completed" ? "Retake Assessment" : a.status === "in-progress" ? "Continue Assessment" : "Start Assessment"}
        </PrimaryButton>
        <p className="mt-4 px-1 text-xs text-muted-foreground">
          Take breaks whenever you need to — your answers are saved as you go.
        </p>
      </div>
    </PhoneShell>
  );
}

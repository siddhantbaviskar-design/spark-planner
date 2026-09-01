import { useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import { coachChips, coachReply } from "@/lib/axon-data";

type Msg = { role: "user" | "coach"; text: string };

export function CoachPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "coach", text: "I'm here to help you figure out the next step. What's on your mind?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: "coach", text: coachReply(text) }]);
    }, 700);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end">
      <button aria-label="Close coach" onClick={onClose} className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]" />
      <div className="animate-rise relative flex h-[80%] w-full flex-col rounded-t-3xl border-t border-border bg-card shadow-float">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="font-semibold">Focus Coach</p>
            <p className="text-xs text-muted-foreground">I'm here to help you figure out the next step.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="press rounded-full bg-muted p-1.5">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "ml-auto max-w-[80%] rounded-3xl rounded-br-lg bg-gradient-primary px-4 py-3 text-sm text-primary-foreground"
                  : "mr-auto max-w-[85%] rounded-3xl rounded-bl-lg bg-muted px-4 py-3 text-sm"
              }
            >
              {m.text}
            </div>
          ))}
          {typing && (
            <div className="mr-auto flex gap-1 rounded-3xl rounded-bl-lg bg-muted px-4 py-4">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                  style={{ animationDelay: `${d * 120}ms` }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border px-5 py-3">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {coachChips.map((c) => (
              <button
                key={c}
                onClick={() => send(c)}
                className="press whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium"
              >
                {c}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me what's happening…"
              className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" aria-label="Send" className="press text-primary">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

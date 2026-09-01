export type Task = {
  id: string;
  title: string;
  minutes: number;
  when: "today" | "upcoming";
  priority: "calm" | "focus" | "important";
  done: boolean;
  steps: string[];
};

export type Assessment = {
  id: string;
  name: string;
  description: string;
  assignedBy: string;
  due: string;
  minutes: number;
  questions: string[];
  status: "not-started" | "in-progress" | "completed";
  progress: number;
};

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  category: string;
  description: string;
  takeaways: string[];
  premium: boolean;
};

export type Routine = {
  id: string;
  title: string;
  minutes: number;
  steps: string[];
};

export const ANSWER_OPTIONS = ["Never", "Rarely", "Sometimes", "Often", "Very often"];

export const initialTasks: Task[] = [
  {
    id: "presentation",
    title: "Finish presentation",
    minutes: 25,
    when: "today",
    priority: "important",
    done: false,
    steps: ["Open presentation", "Review slides", "Fix charts", "Write conclusion", "Export PDF"],
  },
  {
    id: "emails",
    title: "Reply to emails",
    minutes: 15,
    when: "today",
    priority: "focus",
    done: false,
    steps: ["Open inbox", "Star the urgent ones", "Reply to top 3", "Archive the rest"],
  },
  {
    id: "groceries",
    title: "Buy groceries",
    minutes: 30,
    when: "today",
    priority: "calm",
    done: false,
    steps: ["Check the fridge", "Write a short list", "Walk to the store", "Pay and head home"],
  },
  {
    id: "exercise",
    title: "Exercise",
    minutes: 20,
    when: "today",
    priority: "calm",
    done: false,
    steps: ["Put on shoes", "Step outside", "Walk 10 minutes out", "Walk back"],
  },
  {
    id: "call-mom",
    title: "Call Mom",
    minutes: 10,
    when: "upcoming",
    priority: "calm",
    done: false,
    steps: ["Pick a quiet moment", "Call", "Say what you wanted to say"],
  },
];

export const initialAssessments: Assessment[] = [
  {
    id: "adhd-progress-check",
    name: "ADHD Progress Check",
    description: "Answer the questions based on your recent experience.",
    assignedBy: "Dr. Dodini",
    due: "September 5",
    minutes: 5,
    status: "not-started",
    progress: 0,
    questions: [
      "How often do you find it difficult to stay focused?",
      "How often do you postpone starting a task?",
      "How often do you lose track of time?",
      "How often do you feel restless during quiet moments?",
      "How often do you misplace everyday things?",
      "How often do you feel overwhelmed by your to-do list?",
      "How often do you finish what you start?",
      "How often does your routine feel manageable?",
      "How often do you take breaks when you need them?",
      "How often do you sleep well?",
      "How often do you remember your medication?",
      "How often do you feel supported in your day?",
    ],
  },
  {
    id: "weekly-wellness-check",
    name: "Weekly Wellness Check",
    description: "A short reflection on your week.",
    assignedBy: "Care Team",
    due: "September 7",
    minutes: 4,
    status: "completed",
    progress: 100,
    questions: [
      "How often did you feel rested this week?",
      "How often did you move your body?",
      "How often did your mood feel steady?",
      "How often did you connect with someone?",
    ],
  },
];

export const lessons: Lesson[] = [
  {
    id: "understanding-adhd",
    title: "Understanding ADHD",
    duration: "3:42",
    category: "ADHD Basics",
    description: "A gentle introduction to how ADHD shapes attention, motivation and energy.",
    takeaways: [
      "ADHD is a difference in attention regulation, not a lack of effort",
      "Interest and urgency drive attention more than importance does",
      "Small structure beats big willpower",
    ],
    premium: false,
  },
  {
    id: "time-blindness",
    title: "Managing Time Blindness",
    duration: "5:18",
    category: "Time Management",
    description: "Make time visible so your day stops disappearing.",
    takeaways: ["Externalise time", "Use anchors, not schedules", "Estimate then double"],
    premium: true,
  },
  {
    id: "better-routines",
    title: "Building Better Routines",
    duration: "4:12",
    category: "Building Routines",
    description: "Design routines that survive a low-energy day.",
    takeaways: ["Start with 3 steps", "Attach to an anchor", "Forgive the misses"],
    premium: true,
  },
  {
    id: "managing-overwhelm",
    title: "Managing Overwhelm",
    duration: "3:55",
    category: "Managing Overwhelm",
    description: "What to do when everything feels equally urgent.",
    takeaways: ["Name the feeling", "Shrink the next step", "Move your body first"],
    premium: true,
  },
  {
    id: "improving-focus",
    title: "Improving Focus",
    duration: "5:20",
    category: "Focus",
    description: "Practical ways to start and protect a focus session.",
    takeaways: ["One thing at a time", "Reduce friction before starting", "Plan the re-entry"],
    premium: true,
  },
];

export const learnCategories = [
  "ADHD Basics",
  "Focus",
  "Time Management",
  "Managing Overwhelm",
  "Building Routines",
  "Emotional Regulation",
  "Medication Education",
  "Lifestyle & Wellness",
];

export const routines: Routine[] = [
  {
    id: "morning",
    title: "Morning Routine",
    minutes: 32,
    steps: ["Get out of bed", "Drink water", "Shower", "Breakfast", "Get dressed", "Leave home"],
  },
  { id: "work-start", title: "Work Start", minutes: 10, steps: ["Clear desk", "Pick one task", "Start a 10 min timer"] },
  {
    id: "evening",
    title: "Evening Routine",
    minutes: 25,
    steps: ["Tidy one surface", "Prep tomorrow's bag", "Set medication out", "Screens off", "Wind down"],
  },
];

export const notifications = [
  {
    id: "n1",
    title: "Medication reminder",
    body: "Your morning medication is scheduled for 9:00 AM.",
    time: "8:45 AM",
    tone: "primary" as const,
  },
  {
    id: "n2",
    title: "Assessment ready",
    body: "Your ADHD Progress Check is ready.",
    time: "8:10 AM",
    tone: "health" as const,
  },
  {
    id: "n3",
    title: "Learning",
    body: "Your next tutorial is waiting for you.",
    time: "Yesterday",
    tone: "activity" as const,
  },
  {
    id: "n4",
    title: "Routine",
    body: "Your evening routine starts in 15 minutes.",
    time: "Yesterday",
    tone: "success" as const,
  },
];

export const focusHistory = [
  { id: "f1", label: "Finish presentation", minutes: 25, when: "Yesterday · 10:20 AM" },
  { id: "f2", label: "Reply to emails", minutes: 10, when: "Yesterday · 4:05 PM" },
  { id: "f3", label: "Reading", minutes: 45, when: "Monday · 9:15 AM" },
];

export const weeklyFocus = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 62 },
  { day: "Wed", minutes: 30 },
  { day: "Thu", minutes: 55 },
  { day: "Fri", minutes: 40 },
  { day: "Sat", minutes: 20 },
  { day: "Sun", minutes: 20 },
];

export const distractionReasons = [
  { id: "lost", label: "Lost focus", tip: "Let's shrink the task. Do just the next 2 minutes of it." },
  { id: "phone", label: "Checked my phone", tip: "Put the phone face down across the room, then restart the timer." },
  { id: "tired", label: "Too tired", tip: "Take a 2-minute breathing break, then try a 10-minute session." },
  { id: "overwhelmed", label: "Feeling overwhelmed", tip: "Write down only the very next step. Nothing else counts right now." },
  { id: "start", label: "Don't know where to start", tip: "Open the file and change one thing. Starting is the whole job." },
];

export const coachChips = [
  "Help me prioritize",
  "Break down a task",
  "I'm procrastinating",
  "I'm overwhelmed",
  "Plan my day",
];

export function coachReply(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("priorit"))
    return "Let's simplify. Pick the one thing that would make today feel lighter if it were done. We'll start there and ignore the rest for now.";
  if (m.includes("break"))
    return "Good call. Tell me the task and I'll turn it into 4 small steps — small enough that step one takes under two minutes.";
  if (m.includes("procrastinat"))
    return "Procrastination is usually a starting problem, not a lazy problem. What's the smallest possible first action? Let's do only that.";
  if (m.includes("overwhelm") || m.includes("don't know") || m.includes("10 things"))
    return "That's a lot to hold in your head. Let's simplify it. What's the most urgent thing?";
  if (m.includes("plan"))
    return "Here's a calm plan: one focus block this morning, a short walk after lunch, and one small admin task this evening. Sound doable?";
  return "Thanks for telling me. Let's take it one step at a time — what's the very next thing you could do in two minutes?";
}

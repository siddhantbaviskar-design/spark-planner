import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { initialAssessments, initialTasks, type Assessment, type Task } from "./axon-data";

type Mood = "Good" | "Okay" | "Low" | "Overwhelmed" | "Low energy";

type State = {
  onboarded: boolean;
  name: string;
  tasks: Task[];
  assessments: Assessment[];
  medicationTaken: boolean;
  healthChecked: boolean;
  mood: Mood;
  energy: number;
  movementMinutes: number;
  subscribed: boolean;
  watched: string[];
  focusPoints: number;
  dark: boolean;
};

const defaultState: State = {
  onboarded: false,
  name: "Alex",
  tasks: initialTasks,
  assessments: initialAssessments,
  medicationTaken: false,
  healthChecked: false,
  mood: "Good",
  energy: 7,
  movementMinutes: 0,
  subscribed: false,
  watched: [],
  focusPoints: 40,
  dark: false,
};

type Store = State & {
  set: <K extends keyof State>(key: K, value: State[K]) => void;
  toggleTask: (id: string) => void;
  addTask: (title: string, minutes: number) => void;
  updateAssessment: (id: string, patch: Partial<Assessment>) => void;
  markWatched: (id: string) => void;
  reset: () => void;
};

const Ctx = createContext<Store | null>(null);
const KEY = "axonadhd-state-v1";

export function AxonProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(defaultState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState((s) => ({ ...s, ...(JSON.parse(raw) as Partial<State>) }));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", state.dark);
    }
  }, [state]);

  const value = useMemo<Store>(
    () => ({
      ...state,
      set: (key, val) => setState((s) => ({ ...s, [key]: val })),
      toggleTask: (id) =>
        setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })),
      addTask: (title, minutes) =>
        setState((s) => ({
          ...s,
          tasks: [
            { id: `t-${Date.now()}`, title, minutes, when: "today", priority: "calm", done: false, steps: [] },
            ...s.tasks,
          ],
        })),
      updateAssessment: (id, patch) =>
        setState((s) => ({ ...s, assessments: s.assessments.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
      markWatched: (id) => setState((s) => ({ ...s, watched: s.watched.includes(id) ? s.watched : [...s.watched, id] })),
      reset: () => setState(defaultState),
    }),
    [state],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAxon() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAxon must be used inside AxonProvider");
  return ctx;
}

export function useTodayProgress() {
  const { tasks, medicationTaken, healthChecked, movementMinutes } = useAxon();
  const todayTasks = tasks.filter((t) => t.when === "today");
  const items = [
    medicationTaken,
    healthChecked,
    movementMinutes >= 20,
    ...todayTasks.slice(0, 3).map((t) => t.done),
  ];
  const done = items.filter(Boolean).length;
  return { done, total: items.length, items };
}

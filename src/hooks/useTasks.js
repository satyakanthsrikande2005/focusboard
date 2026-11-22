import { useCallback, useEffect, useMemo, useState } from "react";
import { readStoredJSON, writeStoredJSON } from "../utils/storage.js";

export const STORAGE_KEY = "focusboard_tasks";
export const ALL_FILTER = "All";
export const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];
export const PRIORITY_OPTIONS = ["Low", "Medium", "High"];
export const CATEGORY_OPTIONS = [
  "Work",
  "Design",
  "Development",
  "Meeting",
  "Research",
  "Personal",
];

/* ---------- Date helpers (local time, YYYY-MM-DD) ---------- */

export function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(baseDate, days) {
  const next = new Date(baseDate);
  next.setDate(next.getDate() + days);
  return next;
}

export function parseISODate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

/** Whole days from today until the due date (negative = overdue). */
export function daysUntil(dueDate, today = new Date()) {
  const due = parseISODate(dueDate);
  if (!due) return null;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((due.getTime() - start.getTime()) / 86_400_000);
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/* ---------- Sample data (first launch only) ---------- */

export function createSampleTasks(today = new Date()) {
  const due = (offset) => toISODate(addDays(today, offset));
  const now = today.getTime();
  return [
    {
      title: "Finalize Q4 product roadmap",
      description: "Consolidate stakeholder feedback and lock priorities for the next two sprints.",
      dueDate: due(1),
      priority: "High",
      category: "Work",
      status: "In Progress",
    },
    {
      title: "Redesign onboarding screens",
      description: "Simplify the three-step signup flow and prepare mobile mockups for review.",
      dueDate: due(3),
      priority: "High",
      category: "Design",
      status: "Pending",
    },
    {
      title: "Fix login session timeout bug",
      description:
        "Users are logged out after 5 minutes on Safari. Reproduce and patch the token refresh.",
      dueDate: due(0),
      priority: "Medium",
      category: "Development",
      status: "In Progress",
    },
    {
      title: "Weekly sync with marketing team",
      description: "Review campaign performance and align on the holiday launch timeline.",
      dueDate: due(2),
      priority: "Low",
      category: "Meeting",
      status: "Pending",
    },
    {
      title: "Competitor feature analysis",
      description: "Compare task automation features across three competing productivity tools.",
      dueDate: due(6),
      priority: "Medium",
      category: "Research",
      status: "Pending",
    },
    {
      title: "Publish release notes v2.4",
      description: "Write and publish the changelog for the latest dashboard improvements.",
      dueDate: due(-2),
      priority: "Low",
      category: "Work",
      status: "Completed",
    },
    {
      title: "Set up accessibility audit",
      description: "Run keyboard and screen reader checks on the dashboard and document issues.",
      dueDate: due(-1),
      priority: "Medium",
      category: "Development",
      status: "Completed",
    },
  ].map((task, index) => ({ ...task, id: `sample-${index + 1}`, createdAt: now - index * 60_000 }));
}

/* ---------- Validation & normalisation ---------- */

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function normalizeTaskInput(input) {
  return {
    title: cleanText(input.title, 80),
    description: cleanText(input.description, 240),
    dueDate: parseISODate(input.dueDate) ? input.dueDate : "",
    priority: PRIORITY_OPTIONS.includes(input.priority) ? input.priority : "Medium",
    category: cleanText(input.category, 40) || "Work",
    status: STATUS_OPTIONS.includes(input.status) ? input.status : "Pending",
  };
}

function isStoredTask(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    (typeof value.id === "string" || typeof value.id === "number") &&
    typeof value.title === "string" &&
    value.title.trim().length > 0
  );
}

/** Returns a clean task array, or null when the value is not an array. */
export function sanitizeTasks(value) {
  if (!Array.isArray(value)) return null;
  return value.filter(isStoredTask).map((task) => ({
    ...normalizeTaskInput(task),
    id: String(task.id),
    createdAt: typeof task.createdAt === "number" ? task.createdAt : Date.now(),
  }));
}

/**
 * Loads saved tasks. Sample tasks are created only when nothing usable is
 * stored; a saved empty list is respected so deleted tasks never come back.
 */
export function loadInitialTasks(today = new Date()) {
  const { status, value } = readStoredJSON(STORAGE_KEY);
  if (status === "ok") {
    const tasks = sanitizeTasks(value);
    if (tasks) return tasks;
  }
  return createSampleTasks(today);
}

/* ---------- Derived data ---------- */

export function computeStats(tasks) {
  return tasks.reduce(
    (stats, task) => {
      stats.total += 1;
      if (task.status === "Completed") stats.completed += 1;
      else if (task.status === "In Progress") stats.inProgress += 1;
      else stats.pending += 1;
      return stats;
    },
    { total: 0, completed: 0, inProgress: 0, pending: 0 },
  );
}

export function filterTasks(
  tasks,
  { searchQuery = "", status = ALL_FILTER, priority = ALL_FILTER },
) {
  const query = searchQuery.trim().toLowerCase();
  return tasks.filter(
    (task) =>
      (!query || task.title.toLowerCase().includes(query)) &&
      (status === ALL_FILTER || task.status === status) &&
      (priority === ALL_FILTER || task.priority === priority),
  );
}

export function sortByDueDate(tasks) {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });
}

/** Open tasks that are overdue or due within `withinDays` days. */
export function getDueSoonTasks(tasks, withinDays = 2, today = new Date()) {
  return sortByDueDate(
    tasks.filter((task) => {
      if (task.status === "Completed") return false;
      const days = daysUntil(task.dueDate, today);
      return days !== null && days <= withinDays;
    }),
  );
}

/* ---------- Hook ---------- */

export function useTasks() {
  const [tasks, setTasks] = useState(() => loadInitialTasks());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER);
  const [priorityFilter, setPriorityFilter] = useState(ALL_FILTER);

  useEffect(() => {
    writeStoredJSON(STORAGE_KEY, tasks);
  }, [tasks]);

  const addTask = useCallback((input) => {
    const task = { ...normalizeTaskInput(input), id: createId(), createdAt: Date.now() };
    setTasks((current) => [task, ...current]);
  }, []);

  const updateTask = useCallback((id, input) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, ...normalizeTaskInput(input) } : task)),
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  }, []);

  const toggleTaskCompletion = useCallback((id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, status: task.status === "Completed" ? "Pending" : "Completed" }
          : task,
      ),
    );
  }, []);

  const restoreSampleTasks = useCallback(() => setTasks(createSampleTasks()), []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter(ALL_FILTER);
    setPriorityFilter(ALL_FILTER);
  }, []);

  const stats = useMemo(() => computeStats(tasks), [tasks]);

  const filteredTasks = useMemo(
    () => filterTasks(tasks, { searchQuery, status: statusFilter, priority: priorityFilter }),
    [tasks, searchQuery, statusFilter, priorityFilter],
  );

  const statusCounts = useMemo(() => {
    const matching = filterTasks(tasks, { searchQuery, priority: priorityFilter });
    const counts = { [ALL_FILTER]: matching.length };
    STATUS_OPTIONS.forEach((status) => {
      counts[status] = matching.filter((task) => task.status === status).length;
    });
    return counts;
  }, [tasks, searchQuery, priorityFilter]);

  const dueSoonTasks = useMemo(() => getDueSoonTasks(tasks), [tasks]);

  const hasActiveFilters =
    searchQuery.trim() !== "" || statusFilter !== ALL_FILTER || priorityFilter !== ALL_FILTER;

  return {
    tasks,
    filteredTasks,
    stats,
    dueSoonTasks,
    statusCounts,
    searchQuery,
    statusFilter,
    priorityFilter,
    hasActiveFilters,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    clearFilters,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    restoreSampleTasks,
  };
}

import { CircleCheckBig, Clock3, Hourglass, ListTodo } from "lucide-react";
import StatCard from "./StatCard.jsx";

function percentOf(part, total) {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

function StatsCards({ stats }) {
  const cards = [
    {
      id: "total",
      label: "Total Tasks",
      value: stats.total,
      caption: "All tasks on your board",
      icon: ListTodo,
      tone: "primary",
    },
    {
      id: "completed",
      label: "Completed",
      value: stats.completed,
      caption: `${percentOf(stats.completed, stats.total)}% of all tasks`,
      icon: CircleCheckBig,
      tone: "success",
    },
    {
      id: "in-progress",
      label: "In Progress",
      value: stats.inProgress,
      caption: `${percentOf(stats.inProgress, stats.total)}% of all tasks`,
      icon: Clock3,
      tone: "info",
    },
    {
      id: "pending",
      label: "Pending",
      value: stats.pending,
      caption: `${percentOf(stats.pending, stats.total)}% of all tasks`,
      icon: Hourglass,
      tone: "warning",
    },
  ];

  return (
    <section className="stats" aria-label="Task statistics">
      {cards.map(({ id, ...card }) => (
        <StatCard key={id} {...card} />
      ))}
    </section>
  );
}

export default StatsCards;

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Check, Pencil, Tag, Trash2 } from "lucide-react";
import { daysUntil, parseISODate } from "../hooks/useTasks.js";

const STATUS_CLASS = { Pending: "pending", "In Progress": "progress", Completed: "completed" };

function formatDueDate(dueDate) {
  const date = parseISODate(dueDate);
  if (!date) return "No due date";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function TaskItem({ task, onEdit, onDelete, onToggleComplete }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const cancelButtonRef = useRef(null);
  const isCompleted = task.status === "Completed";
  const remainingDays = daysUntil(task.dueDate);
  const isOverdue = !isCompleted && remainingDays !== null && remainingDays < 0;
  const titleId = `task-title-${task.id}`;

  useEffect(() => {
    if (isConfirmingDelete) cancelButtonRef.current?.focus();
  }, [isConfirmingDelete]);

  return (
    <li
      className={`task-item${isCompleted ? " task-item--completed" : ""}`}
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className={`task-item__toggle${isCompleted ? " is-checked" : ""}`}
        aria-pressed={isCompleted}
        aria-label={
          isCompleted ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as completed`
        }
        onClick={() => onToggleComplete(task.id)}
      >
        {isCompleted && <Check size={14} strokeWidth={3} aria-hidden="true" />}
      </button>

      <div className="task-item__body">
        <div className="task-item__heading">
          <h3 id={titleId} className="task-item__title">
            {task.title}
          </h3>
          <span className={`badge badge--priority-${task.priority.toLowerCase()}`}>
            <span className="badge__dot" aria-hidden="true" />
            {task.priority}
            <span className="visually-hidden"> priority</span>
          </span>
        </div>
        {task.description && <p className="task-item__description">{task.description}</p>}
        <div className="task-item__meta">
          <span className={`badge badge--status-${STATUS_CLASS[task.status]}`}>
            <span className="visually-hidden">Status: </span>
            {task.status}
          </span>
          <span className="task-item__meta-item">
            <Tag size={14} aria-hidden="true" />
            <span className="visually-hidden">Category: </span>
            {task.category}
          </span>
          <span className={`task-item__meta-item${isOverdue ? " is-overdue" : ""}`}>
            <CalendarDays size={14} aria-hidden="true" />
            <span className="visually-hidden">Due date: </span>
            <time dateTime={task.dueDate}>{formatDueDate(task.dueDate)}</time>
            {isOverdue && <span className="task-item__overdue">Overdue</span>}
          </span>
        </div>
      </div>

      <div className="task-item__actions">
        {isConfirmingDelete ? (
          <div className="delete-confirm" role="alertdialog" aria-label={`Delete "${task.title}"?`}>
            <span className="delete-confirm__text">Delete this task?</span>
            <button
              ref={cancelButtonRef}
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => onEdit(task)}
              aria-label={`Edit "${task.title}"`}
            >
              <Pencil size={16} aria-hidden="true" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              className="btn btn--ghost-danger btn--sm"
              onClick={() => setIsConfirmingDelete(true)}
              aria-label={`Delete "${task.title}"`}
            >
              <Trash2 size={16} aria-hidden="true" />
              <span>Delete</span>
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default TaskItem;

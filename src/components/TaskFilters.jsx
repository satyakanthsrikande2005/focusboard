import { RotateCcw } from "lucide-react";
import { ALL_FILTER, PRIORITY_OPTIONS, STATUS_OPTIONS } from "../hooks/useTasks.js";

function TaskFilters({
  statusFilter,
  priorityFilter,
  onStatusChange,
  onPriorityChange,
  onClear,
  hasActiveFilters,
  statusCounts,
}) {
  const statusChoices = [
    { value: ALL_FILTER, label: "All Tasks" },
    ...STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
  ];
  const priorityChoices = [
    { value: ALL_FILTER, label: "All" },
    ...PRIORITY_OPTIONS.map((p) => ({ value: p, label: p })),
  ];

  return (
    <div className="filters">
      <div className="filters__group" role="group" aria-label="Filter by status">
        <div className="segmented">
          {statusChoices.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`segmented__option${statusFilter === value ? " is-active" : ""}`}
              aria-pressed={statusFilter === value}
              onClick={() => onStatusChange(value)}
            >
              {label}
              <span className="segmented__count">{statusCounts[value] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="filters__row">
        <div
          className="filters__group filters__group--priority"
          role="group"
          aria-label="Filter by priority"
        >
          <span className="filters__label" aria-hidden="true">
            Priority
          </span>
          {priorityChoices.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`chip${value !== ALL_FILTER ? ` chip--${value.toLowerCase()}` : ""}${
                priorityFilter === value ? " is-active" : ""
              }`}
              aria-pressed={priorityFilter === value}
              onClick={() => onPriorityChange(value)}
            >
              {value !== ALL_FILTER && <span className="chip__dot" aria-hidden="true" />}
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="btn btn--text"
          onClick={onClear}
          disabled={!hasActiveFilters}
        >
          <RotateCcw size={16} aria-hidden="true" />
          Clear filters
        </button>
      </div>
    </div>
  );
}

export default TaskFilters;

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  parseISODate,
  toISODate,
} from "../hooks/useTasks.js";

const EMPTY_FORM = {
  title: "",
  description: "",
  dueDate: "",
  priority: "Medium",
  category: "Work",
  status: "Pending",
};

const FIELD_ORDER = ["title", "description", "dueDate", "category", "priority", "status"];

function validate(values, isEditing) {
  const errors = {};
  const title = values.title.trim();
  if (!title) errors.title = "Task title is required.";
  else if (title.length < 3) errors.title = "Title must be at least 3 characters.";
  else if (title.length > 80) errors.title = "Title must be 80 characters or fewer.";

  if (values.description.trim().length > 240) {
    errors.description = "Description must be 240 characters or fewer.";
  }

  if (!values.dueDate) errors.dueDate = "Please choose a due date.";
  else if (!parseISODate(values.dueDate)) errors.dueDate = "Please enter a valid date.";
  else if (!isEditing && values.dueDate < toISODate(new Date())) {
    errors.dueDate = "Due date can't be in the past.";
  }

  if (!CATEGORY_OPTIONS.includes(values.category)) errors.category = "Please choose a category.";
  if (!PRIORITY_OPTIONS.includes(values.priority)) errors.priority = "Please choose a priority.";
  if (!STATUS_OPTIONS.includes(values.status)) errors.status = "Please choose a status.";
  return errors;
}

function TaskModal({ task, onClose, onSubmit }) {
  const isEditing = Boolean(task);
  const [values, setValues] = useState(() =>
    task
      ? {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          category: CATEGORY_OPTIONS.includes(task.category) ? task.category : "Work",
          status: task.status,
        }
      : { ...EMPTY_FORM, dueDate: toISODate(new Date()) },
  );
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const dialogRef = useRef(null);
  const fieldRefs = useRef({});

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    fieldRefs.current.title?.focus();
    document.body.classList.add("no-scroll");

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll(
        'button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("no-scroll");
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    if (hasSubmitted) setErrors(validate(nextValues, isEditing));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setHasSubmitted(true);
    const nextErrors = validate(values, isEditing);
    setErrors(nextErrors);
    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }
    onSubmit(values);
  };

  const fieldProps = (name) => ({
    id: `task-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    ref: (element) => {
      fieldRefs.current[name] = element;
    },
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `task-${name}-error` : undefined,
  });

  const renderError = (name) =>
    errors[name] ? (
      <p id={`task-${name}-error`} className="form-field__error" role="alert">
        {errors[name]}
      </p>
    ) : null;

  const renderSelect = (name, label, options) => (
    <div className="form-field">
      <label htmlFor={`task-${name}`} className="form-field__label">
        {label}
      </label>
      <select className="form-field__control" {...fieldProps(name)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {renderError(name)}
    </div>
  );

  return (
    <div className="modal" role="presentation">
      <div className="modal__overlay" onClick={onClose} />
      <div
        ref={dialogRef}
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <div className="modal__header">
          <div>
            <h2 id="task-modal-title" className="modal__title">
              {isEditing ? "Edit task" : "Add new task"}
            </h2>
            <p className="modal__subtitle">
              {isEditing
                ? "Update the details and save your changes."
                : "Fill in the details to add a task to your board."}
            </p>
          </div>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="task-title" className="form-field__label">
              Task title <span aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              className="form-field__control"
              placeholder="e.g. Prepare sprint review slides"
              maxLength={80}
              required
              {...fieldProps("title")}
            />
            {renderError("title")}
          </div>

          <div className="form-field">
            <label htmlFor="task-description" className="form-field__label">
              Description
            </label>
            <textarea
              className="form-field__control form-field__control--textarea"
              rows={3}
              placeholder="Add a short note about this task"
              maxLength={240}
              {...fieldProps("description")}
            />
            <p className="form-field__hint">{values.description.length}/240</p>
            {renderError("description")}
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="task-dueDate" className="form-field__label">
                Due date <span aria-hidden="true">*</span>
              </label>
              <input
                type="date"
                className="form-field__control"
                required
                {...fieldProps("dueDate")}
              />
              {renderError("dueDate")}
            </div>
            {renderSelect("category", "Category", CATEGORY_OPTIONS)}
            {renderSelect("priority", "Priority", PRIORITY_OPTIONS)}
            {renderSelect("status", "Status", STATUS_OPTIONS)}
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              {isEditing ? "Save changes" : "Add task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;

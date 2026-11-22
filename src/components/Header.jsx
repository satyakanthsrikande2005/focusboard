import { useEffect, useRef, useState } from "react";
import { Bell, CalendarDays } from "lucide-react";
import SearchBar from "./SearchBar.jsx";
import { daysUntil } from "../hooks/useTasks.js";

function describeDue(dueDate) {
  const days = daysUntil(dueDate);
  if (days === null) return "No due date";
  if (days < 0) return `Overdue by ${Math.abs(days)} day${days === -1 ? "" : "s"}`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

function Header({ user, searchQuery, onSearchChange, dueSoonTasks, onOpenTask }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    if (!isNotificationsOpen) return undefined;
    const handlePointer = (event) => {
      if (!notificationsRef.current?.contains(event.target)) setIsNotificationsOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setIsNotificationsOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isNotificationsOpen]);

  return (
    <header className="header">
      <div className="header__welcome">
        <h1 className="header__title">Welcome back, {user.name}</h1>
        <p className="header__date">
          <CalendarDays size={16} aria-hidden="true" />
          <time dateTime={new Date().toISOString().slice(0, 10)}>{todayLabel}</time>
        </p>
      </div>

      <div className="header__search">
        <SearchBar value={searchQuery} onChange={onSearchChange} />
      </div>

      <div className="header__actions">
        <div className="notifications" ref={notificationsRef}>
          <button
            type="button"
            className="icon-btn icon-btn--outlined"
            aria-label={`Notifications, ${dueSoonTasks.length} tasks need attention`}
            aria-expanded={isNotificationsOpen}
            aria-haspopup="true"
            onClick={() => setIsNotificationsOpen((open) => !open)}
          >
            <Bell size={20} aria-hidden="true" />
            {dueSoonTasks.length > 0 && <span className="notifications__dot" aria-hidden="true" />}
          </button>
          {isNotificationsOpen && (
            <div className="notifications__panel">
              <p className="notifications__title">Needs attention</p>
              {dueSoonTasks.length === 0 ? (
                <p className="notifications__empty">You're all caught up. Nothing is due soon.</p>
              ) : (
                <ul className="notifications__list">
                  {dueSoonTasks.slice(0, 5).map((task) => (
                    <li key={task.id}>
                      <button
                        type="button"
                        className="notifications__item"
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          onOpenTask(task);
                        }}
                      >
                        <span className="notifications__item-title">{task.title}</span>
                        <span
                          className={`notifications__item-due${daysUntil(task.dueDate) < 0 ? " is-overdue" : ""}`}
                        >
                          {describeDue(task.dueDate)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="profile">
          <span className="profile__avatar" aria-hidden="true">
            {user.initials}
          </span>
          <span className="profile__meta">
            <span className="profile__name">{user.fullName}</span>
            <span className="profile__role">{user.role}</span>
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;

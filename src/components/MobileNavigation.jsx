import { useEffect, useRef } from "react";
import { Menu, Plus, X } from "lucide-react";
import { Logo, NavList } from "./Sidebar.jsx";

function MobileNavigation({ navItems, activeView, onNavigate, onAddTask, isOpen, onOpenChange }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("no-scroll");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen, onOpenChange]);

  const handleNavigate = (viewId) => {
    onNavigate(viewId);
    onOpenChange(false);
  };

  const handleAdd = () => {
    onOpenChange(false);
    onAddTask();
  };

  return (
    <>
      <header className="mobile-bar">
        <button
          type="button"
          className="icon-btn"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          aria-controls="mobile-drawer"
          onClick={() => onOpenChange(true)}
        >
          <Menu size={22} aria-hidden="true" />
        </button>
        <Logo />
        <button
          type="button"
          className="icon-btn icon-btn--primary"
          aria-label="Add new task"
          onClick={onAddTask}
        >
          <Plus size={22} aria-hidden="true" />
        </button>
      </header>

      <div
        className={`drawer${isOpen ? " drawer--open" : ""}`}
        aria-hidden={!isOpen}
        inert={isOpen ? undefined : true}
      >
        <div className="drawer__overlay" onClick={() => onOpenChange(false)} />
        <div
          id="mobile-drawer"
          className="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="drawer__header">
            <Logo />
            <button
              ref={closeButtonRef}
              type="button"
              className="icon-btn"
              aria-label="Close navigation menu"
              onClick={() => onOpenChange(false)}
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>
          <button type="button" className="btn btn--primary btn--block" onClick={handleAdd}>
            <Plus size={18} aria-hidden="true" />
            Add New Task
          </button>
          <nav aria-label="Mobile navigation">
            <NavList items={navItems} activeView={activeView} onNavigate={handleNavigate} />
          </nav>
        </div>
      </div>
    </>
  );
}

export default MobileNavigation;

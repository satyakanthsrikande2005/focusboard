import { Plus } from "lucide-react";

function Logo() {
  return (
    <div className="logo">
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="20" height="20" fill="none">
          <path
            d="M9 16.5l4.5 4.5L23 11"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="logo__text">FocusBoard</span>
    </div>
  );
}

function NavList({ items, activeView, onNavigate }) {
  return (
    <ul className="nav-list">
      {items.map(({ id, label, icon: Icon }) => {
        const isActive = id === activeView;
        return (
          <li key={id}>
            <button
              type="button"
              className={`nav-link${isActive ? " nav-link--active" : ""}`}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onNavigate(id)}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Sidebar({ navItems, activeView, onNavigate, onAddTask }) {
  const mainItems = navItems.filter((item) => item.group === "main");
  const supportItems = navItems.filter((item) => item.group === "support");

  return (
    <aside className="sidebar" aria-label="Sidebar">
      <Logo />
      <button type="button" className="btn btn--primary btn--block" onClick={onAddTask}>
        <Plus size={18} aria-hidden="true" />
        Add New Task
      </button>
      <nav className="sidebar__nav" aria-label="Main navigation">
        <p className="nav-heading">Menu</p>
        <NavList items={mainItems} activeView={activeView} onNavigate={onNavigate} />
        <p className="nav-heading">Support</p>
        <NavList items={supportItems} activeView={activeView} onNavigate={onNavigate} />
      </nav>
      <div className="sidebar__footer">
        <p className="sidebar__tip-title">Stay focused</p>
        <p className="sidebar__tip-text">Plan your top three tasks every morning.</p>
      </div>
    </aside>
  );
}

export { Logo, NavList };
export default Sidebar;

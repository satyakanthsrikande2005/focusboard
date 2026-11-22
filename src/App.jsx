import { useCallback, useMemo, useState } from "react";
import {
  CalendarDays,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  Plus,
  SearchX,
  Settings,
  ClipboardList,
} from "lucide-react";
import Sidebar from "./components/Sidebar.jsx";
import MobileNavigation from "./components/MobileNavigation.jsx";
import Header from "./components/Header.jsx";
import StatsCards from "./components/StatsCards.jsx";
import TaskFilters from "./components/TaskFilters.jsx";
import TaskList from "./components/TaskList.jsx";
import TaskModal from "./components/TaskModal.jsx";
import FocusNotes from "./components/FocusNotes.jsx";
import EmptyState from "./components/EmptyState.jsx";
import { sortByDueDate, useTasks } from "./hooks/useTasks.js";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "main" },
  { id: "tasks", label: "My Tasks", icon: ListChecks, group: "main" },
  { id: "calendar", label: "Calendar", icon: CalendarDays, group: "main" },
  { id: "help", label: "Help Center", icon: LifeBuoy, group: "support" },
  { id: "settings", label: "Settings", icon: Settings, group: "support" },
];

const CURRENT_USER = {
  name: "Satyakanth",
  fullName: "Srikande Satyakanth",
  role: "Product Manager",
  initials: "SS",
};

const TASK_VIEWS = {
  dashboard: { title: "My Tasks", subtitle: "Track, edit and organise everything on your plate." },
  tasks: { title: "All Tasks", subtitle: "Every task on your board, newest first." },
  calendar: { title: "Calendar", subtitle: "Your tasks ordered by due date." },
};

function App() {
  const {
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
  } = useTasks();

  const [activeView, setActiveView] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, task: null });

  const openCreateModal = useCallback(() => setModal({ isOpen: true, task: null }), []);
  const openEditModal = useCallback((task) => setModal({ isOpen: true, task }), []);
  const closeModal = useCallback(() => setModal({ isOpen: false, task: null }), []);

  const handleSubmitTask = (values) => {
    if (modal.task) updateTask(modal.task.id, values);
    else addTask(values);
    closeModal();
  };

  const handleNavigate = useCallback((viewId) => {
    setActiveView(viewId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (activeView === "help" || activeView === "settings") setActiveView("tasks");
  };

  const visibleTasks = useMemo(
    () => (activeView === "calendar" ? sortByDueDate(filteredTasks) : filteredTasks),
    [activeView, filteredTasks],
  );

  const renderTaskPanel = () => {
    const view = TASK_VIEWS[activeView];
    const emptyState =
      tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No tasks yet"
          message="Your board is empty. Add your first task to start tracking your progress."
          actionLabel="Add New Task"
          onAction={openCreateModal}
        />
      ) : (
        <EmptyState
          icon={SearchX}
          title="No matching tasks"
          message="Try a different search term or clear the filters to see all tasks."
          actionLabel="Clear filters"
          onAction={clearFilters}
          actionVariant="ghost"
        />
      );

    return (
      <section className="panel task-panel" aria-labelledby="task-panel-title">
        <div className="panel__header">
          <div>
            <h2 id="task-panel-title" className="panel__title">
              {view.title}
            </h2>
            <p className="panel__subtitle">{view.subtitle}</p>
          </div>
          <button
            type="button"
            className="btn btn--primary"
            onClick={openCreateModal}
          >
            <Plus size={18} aria-hidden="true" />
            Add Task
          </button>
        </div>

        <TaskFilters
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
          statusCounts={statusCounts}
        />

        <p className="task-panel__count" aria-live="polite">
          Showing {visibleTasks.length} of {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </p>

        <TaskList
          tasks={visibleTasks}
          onEdit={openEditModal}
          onDelete={deleteTask}
          onToggleComplete={toggleTaskCompletion}
          emptyState={emptyState}
        />
      </section>
    );
  };

  const handleRestoreSamples = () => {
    const confirmed = window.confirm(
      "Restore the sample tasks? This replaces all tasks currently on your board.",
    );
    if (confirmed) {
      restoreSampleTasks();
      clearFilters();
      setActiveView("dashboard");
    }
  };

  const renderView = () => {
    if (activeView === "help") {
      return (
        <section className="panel">
          <EmptyState
            icon={LifeBuoy}
            title="Help Center"
            message="Use Add New Task to create a task, the search bar to find tasks by title, and the status and priority filters to narrow your list. Tick the circle on a task to mark it complete. Your tasks are saved in this browser automatically."
            actionLabel="Back to Dashboard"
            onAction={() => handleNavigate("dashboard")}
          />
        </section>
      );
    }

    if (activeView === "settings") {
      return (
        <section className="panel">
          <EmptyState
            icon={Settings}
            title="Settings"
            message={`You have ${stats.total} ${stats.total === 1 ? "task" : "tasks"} saved in this browser. Restoring the sample tasks replaces your current board.`}
            actionLabel="Restore sample tasks"
            onAction={handleRestoreSamples}
            actionVariant="ghost"
          />
        </section>
      );
    }

    if (activeView === "dashboard") {
      return (
        <>
          <StatsCards stats={stats} />
          <div className="dashboard-grid">
            {renderTaskPanel()}
            <aside className="dashboard-grid__aside" aria-label="Focus notes">
              <FocusNotes />
            </aside>
          </div>
        </>
      );
    }

    return renderTaskPanel();
  };

  return (
    <div className="app">
      <Sidebar
        navItems={NAV_ITEMS}
        activeView={activeView}
        onNavigate={handleNavigate}
        onAddTask={openCreateModal}
      />

      <div className="app__content">
        <MobileNavigation
          navItems={NAV_ITEMS}
          activeView={activeView}
          onNavigate={handleNavigate}
          onAddTask={openCreateModal}
          isOpen={isMobileMenuOpen}
          onOpenChange={setIsMobileMenuOpen}
        />

        <main className="main" id="main-content">
          <Header
            user={CURRENT_USER}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            dueSoonTasks={dueSoonTasks}
            onOpenTask={openEditModal}
          />
          {renderView()}
        </main>
      </div>

      {modal.isOpen && (
        <TaskModal
          key={modal.task?.id ?? "new-task"}
          task={modal.task}
          onClose={closeModal}
          onSubmit={handleSubmitTask}
        />
      )}
    </div>
  );
}

export default App;

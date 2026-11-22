import TaskItem from "./TaskItem.jsx";

function TaskList({ tasks, onEdit, onDelete, onToggleComplete, emptyState }) {
  if (tasks.length === 0) return emptyState;

  return (
    <ul className="task-list" aria-label="Tasks">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </ul>
  );
}

export default TaskList;

import React from 'react';

const TaskItem = ({ 
  task, 
  onToggle, 
  onEdit, 
  onDelete, 
  todoService 
}) => {
  const isOverdue = todoService.isTaskOverdue(task);
  const isDueSoon = todoService.isTaskDueSoon(task);

  return (
    <article
      className={`task ${task.completed ? "completed" : ""} ${
        isOverdue ? "overdue" : ""
      } ${isDueSoon ? "due-soon" : ""}`}
    >
      <input
        type="checkbox"
        className="check"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />

      <div className="task-content">
        <div className="title">{task.title}</div>
        {task.description && (
          <div className="description">{task.description}</div>
        )}
        <div className="meta">
          <span className="pill">
            <span
              className="dot"
              style={{ background: task.color }}
            ></span>
            {task.subject || "Chung"}
          </span>
          {task.due && (
            <span className="pill">
              <i className="fas fa-clock"></i>
              {todoService.formatVietnameseDate(task.due)}
            </span>
          )}
          <span className="pill">
            {task.priority === "easy" && "⭐ Easy"}
            {task.priority === "normal" && "💪 Normal"}
            {task.priority === "hard" && "🔥 Hard"}
          </span>
        </div>
      </div>

      <div className="task-actions">
        <button 
          className="action-btn" 
          onClick={() => onEdit(task)}
          title="Chỉnh sửa"
        >
          <i className="fas fa-edit"></i>
        </button>
        <button
          className="action-btn danger"
          onClick={() => onDelete(task.id)}
          title="Xóa nhiệm vụ"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </article>
  );
};

export default TaskItem;

import React, { useState, useEffect } from "react";
import todoService from "../services/todolist";
import "../styles/todolist.css";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    due: "",
    priority: "normal",
  });
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null); // Track which task is being edited

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Create floating stars effect
  useEffect(() => {
    todoService.createStarsEffect();
    todoService.addSparkExplosionStyles();

    return () => {
      todoService.removeStarsEffect();
    };
  }, []);

  // Load tasks from service
  const loadTasks = () => {
    const allTasks = todoService.getAllTasks();
    setTasks(allTasks);
  };

  // Get statistics from service
  const stats = todoService.getStatistics();

  // Get filtered tasks from service
  const filteredTasks = todoService.getFilteredTasks(
    filter,
    sortBy,
    searchTerm
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    const errors = [];
    
    if (!formData.title.trim()) {
      errors.push("Tên nhiệm vụ");
    }
    
    if (!formData.subject.trim()) {
      errors.push("Môn học");
    }
    
    if (!formData.due) {
      errors.push("Ngày đến hạn");
    }
    
    // Show alert if there are validation errors
    if (errors.length > 0) {
      alert(`Vui lòng nhập đầy đủ thông tin:\n- ${errors.join("\n- ")}`);
      return;
    }

    if (editingTaskId) {
      // Edit existing task
      const updated = todoService.updateTask(editingTaskId, formData);
      if (updated) {
        loadTasks();
        // Reset form and editing state
        resetForm();
        alert("Cập nhật nhiệm vụ thành công!");
      }
    } else {
      // Add new task with random color
      const taskDataWithColor = {
        ...formData,
        color: todoService.getRandomColor()
      };
      const newTask = todoService.addTask(taskDataWithColor);
      if (newTask) {
        loadTasks();
        // Reset form
        resetForm();
        alert("Thêm nhiệm vụ thành công! 🎉");
      }
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject: "",
      due: "",
      priority: "normal",
    });
    setEditingTaskId(null);
  };

  // Start editing a task
  const handleEditTask = (task) => {
    setFormData({
      title: task.title || "",
      description: task.description || "",
      subject: task.subject || "",
      due: task.due || "",
      priority: task.priority || "normal",
      color: task.color || "#A78BFA",
    });
    setEditingTaskId(task.id);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    resetForm();
  };

  // Toggle task completion
  const handleToggleTask = (id) => {
    const updated = todoService.toggleTask(id);
    if (updated) {
      loadTasks();
      // Show star fireworks effect if task is completed
      if (updated.completed) {
        todoService.showStarFireworks();
      }
    }
  };

  // Delete task
  const handleDeleteTask = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhiệm vụ này?")) {
      const deleted = todoService.deleteTask(id);
      if (deleted) {
        loadTasks();
      }
    }
  };

  // Clear completed tasks
  const handleClearCompleted = () => {
    if (window.confirm("Xóa tất cả nhiệm vụ đã hoàn thành?")) {
      const cleared = todoService.clearCompleted();
      if (cleared > 0) {
        loadTasks();
      }
    }
  };

  return (
    <div className="todolist-container">
      <div className="container">
        {/* Header */}
        <header className="hero">
          <h1>To-Do Học Sinh Pro ✨</h1>
          <p>
            Quản lý học tập thông minh với đầy đủ tính năng: sắp xếp, lọc, thống
            kê, và nhiều hơn nữa! 🚀
          </p>
        </header>

        {/* Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Tổng nhiệm vụ</div>
          </div>
          <div className="stat-card success">
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Đã hoàn thành</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.active}</div>
            <div className="stat-label">Đang làm</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-number">{stats.dueSoon}</div>
            <div className="stat-label">Sắp đến hạn</div>
          </div>
        </div>

        <div className="main-grid">
          {/* Left: Task List */}
          <section className="card">
            <h2>📋 Danh sách nhiệm vụ</h2>

            {/* Controls */}
            <div className="controls">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="created">Mới nhất</option>
                <option value="priority">Độ ưu tiên</option>
                <option value="due">Ngày đến hạn</option>
                <option value="title">Tên A-Z</option>
              </select>

              <button
                className={`btn-sm ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                Tất cả ({stats.total})
              </button>
              <button
                className={`btn-sm ${filter === "active" ? "active" : ""}`}
                onClick={() => setFilter("active")}
              >
                Đang làm ({stats.active})
              </button>
              <button
                className={`btn-sm ${filter === "completed" ? "active" : ""}`}
                onClick={() => setFilter("completed")}
              >
                Hoàn thành ({stats.completed})
              </button>
              <button
                className={`btn-sm ${filter === "due_soon" ? "active" : ""}`}
                onClick={() => setFilter("due_soon")}
              >
                Sắp hạn ({stats.dueSoon})
              </button>
            </div>

            {/* Progress */}
            <div className="progress-label">
              <span>
                <strong>{stats.completed}</strong>/{stats.total} nhiệm vụ
              </span>
              <span>
                {stats.total
                  ? Math.round((stats.completed / stats.total) * 100)
                  : 0}
                % đã xong
              </span>
            </div>
            <div className="progress">
              <div
                style={{
                  width: `${
                    stats.total ? (stats.completed / stats.total) * 100 : 0
                  }%`,
                }}
              ></div>
            </div>

            {/* Search and Clear Row */}
            <div className={`search-clear-row ${stats.completed === 0 ? 'search-only' : ''}`}>
              <div className="search">
                <i className="fas fa-search"></i>
                <input
                  className="input"
                  placeholder="Tìm theo tên, môn học, mức độ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {stats.completed > 0 && (
                <div className="clear">
                  <button className="btn-sm" onClick={handleClearCompleted}>
                    <i className="fas fa-broom"></i> Dọn dẹp ({stats.completed})
                  </button>
                </div>
              )}
            </div>

            {/* Task List */}
            <div className="list">
              {filteredTasks.length === 0 ? (
                <p className="tiny">
                  {filter === "all"
                    ? "Chưa có nhiệm vụ nào. Hãy thêm việc đầu tiên ở bên phải nhé! 💪"
                    : "Không có nhiệm vụ nào trong bộ lọc này."}
                </p>
              ) : (
                filteredTasks.map((task) => {
                  const isOverdue = todoService.isTaskOverdue(task);
                  const isDueSoon = todoService.isTaskDueSoon(task);

                  return (
                    <article
                      key={task.id}
                      className={`task ${task.completed ? "completed" : ""} ${
                        isOverdue ? "overdue" : ""
                      } ${isDueSoon ? "due-soon" : ""}`}
                    >
                      <input
                        type="checkbox"
                        className="check"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id)}
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
                          onClick={() => handleEditTask(task)}
                          title="Chỉnh sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="action-btn danger"
                          onClick={() => handleDeleteTask(task.id)}
                          title="Xóa nhiệm vụ"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

          </section>

          {/* Right: Add Form & Stats */}
          <aside className="card">
            <h2>
              {editingTaskId ? "✏️ Chỉnh sửa nhiệm vụ" : "➕ Thêm nhiệm vụ mới"}
            </h2>
            <form onSubmit={handleSubmit} className="form">
              <input
                className="input"
                name="title"
                placeholder="Ví dụ: Ôn 20 từ vựng Unit 5 *"
                value={formData.title}
                onChange={handleInputChange}
            
              />
              <textarea
                className="input"
                name="description"
                placeholder="Mô tả chi tiết (tùy chọn)"
                value={formData.description}
                onChange={handleInputChange}
              />
              <div className="row">
                <input
                  className="input"
                  name="subject"
                  placeholder="Môn học (Toán, Anh, Lý...) *"
                  value={formData.subject}
                  onChange={handleInputChange}
                
                />
                <input
                  className="input"
                  type="date"
                  name="due"
                  value={formData.due}
                  onChange={handleInputChange}
                 
                  title="Ngày đến hạn *"
                />
              </div>
              <div className="row3">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="easy">⭐ Easy</option>
                  <option value="normal">💪 Normal</option>
                  <option value="hard">🔥 Hard</option>
                </select>
     
                <button className="btn" type="submit">
                  <i className={editingTaskId ? "fas fa-save" : "fas fa-plus"}></i> 
                  {editingTaskId ? "Cập nhật" : "Lưu nhiệm vụ"}
                </button>
                {editingTaskId && (
                  <button 
                    type="button" 
                    className="btn btn-ghost" 
                    onClick={handleCancelEdit}
                  >
                    <i className="fas fa-times"></i> Hủy
                  </button>
                )}
              </div>
              <div className="helper">
                <span className="badge">💡 Gợi ý: phân nhỏ nhiệm vụ</span>
                <span className="badge">⏰ Đặt deadline rõ ràng</span>
                <span className="badge">🎁 Tặng mình phần thưởng nhỏ</span>
              </div>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TodoList;

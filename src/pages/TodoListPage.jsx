import React from "react";
import useTodo from "../hooks/todohook";
import TaskItem from "../components/TaskItem";
import TaskForm from "../components/TaskForm";
import "../styles/todolist.css";

const TodoListPage = () => {
  const {
    // States
    formData,
    filter,
    sortBy,
    searchTerm,
    editingTaskId,
    
    stats,
    filteredTasks,
    
    // Form handlers
    handleInputChange,
    handleSubmit,
    resetForm,
    
    // Task operations
    handleEditTask,
    handleCancelEdit,
    handleToggleTask,
    handleDeleteTask,
    handleClearCompleted,
    
    // Filter/Sort handlers
    handleFilterChange,
    handleSortChange,
    handleSearchChange,
    
    // Service utilities
    todoService,
  } = useTodo();

  return (
    <div className="todolist-container">
      <div className="container">
        <header className="hero">
          <h1>To-Do Học Sinh Pro ✨</h1>
          <p>
            Quản lý học tập thông minh với đầy đủ tính năng: sắp xếp, lọc, thống
            kê, và nhiều hơn nữa! 🚀
          </p>
        </header>

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
          <section className="card">
            <h2><i className="fas fa-tasks"></i> Danh sách nhiệm vụ</h2>

            <div className="controls">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="created">Mới nhất</option>
                <option value="priority">Độ ưu tiên</option>
                <option value="due">Ngày đến hạn</option>
                <option value="title">Tên A-Z</option>
              </select>

              <button
                className={`btn-sm ${filter === "all" ? "active" : ""}`}
                onClick={() => handleFilterChange("all")}
              >
                Tất cả ({stats.total})
              </button>
              <button
                className={`btn-sm ${filter === "active" ? "active" : ""}`}
                onClick={() => handleFilterChange("active")}
              >
                Đang làm ({stats.active})
              </button>
              <button
                className={`btn-sm ${filter === "completed" ? "active" : ""}`}
                onClick={() => handleFilterChange("completed")}
              >
                Hoàn thành ({stats.completed})
              </button>
              <button
                className={`btn-sm ${filter === "due_soon" ? "active" : ""}`}
                onClick={() => handleFilterChange("due_soon")}
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

            <div className={`search-clear-row ${stats.completed === 0 ? 'search-only' : ''}`}>
              <div className="search">
                <i className="fas fa-search"></i>
                <input
                  className="input"
                  placeholder="Tìm theo tên, môn học, mức độ..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
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

            <div className="list">
              {filteredTasks.length === 0 ? (
                <p className="tiny">
                  {filter === "all"
                    ? "Chưa có nhiệm vụ nào. Hãy thêm việc đầu tiên ở bên phải nhé! 💪"
                    : "Không có nhiệm vụ nào trong bộ lọc này."}
                </p>
              ) : (
                filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    todoService={todoService}
                  />
                ))
              )}
            </div>

          </section>

          <TaskForm
            formData={formData}
            editingTaskId={editingTaskId}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default TodoListPage;

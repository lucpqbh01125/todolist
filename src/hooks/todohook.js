import { useState, useEffect } from 'react';
import todoService from '../services/todoService';

// Custom hook cho TodoList - quản lý state và logic CRUD
const useTodo = () => {
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
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    todoService.createStarsEffect();
    todoService.addSparkExplosionStyles();

    return () => {
      todoService.removeStarsEffect();
    };
  }, []);

  const loadTasks = () => {
    const allTasks = todoService.getAllTasks();
    setTasks(allTasks);
  };

  const stats = todoService.getStatistics();
  const filteredTasks = todoService.getFilteredTasks(filter, sortBy, searchTerm);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
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
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      alert(`Vui lòng nhập đầy đủ thông tin:\n- ${errors.join("\n- ")}`);
      return;
    }

    if (editingTaskId) {
      const updated = todoService.updateTask(editingTaskId, formData);
      if (updated) {
        loadTasks();
        resetForm();
        alert("Cập nhật nhiệm vụ thành công!");
      }
    } else {
      const taskDataWithColor = {
        ...formData,
        color: todoService.getRandomColor()
      };
      const newTask = todoService.addTask(taskDataWithColor);
      if (newTask) {
        loadTasks();
        resetForm();
        alert("Thêm nhiệm vụ thành công! 🎉");
      }
    }
  };

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

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleToggleTask = (id) => {
    const updated = todoService.toggleTask(id);
    if (updated) {
      loadTasks();
      if (updated.completed) {
        todoService.showStarFireworks();
      }
    }
  };

  const handleDeleteTask = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhiệm vụ này?")) {
      const deleted = todoService.deleteTask(id);
      if (deleted) {
        loadTasks();
      }
    }
  };

  const handleClearCompleted = () => {
    if (window.confirm("Xóa tất cả nhiệm vụ đã hoàn thành?")) {
      const cleared = todoService.clearCompleted();
      if (cleared > 0) {
        loadTasks();
      }
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  return {
    // States
    tasks,
    formData,
    filter,
    sortBy,
    searchTerm,
    editingTaskId,
    
    // Computed values
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
  };
};

export default useTodo;

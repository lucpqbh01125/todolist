// TodoList Service - Xử lý logic data và business logic

class TodoService {
  constructor() {
    this.storageKey = 'todolist_tasks';
    this.tasks = this.loadTasks();
  }

  // Load tasks from localStorage
  loadTasks() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
    
  }

  // Save tasks to localStorage
  saveTasks() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  // Get all tasks
  getAllTasks() {
    return [...this.tasks];
  }

  // Add new task
  addTask(taskData) {
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      subject: taskData.subject?.trim() || '',
      due: taskData.due || '',
      priority: taskData.priority || 'normal',
      color: taskData.color || '#A78BFA',
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.tasks.unshift(newTask);
    this.saveTasks();
    return newTask;
  }

  // Update task
  updateTask(id, updates) {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = {
        ...this.tasks[taskIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      this.saveTasks();
      return this.tasks[taskIndex];
    }
    return null;
  }

  // Toggle task completion
  toggleTask(id) {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.completed = !task.completed;
      task.updated_at = new Date().toISOString();
      if (task.completed) {
        task.completed_at = new Date().toISOString();
      } else {
        delete task.completed_at;
      }
      this.saveTasks();
      return task;
    }
    return null;
  }

  // Delete task
  deleteTask(id) {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    if (this.tasks.length !== initialLength) {
      this.saveTasks();
      return true;
    }
    return false;
  }

  // Clear completed tasks
  clearCompleted() {
    const completed = this.tasks.filter(task => task.completed).length;
    this.tasks = this.tasks.filter(task => !task.completed);
    this.saveTasks();
    return completed;
  }

  // Get task statistics
  getStatistics() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const active = total - completed;
    
    const dueSoon = this.tasks.filter(t => {
      if (!t.due || t.completed) return false;
      const dueDate = new Date(t.due);
      const today = new Date();
      const diffTime = dueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    }).length;

    const overdue = this.tasks.filter(t => {
      if (!t.due || t.completed) return false;
      const dueDate = new Date(t.due);
      const today = new Date();
      return dueDate < today;
    }).length;

    return { total, completed, active, dueSoon, overdue };
  }

  // Filter tasks
  filterTasks(tasks, filter) {
    switch (filter) {
      case 'active':
        return tasks.filter(t => !t.completed);
      case 'completed':
        return tasks.filter(t => t.completed);
      case 'overdue':
        return tasks.filter(t => {
          if (!t.due || t.completed) return false;
          const dueDate = new Date(t.due);
          const today = new Date();
          return dueDate < today;
        });
      case 'due_soon':
        return tasks.filter(t => {
          if (!t.due || t.completed) return false;
          const dueDate = new Date(t.due);
          const today = new Date();
          const diffTime = dueDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 3 && diffDays >= 0;
        });
      default:
        return tasks;
    }
  }

  // Sort tasks
  sortTasks(tasks, sortBy) {
    const sorted = [...tasks];
    
    switch (sortBy) {
      case 'priority':
        const priorityWeight = { easy: 1, normal: 2, hard: 3 };
        return sorted.sort((a, b) => {
          const weightDiff = (priorityWeight[b.priority] || 2) - (priorityWeight[a.priority] || 2);
          if (weightDiff !== 0) return weightDiff;
          return a.title.localeCompare(b.title);
        });
      
      case 'due':
        return sorted.sort((a, b) => {
          if (!a.due && !b.due) return a.title.localeCompare(b.title);
          if (!a.due) return 1;
          if (!b.due) return -1;
          return new Date(a.due) - new Date(b.due);
        });
      
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      
      case 'created':
      default:
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  }

  // Search tasks (optimized)
  searchTasks(tasks, searchTerm) {
    if (!searchTerm.trim()) return tasks;
    
    const term = searchTerm.toLowerCase();
    return tasks.filter(task => {
      const { title, description, subject, priority } = task;
      return title.toLowerCase().includes(term) ||
             description.toLowerCase().includes(term) ||
             (subject && subject.toLowerCase().includes(term)) ||
             priority.toLowerCase().includes(term);
    });
  }

  // Get filtered and sorted tasks
  getFilteredTasks(filter = 'all', sortBy = 'created', searchTerm = '') {
    let tasks = this.getAllTasks();
    
    // Apply all operations in sequence
    tasks = this.filterTasks(tasks, filter);
    tasks = this.searchTasks(tasks, searchTerm);
    tasks = this.sortTasks(tasks, sortBy);
    
    return tasks;
  }

  // Check if task is overdue
  isTaskOverdue(task) {
    if (!task.due || task.completed) return false;
    const dueDate = new Date(task.due);
    const today = new Date();
    return dueDate < today;
  }

  // Check if task is due soon
  isTaskDueSoon(task) {
    if (!task.due || task.completed) return false;
    const dueDate = new Date(task.due);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  }

  // Format Vietnamese date
  formatVietnameseDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  }

  // Export tasks to JSON
  exportTasks() {
    return {
      tasks: this.tasks,
      exported_at: new Date().toISOString(),
      version: '1.0'
    };
  }

  // Import tasks from JSON
  importTasks(data) {
    try {
      if (data.tasks && Array.isArray(data.tasks)) {
        // Generate new IDs for imported tasks to avoid conflicts
        const importedTasks = data.tasks.map(task => ({
          ...task,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          created_at: task.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        
        this.tasks = [...importedTasks, ...this.tasks];
        this.saveTasks();
        return importedTasks.length;
      }
    } catch (error) {
      console.error('Error importing tasks:', error);
    }
    return 0;
  }

  // === UI UTILITIES === //
  
  // Random color generator for tasks
  getRandomColor() {
    const colors = [
      "#A78BFA", // Purple
      "#F59E0B", // Yellow
      "#EF4444", // Red  
      "#10B981", // Green
      "#06B6D4", // Cyan
      "#8B5CF6", // Violet
      "#F97316", // Orange
      "#EC4899", // Pink
      "#84CC16", // Lime
      "#6366F1", // Indigo
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Create floating stars effect
  createStarsEffect() {
    const n = window.innerWidth > 768 ? 30 : 15;
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < n; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      const size = 2 + Math.random() * 3;
      const left = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = 6 + Math.random() * 8;
      
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}vw;
        bottom: -10vh;
        opacity: 0.6;
        --dx: ${Math.random() * 40 - 20}px;
        animation: floatStar ${duration}s linear ${delay}s infinite;
      `;
      
      fragment.appendChild(star);
    }
    
    document.body.appendChild(fragment);
  }

  // Remove all stars
  removeStarsEffect() {
    document.querySelectorAll('.star').forEach(star => star.remove());
  }

  // Star fireworks effect when task completed
  showStarFireworks() {
    // Get all existing stars
    const stars = document.querySelectorAll('.star');
    
    // Convert stars to colorful fireworks
    stars.forEach((star, index) => {
      setTimeout(() => {
        // Change star color to bright colors
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#FFD93D', '#6BCF7F', '#4D96FF'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Make star bigger and colorful
        star.style.background = color;
        star.style.boxShadow = `0 0 20px ${color}, 0 0 40px ${color}`;
        star.style.transform = 'scale(3)';
        star.style.transition = 'all 0.3s ease';
        
        // Create explosion effect
        setTimeout(() => {
          const rect = star.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          // Create 8 sparks radiating from star
          for (let i = 0; i < 8; i++) {
            const spark = document.createElement("div");
            const angle = (i / 8) * Math.PI * 2;
            const distance = 100 + Math.random() * 50;
            
            spark.style.cssText = `
              position: fixed;
              width: 6px;
              height: 6px;
              background: ${color};
              border-radius: 50%;
              left: ${centerX}px;
              top: ${centerY}px;
              z-index: 9999;
              pointer-events: none;
              box-shadow: 0 0 10px ${color};
              --end-x: ${Math.cos(angle) * distance}px;
              --end-y: ${Math.sin(angle) * distance}px;
              animation: spark-explosion 1s ease-out forwards;
            `;
            
            document.body.appendChild(spark);
            
            // Remove spark after animation
            setTimeout(() => spark.remove(), 1000);
          }
          
          // Hide original star after explosion
          star.style.opacity = '0';
          setTimeout(() => {
            // Reset star to original state
            star.style.background = 'rgba(255, 255, 255, 0.8)';
            star.style.boxShadow = 'none';
            star.style.transform = 'scale(1)';
            star.style.opacity = '0.6';
            star.style.transition = 'none';
          }, 1000);
        }, 300);
      }, index * 100); // Stagger the explosions
    });
  }

  // Add spark explosion CSS animation
  addSparkExplosionStyles() {
    if (!document.querySelector('#spark-explosion-styles')) {
      const style = document.createElement("style");
      style.id = 'spark-explosion-styles';
      style.textContent = `
        @keyframes spark-explosion {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Create singleton instance
const todoService = new TodoService();

export default todoService;

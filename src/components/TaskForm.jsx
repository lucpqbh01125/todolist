import React from 'react';

const TaskForm = ({
  formData,
  editingTaskId,
  onInputChange,
  onSubmit,
  onCancelEdit
}) => {
  return (
    <aside className="card">
      <h2>
        {editingTaskId ? <><i className="fas fa-edit"></i> Chỉnh sửa nhiệm vụ</> 
    : <> <i className="fas fa-plus"></i> Thêm nhiệm vụ mới</>}
      </h2>
      <form onSubmit={onSubmit} className="form">
        <input
          className="input"
          name="title"
          placeholder="Ví dụ: Ôn 20 từ vựng Unit 5 *"
          value={formData.title}
          onChange={onInputChange}
        />
        <textarea
          className="input"
          name="description"
          placeholder="Mô tả chi tiết (tùy chọn)"
          value={formData.description}
          onChange={onInputChange}
        />
        <div className="row">
          <input
            className="input"
            name="subject"
            placeholder="Môn học (Toán, Anh, Lý...) *"
            value={formData.subject}
            onChange={onInputChange}
          />
          <input
            className="input"
            type="date"
            name="due"
            value={formData.due}
            onChange={onInputChange}
            title="Ngày đến hạn *"
          />
        </div>
        <div className="row3">
          <select
            name="priority"
            value={formData.priority}
            onChange={onInputChange}
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
              onClick={onCancelEdit}
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
  );
};

export default TaskForm;

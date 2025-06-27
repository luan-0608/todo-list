import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import DatePicker, { registerLocale } from 'react-datepicker';
import { vi } from 'date-fns/locale/vi';
registerLocale('vi', vi);
import TagsInput from 'react-tagsinput';
import { useTaskStore, type Task, type Subtask } from '../../../stores/taskStore';
import { createRipple } from '../../../utils/rippleEffect';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-tagsinput/react-tagsinput.css';

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task: initialTask, onClose }) => {
  const { 
    addTask, 
    updateTask, 
    editingTask, 
    fetchSuggestions, 
    suggestions, 
    isSuggestionsLoading,
    clearSuggestions
  } = useTaskStore();
  const task = initialTask || editingTask;

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [deadline, setDeadline] = useState(task ? new Date(task.deadline) : new Date());
  const [tags, setTags] = useState(task?.tags || []);
  const [priority, setPriority] = useState<Task['priority']>(task?.priority || 'medium');
  const [subtasks, setSubtasks] = useState<Subtask[]>(task?.subtasks || []);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Xóa gợi ý cũ khi component bị unmount hoặc khi task thay đổi
  useEffect(() => {
    return () => {
      clearSuggestions();
    };
  }, [clearSuggestions, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const taskData = {
      title,
      description,
      tags,
      deadline: deadline.toISOString().split('T')[0],
      priority,
      subtasks,
    };

    if (task) {
      updateTask({ ...task, ...taskData });
    } else {
      addTask(taskData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>{task ? 'Sửa công việc' : 'Tạo công việc mới'}</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tên công việc"
        required
      />
      <div className="form-group">
        <div className="description-header">
          <label htmlFor="description">Mô tả</label>
          <button
            type="button"
            className="preview-toggle-btn"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            title={isPreviewMode ? 'Chỉnh sửa' : 'Xem trước'}
          >
            {isPreviewMode ? '✏️' : '👁️'}
          </button>
        </div>
        {isPreviewMode ? (
          <div className="description-preview markdown-content">
            <ReactMarkdown>{description || '*Chưa có mô tả*'}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả (hỗ trợ Markdown)"
          />
        )}
      </div>
      {task && (
        <div className="suggestion-controls">
          <button 
            type="button" 
            onClick={() => fetchSuggestions(task)} 
            disabled={isSuggestionsLoading}
            className="suggestion-btn"
          >
            {isSuggestionsLoading ? 'Đang tải...' : 'Gợi ý từ AI'}
          </button>
          {suggestions && !isSuggestionsLoading && (
            <button 
              type="button" 
              onClick={() => {
                setDescription((prev: string) => `${prev}${prev ? '\n\n' : ''}**Gợi ý từ AI:**\n${suggestions}`);
                clearSuggestions();
              }}
              className="suggestion-apply-btn"
            >
              Thêm vào mô tả
            </button>
          )}
        </div>
      )}
      {isSuggestionsLoading && <div className="suggestions-box">Đang suy nghĩ...</div>}
      {suggestions && !isSuggestionsLoading && (
        <div className="suggestions-box markdown-content">
          <ReactMarkdown>{suggestions}</ReactMarkdown>
        </div>
      )}
      <div className="form-row">
        <div className="form-group">
          <label>Deadline</label>
          <DatePicker
            selected={deadline}
            onChange={(date) => date && setDeadline(date)}
            dateFormat="dd-MM-yyyy"
            locale="vi"
            className="task-form-datepicker"
          />
        </div>
        <div className="form-group">
          <label>Tags</label>
          <TagsInput value={tags} onChange={setTags} />
        </div>
        <div className="form-group">
          <label>Mức độ ưu tiên</label>
          <div className="priority-group">
            <button type="button" className={`priority-btn low ${priority === 'low' ? 'active' : ''}`} onClick={() => setPriority('low')}>Thấp</button>
            <button type="button" className={`priority-btn medium ${priority === 'medium' ? 'active' : ''}`} onClick={() => setPriority('medium')}>Vừa</button>
            <button type="button" className={`priority-btn high ${priority === 'high' ? 'active' : ''}`} onClick={() => setPriority('high')}>Cao</button>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label>Công việc con</label>
        <TagsInput
          value={subtasks.map(s => s.title)}
          onChange={(newSubtasks) => {
            const newSubtaskObjects = newSubtasks.map((title, index) => {
              const existingSubtask = subtasks[index];
              return existingSubtask && existingSubtask.title === title
                ? existingSubtask
                : { title, completed: false };
            });
            setSubtasks(newSubtaskObjects);
          }}
          inputProps={{ placeholder: 'Thêm công việc con' }}
        />
      </div>
      <div className="form-actions">
        <button type="button" className="ripple-btn" onClick={(e) => { onClose(); createRipple(e); }}>Hủy</button>
        <button type="submit" className="ripple-btn">{task ? 'Cập nhật' : 'Tạo'}</button>
      </div>
    </form>
  );
};

export default TaskForm;
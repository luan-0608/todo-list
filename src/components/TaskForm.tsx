import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { vi } from 'date-fns/locale/vi';
registerLocale('vi', vi);
import TagsInput from 'react-tagsinput';
import { useTaskStore, type Task } from '../stores/taskStore';
import { createRipple } from '../utils/rippleEffect';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-tagsinput/react-tagsinput.css';
import './TaskForm.css';

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task: initialTask, onClose }) => {
  const { addTask, updateTask, editingTask } = useTaskStore();
  const task = initialTask || editingTask;

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [deadline, setDeadline] = useState(task ? new Date(task.deadline) : new Date());
  const [tags, setTags] = useState(task?.tags || []);
  const [priority, setPriority] = useState<Task['priority']>(task?.priority || 'medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const taskData = {
      title,
      description,
      tags,
      deadline: deadline.toISOString().split('T')[0],
      priority,
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
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Mô tả"
      />
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
      <div className="form-actions">
        <button type="button" className="ripple-btn" onClick={(e) => { onClose(); createRipple(e); }}>Hủy</button>
        <button type="submit" className="ripple-btn">{task ? 'Cập nhật' : 'Tạo'}</button>
      </div>
    </form>
  );
};

export default TaskForm;
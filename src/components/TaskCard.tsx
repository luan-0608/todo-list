import React, { useState, useRef, useLayoutEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './TaskCard.css';
import { FiClock, FiCheckCircle, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTaskStore, type Task } from '../stores/taskStore';
import { createRipple } from '../utils/rippleEffect';

type TaskCardProps = Task & {
  onEdit: () => void;
  isFocused: boolean;
  isUnfocused: boolean;
};

const TaskCard: React.FC<TaskCardProps> = ({ onEdit, id, title, description, tags, deadline, createdAt, completedAt, priority, subtasks, isFocused, isUnfocused }) => {
  const { deleteTask, toggleTaskStatus, setFocusedTask, toggleSubtaskStatus } = useTaskStore((state) => ({
    deleteTask: state.deleteTask,
    toggleTaskStatus: state.toggleTaskStatus,
    setFocusedTask: state.setFocusedTask,
    toggleSubtaskStatus: state.toggleSubtaskStatus,
  }));
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showAllSubtasks, setShowAllSubtasks] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useLayoutEffect(() => {
    const descriptionElement = descriptionRef.current;
    if (descriptionElement && !isExpanded) {
      setIsOverflowing(descriptionElement.scrollHeight > descriptionElement.clientHeight);
    } else if (descriptionElement && isExpanded) {
      setIsOverflowing(true);
    }
  }, [description, isExpanded]);


  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa công việc "${title}" không?`)) {
      deleteTask(id);
    }
  };

  const handleToggleStatus = () => {
    toggleTaskStatus(id);
  };

  const handleFocus = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra app-container
    setFocusedTask(isFocused ? null : id);
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài và làm mất focus
    if (isFocused) {
      setIsExpanded(!isExpanded);
    }
    // Nếu không ở chế độ tập trung, không làm gì cả.
  };

  const calculateProgress = () => {
    if (completedAt) return 100;

    const now = new Date().getTime();

    // Phân tích chuỗi createdAt thành ngày địa phương (bỏ qua giờ)
    const startDate = new Date(createdAt);
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();

    // Phân tích chuỗi deadline và đặt nó vào cuối ngày đó
    const deadlineDate = new Date(deadline);
    const end = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate(), 23, 59, 59, 999).getTime();

    if (now >= end) return 100; // Đã qua hạn
    if (now < start) return 0;  // Chưa bắt đầu

    const totalDuration = end - start;
    if (totalDuration <= 0) return now >= end ? 100 : 0;

    const elapsedDuration = now - start;
    const progress = (elapsedDuration / totalDuration) * 100;

    return Math.min(100, Math.max(0, progress)); // Đảm bảo tiến độ trong khoảng 0-100
  };

  const getPriorityClass = () => {
    return `priority-${priority}`;
  };

  const isDeadlineUrgent = () => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    return deadlineDate <= threeDaysFromNow && deadlineDate >= today;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        task-card
        ${getPriorityClass()}
        ${!!completedAt ? 'completed' : ''}
        ${isUnfocused ? 'is-unfocused' : ''}
        ${isFocused ? 'is-focused' : ''}
      `}
    >
      <div className="task-card-header">
        <h3 className="task-card-title">{title}</h3>
        <div className="header-meta">
          <span className={`task-priority-text priority-${priority}`}>{priority}</span>
        </div>
      </div>
      <div className="task-card-description-wrapper" onPointerDown={(e) => e.stopPropagation()}>
        <div ref={descriptionRef} className={`task-card-description markdown-content ${isExpanded ? 'expanded' : ''}`}>
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
        {isOverflowing && (
          <button
            onClick={(e) => handleToggleExpand(e)}
            className={`expand-btn ${!isFocused ? 'disabled' : ''}`}
            data-tooltip-id="tooltip"
            data-tooltip-content={!isFocused ? 'Nhấn vào biểu tượng con mắt để tập trung và xem thêm' : ''}
          >
            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        )}
      </div>
      {subtasks && subtasks.length > 0 && (
        <div className="subtasks-list" onPointerDown={(e) => e.stopPropagation()}>
          <h5>Công việc con:</h5>
          {(showAllSubtasks ? subtasks : subtasks.slice(0, 3)).map((subtask) => (
            <div key={subtask.title} className="subtask-item">
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => toggleSubtaskStatus(id, subtask.title)}
                id={`subtask-${id}-${subtask.title}`}
              />
              <label htmlFor={`subtask-${id}-${subtask.title}`} className={subtask.completed ? 'completed' : ''}>
                {subtask.title}
              </label>
            </div>
          ))}
          {subtasks.length > 3 && (
            <button onClick={() => setShowAllSubtasks(!showAllSubtasks)} className="expand-subtasks-btn">
              {showAllSubtasks ? 'Thu gọn' : `Xem thêm +${subtasks.length - 3}`}
            </button>
          )}
        </div>
      )}
      <div className="task-card-tags" onPointerDown={(e) => e.stopPropagation()}>
        {tags.slice(0, 2).map(tag => <span key={tag} className="task-card-tag">{tag}</span>)}
        {tags.length > 2 && (
          <span
            className="task-card-tag more-tags"
            data-tooltip-id="task-tags-tooltip"
            data-tooltip-content={tags.slice(2).join(', ')}
          >
            +{tags.length - 2}
          </span>
        )}
      </div>
      <div className="task-card-footer">
        <div className={`task-card-deadline ${isDeadlineUrgent() ? 'deadline-urgent' : ''}`}>
          <FiClock />
          <span>{deadline}</span>
        </div>
        <div className="task-card-progress-bar">
          <div className="task-card-progress" style={{ width: `${calculateProgress()}%` }}></div>
        </div>
      </div>
      <div className="task-card-actions" onPointerDown={(e) => e.stopPropagation()}>
        <button onClick={(e) => { handleFocus(e); createRipple(e); }} className="action-btn focus-btn ripple-btn"><FiEye /></button>
        <button onClick={(e) => { handleToggleStatus(); createRipple(e); }} className="action-btn complete-btn ripple-btn"><FiCheckCircle /></button>
        <button onClick={(e) => { onEdit(); createRipple(e); }} className="action-btn edit-btn ripple-btn"><FiEdit /></button>
        <button onClick={(e) => { handleDelete(); createRipple(e); }} className="action-btn delete-btn ripple-btn"><FiTrash2 /></button>
      </div>
    </div>
  );
};

export default TaskCard;
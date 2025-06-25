import React, { useState, useRef, useLayoutEffect } from 'react';
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

const TaskCard: React.FC<TaskCardProps> = ({ onEdit, id, title, description, tags, deadline, progress, priority, isFocused, isUnfocused }) => {
  const { deleteTask, toggleTaskStatus, setFocusedTask } = useTaskStore((state) => ({
    deleteTask: state.deleteTask,
    toggleTaskStatus: state.toggleTaskStatus,
    setFocusedTask: state.setFocusedTask,
  }));
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

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
        ${progress === 100 ? 'completed' : ''}
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
      <div className="task-card-description-wrapper">
        <p ref={descriptionRef} className={`task-card-description ${isExpanded ? 'expanded' : ''}`}>{description}</p>
        {isOverflowing && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="expand-btn">
            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        )}
      </div>
      <div className="task-card-tags">
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
          <div className="task-card-progress" style={{ width: `${progress}%` }}></div>
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
import React, { useState } from 'react';
import { format, startOfWeek, addDays, subWeeks, addWeeks, isSameDay, parseISO, startOfMonth, eachDayOfInterval, isSameMonth, subMonths, addMonths } from 'date-fns';
import { DndContext, useDraggable, useDroppable, type DragEndEvent, closestCenter } from '@dnd-kit/core';
import { useTaskStore, type Task } from '../stores/taskStore';
import './CalendarView.css';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

interface DraggableTaskProps {
  task: Task;
  children: React.ReactNode;
}

const DraggableTask: React.FC<DraggableTaskProps> = ({ task, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `task-${task.id}`,
    data: { task },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 100 : undefined,
    cursor: 'grabbing',
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={isDragging ? 'dragging' : ''}>
      {children}
    </div>
  );
};

interface DroppableDayProps {
  day: Date;
  children: React.ReactNode;
}

const DroppableDay: React.FC<DroppableDayProps> = ({ day, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${format(day, 'yyyy-MM-dd')}`,
  });

  return (
    <div ref={setNodeRef} className={`calendar-day ${isSameDay(day, new Date()) ? 'today' : ''} ${isOver ? 'drag-over' : ''}`}>
      {children}
    </div>
  );
};


const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const { updateTask } = useTaskStore();

  const renderDays = () => {
    if (viewMode === 'month') {
      const monthStart = startOfMonth(currentDate);
      const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
      // Always render 6 weeks (42 days) to prevent layout shifts
      const endDate = addDays(startDate, 41);
      return eachDayOfInterval({ start: startDate, end: endDate });
    } else {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      return Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
    }
  };

  const days = renderDays();

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const handleToday = () => setCurrentDate(new Date());

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over && active.data.current) {
      const task = active.data.current.task as Task;
      const newDeadlineStr = over.id.toString().replace('day-', '');
      const newDeadline = format(parseISO(newDeadlineStr), 'yyyy-MM-dd');
      
      if (task.deadline !== newDeadline) {
        updateTask({ ...task, deadline: newDeadline });
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="calendar-view">
        <div className="calendar-header">
          <div className="calendar-nav">
            <button onClick={handlePrev}>{'<'}</button>
            <button onClick={handleToday}>Hôm nay</button>
            <button onClick={handleNext}>{'>'}</button>
            <span className="current-date-display">
              {viewMode === 'month'
                ? format(currentDate, 'MMMM yyyy')
                : `${format(days[0], 'dd/MM')} - ${format(days[6], 'dd/MM/yyyy')}`}
            </span>
          </div>
          <div className="calendar-mode-switcher">
            <button onClick={() => setViewMode('week')} className={viewMode === 'week' ? 'active' : ''}>Tuần</button>
            <button onClick={() => setViewMode('month')} className={viewMode === 'month' ? 'active' : ''}>Tháng</button>
          </div>
        </div>

        <div className={`calendar-grid-container ${viewMode}`}>
          {viewMode === 'week' && (
             <div className="day-names-grid">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(dayName => (
                  <span key={dayName} className="day-name-header">{dayName}</span>
                ))}
            </div>
          )}
          {viewMode === 'month' && (
            <div className="day-names-grid">
              <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
            </div>
          )}
          <div className="days-grid">
            {days.map(day => (
              <DroppableDay key={day.toString()} day={day}>
                <div className={`day-header ${!isSameMonth(day, currentDate) && viewMode === 'month' ? 'not-current-month' : ''}`}>
                  <span className="day-number">{format(day, 'd')}</span>
                </div>
                <div className="tasks-container">
                  {tasks
                    .filter(task => isSameDay(parseISO(task.deadline), day))
                    .map(task => (
                      <DraggableTask key={task.id} task={task}>
                        <div
                          className={`calendar-task priority-${task.priority}`}
                          onClick={() => onTaskClick(task)}
                        >
                          {task.title}
                        </div>
                      </DraggableTask>
                    ))}
                </div>
              </DroppableDay>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default CalendarView;
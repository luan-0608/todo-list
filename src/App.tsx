import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import CalendarView from './components/CalendarView';
import AiSettingsModal from './components/AiSettingsModal';
import SmartInput from './components/SmartInput';
import StatsDashboard from './components/StatsDashboard';
import PomodoroTimer from './components/PomodoroTimer';
import { Tooltip } from 'react-tooltip';
import { useTaskStore, type Task } from './stores/taskStore';
import './App.css';

type ViewMode = 'grid' | 'calendar';

function App() {
  const {
    tasks,
    setTasks,
    focusedTaskId,
    setFocusedTask,
    sortByDeadline,
    sortByPriority,
    isAiSettingsModalOpen,
    toggleAiSettingsModal
  } = useTaskStore((state) => ({
    tasks: state.tasks,
    setTasks: state.setTasks,
    focusedTaskId: state.focusedTaskId,
    setFocusedTask: state.setFocusedTask,
    sortByDeadline: state.sortByDeadline,
    sortByPriority: state.sortByPriority,
    isAiSettingsModalOpen: state.isAiSettingsModalOpen,
    toggleAiSettingsModal: state.toggleAiSettingsModal,
  }));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isPomodoroVisible, setIsPomodoroVisible] = useState(false);
  const [theme, setTheme] = useState('light');
  const [colorTheme] = useState('default');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.body.setAttribute('data-color-theme', colorTheme);
  }, [theme, colorTheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      setTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
    500: 1
  };

  return (
    <div className={`app-container ${focusedTaskId ? 'focus-mode-active' : ''}`} data-theme={theme} onClick={focusedTaskId ? () => setFocusedTask(null) : undefined}>
      <div className="top-right-controls">
        <button onClick={toggleTheme} className="theme-switcher-btn ripple-btn">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button
          onClick={() => setIsPomodoroVisible(!isPomodoroVisible)}
          className="ripple-btn"
          data-tooltip-id="tooltip"
          data-tooltip-content={isPomodoroVisible ? 'Ẩn Pomodoro' : 'Hiện Pomodoro'}
        >
          ⏰
        </button>
        <button
          onClick={toggleAiSettingsModal}
          className="settings-btn ripple-btn"
          data-tooltip-id="tooltip"
          data-tooltip-content="Cài đặt AI"
        >
          ⚙️
        </button>
      </div>
      <SmartInput />
      <header className="app-header">
        <div className="header-title-wrapper">
          <h1>Danh sách công việc</h1>
          <div className="sort-controls">
            <button onClick={sortByDeadline} className="ripple-btn">Sắp xếp theo Deadline</button>
            <button onClick={sortByPriority} className="ripple-btn">Sắp xếp theo Ưu tiên</button>
          </div>
        </div>
        <div className="header-right-controls">
          <div className="view-switcher">
            <button onClick={() => setViewMode('grid')} className={`ripple-btn ${viewMode === 'grid' ? 'active' : ''}`}>Lưới</button>
            <button onClick={() => setViewMode('calendar')} className={`ripple-btn ${viewMode === 'calendar' ? 'active' : ''}`}>Lịch</button>
          </div>
          <div className="header-actions">
            <button onClick={openCreateModal} className="add-task-btn ripple-btn">
              + Tạo công việc mới
            </button>
          </div>
          <StatsDashboard />
        </div>
      </header>
      <main>
        {viewMode === 'grid' ? (
          <div className="tasks-grid-container">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={tasks} strategy={rectSortingStrategy}>
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  {tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      onEdit={() => openEditModal(task)}
                      isFocused={task.id === focusedTaskId}
                      isUnfocused={!!focusedTaskId && task.id !== focusedTaskId}
                      {...task}
                    />
                  ))}
                </Masonry>
              </SortableContext>
            </DndContext>
          </div>
        ) : (
          <CalendarView tasks={tasks} onTaskClick={openEditModal} />
        )}
      </main>
      <TaskModal isOpen={isModalOpen} onClose={closeModal} task={editingTask} />
      {isAiSettingsModalOpen && <AiSettingsModal />}
      <Tooltip id="task-tags-tooltip" />
      <Tooltip id="tooltip" />
      {isPomodoroVisible && <PomodoroTimer />}
    </div>
  )
}

export default App;

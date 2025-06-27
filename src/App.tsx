import { useState } from 'react';
import { Tooltip } from 'react-tooltip';

import AiSettingsModal from './components/AiSettingsModal';
import TaskModal from './features/tasks/components/TaskModal';
import PomodoroTimer from './components/PomodoroTimer';
import MainLayout from './layouts/MainLayout';

import { useTaskStore } from './stores/taskStore';
import { useTheme } from './hooks/useTheme';
import './App.css';
import './features/tasks/TaskStyles.css';

type ViewMode = 'grid' | 'calendar';

function App() {
  const {
    focusedTaskId,
    setFocusedTask,
    isAiSettingsModalOpen,
    isTaskModalOpen,
    editingTask,
    closeTaskModal,
  } = useTaskStore((state) => ({
    focusedTaskId: state.focusedTaskId,
    setFocusedTask: state.setFocusedTask,
    isAiSettingsModalOpen: state.isAiSettingsModalOpen,
    isTaskModalOpen: state.isTaskModalOpen,
    editingTask: state.editingTask,
    closeTaskModal: state.closeTaskModal,
  }));

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isPomodoroVisible, setIsPomodoroVisible] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`app-container ${focusedTaskId ? 'focus-mode-active' : ''}`}
      onClick={focusedTaskId ? () => setFocusedTask(null) : undefined}
    >
      <MainLayout
        theme={theme}
        onToggleTheme={toggleTheme}
        isPomodoroVisible={isPomodoroVisible}
        onTogglePomodoro={() => setIsPomodoroVisible(!isPomodoroVisible)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        task={editingTask || undefined}
      />
      {isAiSettingsModalOpen && <AiSettingsModal />}
      <Tooltip id="task-tags-tooltip" />
      <Tooltip id="tooltip" />
      {isPomodoroVisible && <PomodoroTimer />}
    </div>
  )
}

export default App;

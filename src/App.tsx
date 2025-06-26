import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';

import TaskModal from './components/TaskModal';
import AiSettingsModal from './components/AiSettingsModal';
import SmartInput from './components/SmartInput';
import PomodoroTimer from './components/PomodoroTimer';
import AppHeader from './components/AppHeader';
import TopControls from './components/TopControls';
import TaskView from './components/TaskView';

import { useTaskStore } from './stores/taskStore';
import './App.css';

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
  const [theme, setTheme] = useState('light');
  const [colorTheme] = useState('default');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.body.setAttribute('data-color-theme', colorTheme);
  }, [theme, colorTheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div
      className={`app-container ${focusedTaskId ? 'focus-mode-active' : ''}`}
      data-theme={theme}
      onClick={focusedTaskId ? () => setFocusedTask(null) : undefined}
    >
      <TopControls
        theme={theme}
        onToggleTheme={toggleTheme}
        isPomodoroVisible={isPomodoroVisible}
        onTogglePomodoro={() => setIsPomodoroVisible(!isPomodoroVisible)}
      />
      <SmartInput />
      <AppHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <TaskView viewMode={viewMode} />
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

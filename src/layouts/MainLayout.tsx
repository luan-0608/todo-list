import type { Dispatch, SetStateAction } from 'react';
import TopControls from '../components/TopControls';
import SmartInput from '../components/SmartInput';
import AppHeader from '../components/AppHeader';
import TaskView from '../features/tasks/components/TaskView';
import type { Theme } from '../hooks/useTheme';

type ViewMode = 'grid' | 'calendar';

type MainLayoutProps = {
  theme: Theme;
  onToggleTheme: () => void;
  isPomodoroVisible: boolean;
  onTogglePomodoro: () => void;
  viewMode: ViewMode;
  onViewModeChange: Dispatch<SetStateAction<ViewMode>>;
};

const MainLayout = ({
  theme,
  onToggleTheme,
  isPomodoroVisible,
  onTogglePomodoro,
  viewMode,
  onViewModeChange,
}: MainLayoutProps) => {
  return (
    <main className="main-content">
      <TopControls
        theme={theme}
        onToggleTheme={onToggleTheme}
        isPomodoroVisible={isPomodoroVisible}
        onTogglePomodoro={onTogglePomodoro}
      />
      <SmartInput />
      <AppHeader
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />
      <TaskView viewMode={viewMode} />
    </main>
  );
};

export default MainLayout;
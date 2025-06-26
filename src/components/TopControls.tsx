import { useTaskStore } from '../stores/taskStore';

interface TopControlsProps {
  theme: string;
  onToggleTheme: () => void;
  isPomodoroVisible: boolean;
  onTogglePomodoro: () => void;
}

const TopControls = ({ theme, onToggleTheme, isPomodoroVisible, onTogglePomodoro }: TopControlsProps) => {
  const { toggleAiSettingsModal } = useTaskStore((state) => ({
    toggleAiSettingsModal: state.toggleAiSettingsModal,
  }));

  return (
    <div className="top-right-controls">
      <button onClick={onToggleTheme} className="theme-switcher-btn ripple-btn">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <button
        onClick={onTogglePomodoro}
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
  );
};

export default TopControls;
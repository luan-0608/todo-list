import { useTaskStore } from '../stores/taskStore';
import StatsDashboard from './StatsDashboard';

type ViewMode = 'grid' | 'calendar';

interface AppHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const AppHeader = ({ viewMode, onViewModeChange }: AppHeaderProps) => {
  const { sortByDeadline, sortByPriority, openTaskModal } = useTaskStore((state) => ({
    sortByDeadline: state.sortByDeadline,
    sortByPriority: state.sortByPriority,
    openTaskModal: state.openTaskModal,
  }));

  return (
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
          <button onClick={() => onViewModeChange('grid')} className={`ripple-btn ${viewMode === 'grid' ? 'active' : ''}`}>Lưới</button>
          <button onClick={() => onViewModeChange('calendar')} className={`ripple-btn ${viewMode === 'calendar' ? 'active' : ''}`}>Lịch</button>
        </div>
        <div className="header-actions">
          <button onClick={() => openTaskModal()} className="add-task-btn ripple-btn">
            + Tạo công việc mới
          </button>
        </div>
        <StatsDashboard />
      </div>
    </header>
  );
};

export default AppHeader;
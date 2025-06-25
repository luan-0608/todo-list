import React from 'react';
import { useTaskStore } from '../stores/taskStore';
import './StatsDashboard.css';

const StatsDashboard: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completedAt).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const remainingTasks = totalTasks - completedTasks;

  if (totalTasks === 0) {
    return null;
  }

  return (
    <div className="stats-dashboard-card">
      <div className="stats-summary">
        <div className="stat-item">
          <span className="stat-number">{totalTasks}</span>
          <span className="stat-label">Tổng</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{completedTasks}</span>
          <span className="stat-label">Xong</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{remainingTasks}</span>
          <span className="stat-label">Còn lại</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{completionRate}%</span>
          <span className="stat-label">Tỷ lệ</span>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
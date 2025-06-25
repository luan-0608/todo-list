import React from 'react';
import './BadgesDisplay.css';

// In a real app, this would be more dynamic
const badges = [
  { id: 1, name: 'Tân binh', icon: '🥉', description: 'Hoàn thành công việc đầu tiên' },
  { id: 2, name: 'Chăm chỉ', icon: '🔥', description: 'Hoàn thành 5 công việc' },
  { id: 3, name: 'Bậc thầy', icon: '🏆', description: 'Hoàn thành 10 công việc' },
];

const BadgesDisplay: React.FC = () => {
  // Logic to determine which badges are earned would go here
  const earnedBadges = badges.slice(0, 2); // Mock: assume first 2 are earned

  return (
    <div className="badges-widget">
      <h4>Huy hiệu</h4>
      <div className="badges-container">
        {earnedBadges.map(badge => (
          <div key={badge.id} className="badge" title={badge.description}>
            <span className="badge-icon">{badge.icon}</span>
            <span className="badge-name">{badge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesDisplay;
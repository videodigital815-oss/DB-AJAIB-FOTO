
import React from 'react';

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-teal-600';
  const inactiveClasses = 'text-gray-500';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      <div className={`p-1 rounded-full ${isActive ? 'bg-teal-100' : ''}`}>
        {icon}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export default TabButton;

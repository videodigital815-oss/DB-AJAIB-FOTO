
import React from 'react';

interface TabContentContainerProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

const TabContentContainer: React.FC<TabContentContainerProps> = ({ icon, title, description, children }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-teal-100 text-teal-600 p-2 rounded-full">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="mt-4 space-y-6">
        {children}
      </div>
    </div>
  );
};

export default TabContentContainer;

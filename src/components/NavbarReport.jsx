import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavbarReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('junta')) return 'junta';
    if (path.includes('utilizacion')) return 'utilizacion';
    if (path.includes('dms')) return 'dms';
    if (path.includes('cumplimiento')) return 'cumplimiento';
    return 'junta'; // Default
  };
  
  const activeTab = getActiveTab();
  
  const tabs = [
    { id: 'junta', label: 'Junta previa', path: '/reporte1' },
    { id: 'utilizacion', label: 'Utilización', path: '/utilizacion' },
    { id: 'dms', label: 'DMS', path: '/dms' },
    { id: 'cumplimiento', label: 'Cumplimiento', path: '/cumplimiento' }
  ];
  
  const handleNavigation = (path) => {
    navigate(path);
  };
  
  return (
    <div className="w-full border-b border-gray-200">
      <nav className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleNavigation(tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default NavbarReport;
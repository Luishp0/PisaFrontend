import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NavbarReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabsRef = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Determine active tab based on current path
  const getActiveTabIndex = () => {
    const path = location.pathname;
    if (path.includes('junta')) return 0;
    if (path.includes('utilizacion')) return 1;
    if (path.includes('dms')) return 2;
    if (path.includes('cumplimiento')) return 3;
    return 0; // Default to first tab
  };
  
  const tabs = [
    { id: 'junta', label: 'Junta previa', path: '/reporte1' },
    { id: 'utilizacion', label: 'Utilización', path: '/reporte3' },
    { id: 'dms', label: 'DMS', path: '/dms' },
    { id: 'cumplimiento', label: 'Cumplimiento', path: '/reporte2' }
  ];
  
  const activeTabIndex = getActiveTabIndex();
  
  // Update indicator position when component mounts or route changes
  useEffect(() => {
    updateIndicatorPosition(activeTabIndex);
  }, [location.pathname]);
  
  // Initialize references when component mounts
  useEffect(() => {
    if (tabsRef.current.length > 0) {
      updateIndicatorPosition(activeTabIndex);
    }
  }, [tabsRef]);
  
  // Close mobile menu when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);
  
  const updateIndicatorPosition = (index) => {
    if (tabsRef.current[index]) {
      const tabElement = tabsRef.current[index];
      setIndicatorStyle({
        left: `${tabElement.offsetLeft}px`,
        width: `${tabElement.offsetWidth}px`
      });
    }
  };
  
  const handleNavigation = (path, index) => {
    // Update the indicator position immediately
    updateIndicatorPosition(index);
    // Navigate to the new route
    navigate(path);
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  
  return (
    <div className="w-full relative">
      {/* Mobile menu button - only visible on small screens */}
      <div className="md:hidden flex justify-between items-center border-b border-gray-200 py-2">
        <span className="font-medium ml-2">
          {tabs[activeTabIndex].label}
        </span>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-600 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu - only visible when toggled on small screens */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white absolute w-full z-10 shadow-lg">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`w-full text-left px-4 py-3 font-medium text-sm focus:outline-none transition-colors duration-200 ${
                index === activeTabIndex
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-black hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => handleNavigation(tab.path, index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      
      {/* Desktop navigation - hidden on small screens */}
      <nav className="hidden md:flex">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => (tabsRef.current[index] = el)}
            className={`px-4 py-3 font-medium text-sm focus:outline-none transition-colors duration-200 ${
              index === activeTabIndex
                ? 'text-blue-600'
                : 'text-black hover:text-blue-600'
            } lg:px-8`}
            onClick={() => handleNavigation(tab.path, index)}
          >
            {tab.label}
          </button>
        ))}
        
        {/* Animated indicator - only shown on desktop */}
        <div 
          className="absolute bottom-0 h-1 bg-blue-600 transition-all duration-300"
          style={indicatorStyle}
        ></div>
      </nav>
      <div className="hidden md:block border-b border-gray-200"></div>
    </div>
  );
};

export default NavbarReport;
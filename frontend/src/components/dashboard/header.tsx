import React from 'react';
import WalmartLogo from '../home_page/Walmart_logo.svg.png';
import '../../components_css/dashboard_css/header.css';

interface DashboardHeaderProps {
  onBack: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onBack, onLogout }) => (
  <div className="dashboard-header-glow">
    <button className="premium-btn back-btn" onClick={onBack}>←</button>
    <div className="header-center">
      <img src={WalmartLogo} alt="Walmart Logo" className="walmart-logo" />
      <span className="header-title">Sparkathon: Dashboard</span>
    </div>
    <button className="premium-btn logout-btn" onClick={onLogout}>Logout</button>
  </div>
);

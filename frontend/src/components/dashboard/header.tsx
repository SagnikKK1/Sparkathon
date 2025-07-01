import React from 'react';
import WalmartLogo from '../home_page/Walmart_logo.svg.png'; // Adjust path if needed
import '../../components_css/dashboard_css/header.css'; // Create this CSS file if not present

interface DashboardHeaderProps {
  onBack: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onBack, onLogout }) => (
  <div className="dashboard-header-glow">
    <button className="back-button" onClick={onBack}>←</button>
    <div className="header-center">
      <img src={WalmartLogo} alt="Walmart Logo" className="walmart-logo" />
      <span className="header-title">Walmart Sparkathon: Dashboard</span>
    </div>
    <button className="logout-button" onClick={onLogout}>Logout</button>
  </div>
);

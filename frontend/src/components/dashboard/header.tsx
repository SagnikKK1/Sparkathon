import React from 'react';
import WalmartLogo from '../home_page/Walmart_logo.svg.png';
import BackButtonIcon from '../dashboard/backButton.png';
import '../../components_css/dashboard_css/header.css';
import { LogoutLink } from '../dashboard/logout_button';

interface DashboardHeaderProps {
  onBack: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onBack, onLogout }) => (
  <div className="dashboard-header-glow">
    <button className="premium-btn back-btn" onClick={onBack} aria-label="Back">
      <img src={BackButtonIcon} alt="Back" className="back-btn-icon" />
    </button>
    <div className="header-center">
      <img src={WalmartLogo} alt="Walmart Logo" className="walmart-logo" />
      <span className="header-title">Sparkathon: Dashboard</span>
    </div>
    <LogoutLink onLogout={onLogout} />
  </div>
);

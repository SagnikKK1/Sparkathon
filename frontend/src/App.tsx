import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/home_page';
import { LoginPage } from './pages/login_page';
import { SignupPage } from './pages/signup_page';
import { DashboardPage } from './pages/dashboard';
import { Loading } from './pages/loading';
import './App.css';
import ChatbotPage from './pages/chatbot';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/loading" element={< Loading />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
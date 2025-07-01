import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/home_page';
import { LoginPage } from './pages/login_page';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
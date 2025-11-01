// pages/HomePage.jsx
import { Navigate } from "react-router-dom";
import ProfileBtn from "../components/ProfileBtn";
import '../styles/HomePage.css'; // ← Подключи CSS

export function HomePage() {
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (!username) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">
          Привет, <span className="username-highlight">{username}</span>!
        </h1>
        <p className="home-subtitle">Добро пожаловать в соцсеть</p>

        <div className="home-actions">
          <ProfileBtn userId={userId} />
          <button onClick={handleLogout} className="btn-logout">
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}
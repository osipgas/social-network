// pages/HomePage.jsx
import { Navigate } from "react-router-dom";
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
        <div className="home-actions">

          <button onClick={() => {window.location.href = `/profile/${userId}/${username}`;}}> Profile </button>
          <button onClick={() => {window.location.href = '/search';}}> Search </button>
          
          <button onClick={handleLogout} className="btn-logout"> Log Out </button>

        </div>
      </div>
    </div>
  );
}
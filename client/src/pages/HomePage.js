// pages/HomePage.jsx
import { Navigate } from "react-router-dom";
import '../styles/HomePage.css'; // ← Подключи CSS

export function HomePage() {
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');

  if (!username) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-actions">
          <button onClick={() => {}}> Home </button>
          <button onClick={() => {window.location.href = '/search';}}> Search </button>
          <button onClick={() => {}}> Chats </button>
          <button onClick={() => {window.location.href = `/profile/${userId}/${username}`;}}> Profile </button>
        </div>
      </div>
    </div>
  );
}
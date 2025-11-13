import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from 'react'; // Нужен для получения ID
import '../styles/MainLayout.css'; // <-- Переименуй CSS файл

export function MainLayout() {
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  
  // 1. Используем хук useNavigate для навигации без перезагрузки
  const navigate = useNavigate();

  // 2. Проверка авторизации. Если ее нет, MainLayout не рендерится
  if (!username) {
    return <Navigate to="/login" />;
  }

  // 3. Обновленные функции навигации
  const goToHome = () => navigate('/');
  const goToSearch = () => navigate('/search');
  const goToChats = () => navigate('/chats');
  const goToProfile = () => navigate(`/profile/${userId}/${username}`);

  return (
    <div className="layout-container"> {/* (Переименован из .home-container) */}
      
      {/* ЗДЕСЬ БУДЕТ "НАЧИНКА" 
        Это та самая "дыра", куда React Router будет 
        вставлять ProfilePage, SearchPage и т.д.
      */}
      <div className="main-content">
        <Outlet />
      </div>

      {/* А ЭТО ТВОЯ ПАНЕЛЬ - ОНА ТЕПЕРЬ ПОСТОЯННА
        (Переименован из .home-actions в .bottom-nav для ясности)
      */}
      <div className="bottom-nav">
        <button onClick={goToHome}> Home </button>
        <button onClick={goToSearch}> Search </button>
        <button onClick={goToChats}> Chats </button>
        <button onClick={goToProfile}> Profile </button>
      </div>
    </div>
  );
}
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
        <button onClick={goToHome}> 
          <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 16.8059C1.5 13.3732 1.5 11.6569 2.2788 10.2341C3.0576 8.81132 4.48042 7.92826 7.32604 6.16219L10.326 4.3003C13.3341 2.43343 14.8381 1.5 16.5 1.5C18.1619 1.5 19.6659 2.43343 22.674 4.3003L25.674 6.16218C28.5196 7.92826 29.9424 8.81132 30.7212 10.2341C31.5 11.6569 31.5 13.3732 31.5 16.8059V19.0875C31.5 24.9387 31.5 27.8644 29.7426 29.6821C27.9853 31.5 25.1568 31.5 19.5 31.5H13.5C7.84314 31.5 5.01473 31.5 3.25736 29.6821C1.5 27.8644 1.5 24.9387 1.5 19.0875V16.8059Z" stroke="currentColor" stroke-width="3"/></svg>
        </button>

        <button onClick={goToSearch}> 
          <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.2647 24.2582L31.5 31.5M28.1667 14.8333C28.1667 22.1972 22.1972 28.1667 14.8333 28.1667C7.46953 28.1667 1.5 22.1972 1.5 14.8333C1.5 7.46953 7.46953 1.5 14.8333 1.5C22.1972 1.5 28.1667 7.46953 28.1667 14.8333Z" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

        <button onClick={goToChats}> 
          <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 31.5C24.7842 31.5 31.5 24.7842 31.5 16.5C31.5 8.21572 24.7842 1.5 16.5 1.5C8.21572 1.5 1.5 8.21572 1.5 16.5C1.5 18.8995 2.06343 21.1674 3.06519 23.1787C3.33141 23.7132 3.42001 24.3241 3.26568 24.9009L2.37227 28.2401C1.98443 29.6895 3.31051 31.0155 4.76002 30.6278L8.09909 29.7344C8.6759 29.58 9.28682 29.6686 9.8213 29.9347C11.8326 30.9366 14.1004 31.5 16.5 31.5Z" stroke="currentColor" stroke-width="3"/></svg>
        </button>

        <button onClick={goToProfile}>
          <svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.4668 14.5C14.0567 14.5 16.9668 11.5898 16.9668 8C16.9668 4.41015 14.0567 1.5 10.4668 1.5C6.87695 1.5 3.9668 4.41015 3.9668 8C3.9668 11.5898 6.87695 14.5 10.4668 14.5Z" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5078 19.2222C13.0168 19.2222 15.4445 19.8616 17.2256 21.0493C18.693 22.028 19.3794 23.2133 19.4678 24.3667L19.4775 24.5972C19.4733 25.742 18.8748 26.9333 17.5039 27.9526L17.2188 28.1548C15.4306 29.3549 12.9982 29.9994 10.4893 29.9995C7.97927 29.9995 5.54531 29.3548 3.75684 28.1538L3.75195 28.1509L3.46777 27.9517C2.09607 26.9419 1.5 25.7478 1.5 24.6147C1.50001 23.4059 2.1782 22.1143 3.7627 21.0513L3.76367 21.0522C5.56199 19.8616 7.99926 19.2222 10.5078 19.2222Z" stroke="currentColor" stroke-width="3"/></svg>
        </button>
      </div>
    </div>
  );
}
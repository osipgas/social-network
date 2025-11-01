import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// === СТРАНИЦА ЛОГИНА / РЕГИСТРАЦИИ ===
function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async () => {
    const res = await fetch('http://localhost:5001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (!res.ok) {
      // Сервер вернул 4xx или 5xx, выводим сообщение об ошибке
      setMessage(data.message || 'Ошибка входа');
      return;
    }
  
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('username', data.user.username);
    window.location.href = '/';
  };

  const handleRegister = async () => {
    const res = await fetch('http://localhost:5001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('username', data.user.username);
    window.location.href = '/';
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /><br /><br />
      {!isLogin && (
        <>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br /><br />
        </>
      )}
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br /><br />
      <button onClick={isLogin ? handleLogin : handleRegister}>
        {isLogin ? 'Login' : 'Register'}
      </button>
      <p>{message}</p>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign in'}
      </button>
    </div>
  );
}

// страница профиля
function ProfilePage() {
  const userId = localStorage.getItem('userId');

  // Фото профиля
  const stock_image_name = "stock_image.jpg";
  const savedImage = localStorage.getItem("profile_image_name");
  const [profileImage, setProfileImage] = React.useState(
    savedImage && savedImage !== "null" ? savedImage : ""
  );

  // Описание профиля
  const savedDescription = localStorage.getItem("description");
  const [profileDescription, setProfileDescription] = React.useState(
    savedDescription && savedDescription !== "null" ? savedDescription : ""
  );

  // Загрузка нового фото
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);
    formData.append('userId', userId);

    const res = await fetch('http://localhost:5001/upload-profile', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (data.filename) {
      setProfileImage(data.filename);
      localStorage.setItem('profile_image_name', data.filename);
    }
  };

  // Изменение текста описания
  const handleDescriptionChange = (e) => {
    setProfileDescription(e.target.value);
  };

  // Сохранение описания на сервер
  const saveDescription = async () => {
    if (!userId) return;

    const res = await fetch('http://localhost:5001/upload-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, description: profileDescription })
    });

    const data = await res.json();
    if (data.message) {
      localStorage.setItem('description', profileDescription);
      alert('Описание сохранено!');
    }
  };

  return (
    
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button
      onClick={() => window.location.href = '/'}
      style={{
        position: "fixed",
        top: "20px",
        left: "20px"
      }}>
      Назад</button>
      <h1>Профиль</h1>

      {/* Фото */}
      <label style={{ cursor: "pointer" }}>
        <img
          src={`http://localhost:5001/uploads/${profileImage ? profileImage : stock_image_name}`}
          alt="Фото"
          style={{ width: 200, borderRadius: "50%" }}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </label>

      <br /><br />

      {/* Описание */}
      <textarea
        value={profileDescription}
        onChange={handleDescriptionChange}
        placeholder="Введите описание"
        rows={4}
        cols={50}
      />
      <br /><br />

      <button onClick={saveDescription}>Сохранить описание</button>
    </div>
  );
}

// === ГЛАВНАЯ СТРАНИЦА ===
function HomePage() {
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleProfile = async () => {
    const res = await fetch('http://localhost:5001/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();
    localStorage.setItem('profile_image_name', data.profile_info.profile_image_name);
    localStorage.setItem('description', data.profile_info.description);
    window.location.href = '/profile';
  };

  if (!username) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Привет, {username}!</h1>
      <p>Добро пожаловать в соцсеть!</p>
      <button onClick={handleLogout}>Log out</button>
      <button onClick={handleProfile}>Profile</button>
    </div>
  );
}

// === ГЛАВНЫЙ КОМПОНЕНТ ===
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
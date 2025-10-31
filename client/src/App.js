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
      <h1>{isLogin ? 'Вход' : 'Регистрация'}</h1>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /><br /><br />
      {!isLogin && (
        <>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br /><br />
        </>
      )}
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br /><br />
      <button onClick={isLogin ? handleLogin : handleRegister}>
        {isLogin ? 'Войти' : 'Зарегистрироваться'}
      </button>
      <p>{message}</p>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Нет аккаунта? Зарегистрируйся' : 'Уже есть аккаунт? Войти'}
      </button>
    </div>
  );
}

// === ГЛАВНАЯ СТРАНИЦА ===
function HomePage() {
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (!username) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Привет, {username}!</h1>
      <p>Добро пожаловать в соцсеть!</p>
      <button onClick={handleLogout}>Выйти</button>
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
      </Routes>
    </BrowserRouter>
  );
}
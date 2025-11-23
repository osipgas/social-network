// pages/LoginPage.jsx
import { useState } from "react";
import InputWithLabel from "../components/InputWithLabel";
import '../styles/loginPage.css'
import { setCachedProfile } from '../utils/ProfileCache.js'; // <-- Добавь импорт
import { LoadProfileInfo } from '../utils/LoadProfileInfo.js';
import { useNavigate } from 'react-router-dom'; // <-- НОВЫЙ ИМПОРТ

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      setMessage('Заполните username и пароль');
      return;
    }
    if (!isLogin && !formData.email.includes('@')) {
      setMessage('Введите корректный email');
      return;
    }

    const endpoint = isLogin ? '/login' : '/register';
    const body = isLogin
      ? { username: formData.username, password: formData.password }
      : { ...formData };

    try {
      const res = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Ошибка сервера');
        return;
      }

      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('username', data.user.username);
      
      navigate('/');
      const profileData = await LoadProfileInfo(data.user.id);
      setCachedProfile(data.user.id.toString(), profileData);

    } catch (err) {
      setMessage('Нет связи с сервером');
    }
  };

  return (
    <div className="login-container">
      <h1 className="page-title">Chat</h1>
      <div className="login-card">

      <InputWithLabel
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder= {isLogin ? "Username or Email" : "Username"}
      />

      {!isLogin && (
        <InputWithLabel
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
      )}

      <InputWithLabel
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />

      <button onClick={handleSubmit} className="btn-primary">
        {isLogin ? 'Log In' : 'Sign Up'}
      </button>

      {message && <p className="error-message">{message}</p>}

      <button
        onClick={() => {
          setIsLogin(!isLogin);
          setMessage('');
          setFormData(prev => ({ ...prev, email: '', password: '' }));
        }}
        className="link-button"
      >
        {isLogin
          ? "Create new account"
          : "Already have an account?"}
      </button>
      </div>
    </div>
  );
}
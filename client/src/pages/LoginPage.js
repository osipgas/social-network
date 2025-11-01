// pages/LoginPage.jsx
import { useState } from "react";
import InputWithLabel from "../components/InputWithLabel";
import '../styles/loginPage.css'

export function LoginPage() {
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
      window.location.href = '/';

    } catch (err) {
      setMessage('Нет связи с сервером');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
      <h1 className="login-title">
        {isLogin ? 'Вход' : 'Регистрация'}
      </h1>

      <InputWithLabel
        label="Имя"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Введите username"
      />

      {!isLogin && (
        <InputWithLabel
          label="Почта"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@mail.com"
        />
      )}

      <InputWithLabel
        label="Пароль"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Минимум 6 символов"
      />

      <button onClick={handleSubmit} className="btn-primary">
        {isLogin ? 'Войти' : 'Зарегистрироваться'}
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
          ? "Нет аккаунта? Зарегистрируйтесь"
          : "Уже есть аккаунт? Войдите"}
      </button>
      </div>
    </div>
  );
}
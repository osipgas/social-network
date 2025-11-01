// pages/ProfilePage.jsx
import React, { useState, useRef } from "react";
import '../styles/ProfilePage.css';

export function ProfilePage() {
  const userId = localStorage.getItem('userId');
  const stockImage = "stock_image.jpg";

  // Фото
  const savedImage = localStorage.getItem("profile_image_name");
  const [profileImage, setProfileImage] = useState(
    savedImage && savedImage !== "null" ? savedImage : ""
  );
  const [previewImage, setPreviewImage] = useState(""); // предпросмотр

  // Описание
  const savedDescription = localStorage.getItem("description");
  const [profileDescription, setProfileDescription] = useState(
    savedDescription && savedDescription !== "null" ? savedDescription : ""
  );

  // Статусы
  const [uploading, setUploading] = useState(false);
  const [savingDesc, setSavingDesc] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // === Загрузка фото ===
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    // Предпросмотр
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append('profileImage', file);
    formData.append('userId', userId);

    try {
      const res = await fetch('http://localhost:5001/upload-profile', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Ошибка загрузки');

      const data = await res.json();
      setProfileImage(data.filename);
      localStorage.setItem('profile_image_name', data.filename);
      setPreviewImage(""); // убираем предпросмотр
    } catch (err) {
      setError('Не удалось загрузить фото');
      setPreviewImage("");
    } finally {
      setUploading(false);
    }
  };

  // === Сохранение описания ===
  const saveDescription = async () => {
    if (!userId) return;

    setSavingDesc(true);
    setError("");

    try {
      const res = await fetch('http://localhost:5001/upload-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, description: profileDescription })
      });

      if (!res.ok) throw new Error('Ошибка сохранения');

      const data = await res.json();
      if (data.message) {
        localStorage.setItem('description', profileDescription);
        alert('Описание сохранено!');
      }
    } catch (err) {
      setError('Не удалось сохранить описание');
    } finally {
      setSavingDesc(false);
    }
  };

  return (
    <div className="profile-container">
      <button
        onClick={() => window.location.href = '/'}
        className="back-button"
      >
        Назад
      </button>

      <div className="profile-card">
        <h1 className="profile-title">Профиль</h1>

        {/* Фото */}
        <div className="avatar-wrapper">
          <label className="avatar-label">
            <img
              src={
                previewImage ||
                `http://localhost:5001/uploads/${profileImage || stockImage}`
              }
              alt="Аватар"
              className="avatar-image"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="avatar-input"
            />
            <div className="avatar-overlay">
              {uploading ? "Загрузка..." : "Изменить"}
            </div>
          </label>
        </div>

        {/* Описание */}
        <div className="description-group">
          <label className="input-label">Описание</label>
          <textarea
            value={profileDescription}
            onChange={(e) => setProfileDescription(e.target.value)}
            placeholder="Расскажите о себе..."
            className="description-field"
            rows={4}
          />
        </div>

        <button
          onClick={saveDescription}
          disabled={savingDesc}
          className="btn-primary"
        >
          {savingDesc ? "Сохранение..." : "Сохранить описание"}
        </button>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
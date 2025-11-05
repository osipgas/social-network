// pages/ProfilePage.js
import { useState, useEffect } from "react";
import { PhotoUploader } from "../components/PhotoUploader.js"; // <-- Пришли мне код этого файла
import '../styles/ProfilePage.css';
import UsersList from "../components/UsersList.js";
import { useParams, Navigate } from "react-router-dom";
import { LoadProfileInfo } from '../utils/LoadProfileInfo.js';

export function ProfilePage() {
  const { userId: urlUserId, username: urlUsername } = useParams();

  const myUserId = localStorage.getItem('userId');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // <-- Наше главное состояние

  // (Остальные состояния)
  const [imageName, setImageName] = useState(null);
  const [friends, setFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const [description, setDescription] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [isPhotoBig, setIsPhotoBig] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    const isOwn = (myUserId === urlUserId);
    setIsOwnProfile(isOwn);
    setIsEditing(false); 

    const fetchData = async () => {
      const { imageName, description, friends } = await LoadProfileInfo(urlUserId);
      setImageName(imageName);
      setFriends(friends);
      setDescription(description || "");
      setOriginalDescription(description || "");
    }
    fetchData();
  }, [urlUserId, myUserId]); 

  // (Обработчики handleEditClick, handleSaveDescription, handleCancelEdit остаются без изменений)
  // 1. Нажатие кнопки "Edit"
  const handleEditClick = () => {
    setIsEditing(true); 
  };

  // 2. Нажатие кнопки "Save"
  const handleSaveDescription = async () => {
    setIsSaving(true);
    try {
      // (Логика сохранения)
      const res = await fetch('http://localhost:5001/upload-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: myUserId, description: description })
      });

      if (res.ok) {
        setOriginalDescription(description); 
      } else {
        throw new Error('Не удалось сохранить');
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка при сохранении описания.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDoneClick = () => {
    if (hasChanges) {
      setDescription(originalDescription); 
    }
    setIsEditing(false); 
  };

  const hasChanges = description !== originalDescription;

  // --- РЕНДЕРИНГ ---

  if (showFriends) {
    // (Рендер списка друзей)
    return (
      <div className="profile-container">
        <button onClick={() => setShowFriends(false)} className="back-button">
          {"<"}
        </button>
        <UsersList usersList={JSON.parse(localStorage.getItem('friends') || '[]')} />
      </div>
    );
  }

  if (imageName === null) {
    return <div className="profile-container">Загрузка...</div>;
  }

  // === Основной профиль ===
  return (
    <div className={`profile-container ${isPhotoBig ? 'photo-big-mode' : ''}`}>
      <h1> Chat </h1>
      <button onClick={() => window.location.href = '/'} className="back-button">
        {"<"}
      </button>
      <h2>{urlUsername}</h2>

      <PhotoUploader
        userId={urlUserId}
        initialFilename={imageName}
        isEditing={isEditing}
        onToggleBig={setIsPhotoBig}
      />

      <div className="stats-row">
        {/* (Блок Friends, Subs, Groups) */}
        <div className="info-section info-section--left">
            <p>Friends</p>
            <span style={{ cursor: 'pointer' }} onClick={() => setShowFriends(true)}>
              {friends.length}
            </span>
          </div>
          <div className="info-section info-section--center">
            <p>Subs</p>
            <span style={{ cursor: 'pointer' }}> {32} </span>
          </div>
          <div className="info-section info-section--right">
            <p>Groups</p>
            <span style={{ cursor: 'pointer' }}> {196} </span>
          </div>
      </div>

      <textarea
        value={description}
        readOnly={!isEditing} // <-- Управляется isEditing
        onChange={(e) => setDescription(e.target.value)}
        className={`description-field ${isEditing ? 'is-editing' : ''}`}
        rows={4}
        placeholder={isOwnProfile ? "Расскажите о себе..." : "У пользователя нет описания"}
      />

      <div className="description-actions">
        
        {/* Сценарий 1: Свой профиль, НЕ режим редактирования */}
        {isOwnProfile && !isEditing && (
          <button onClick={handleEditClick} className="btn-edit">
            Edit {/* <-- ИЗМЕНЕНИЕ 2: Кнопка переименована */}
          </button>
        )}

        {/* Сценарий 2: Свой профиль, В режиме редактирования */}
        {isOwnProfile && isEditing && (
                <button
                    onClick={handleDoneClick}
                    className="btn-done"
                >
                    Done
                </button>
        )}

        {isOwnProfile && isEditing && hasChanges && (
              <>
             <button
               onClick={handleSaveDescription}
               className="btn-save"
             >
               Save
             </button>
             <button
               onClick={() => setDescription(originalDescription)}
               className="btn-cancel"
             >
               Cancel
             </button>
           </>
        )} 
      </div>
    </div>
  );
}
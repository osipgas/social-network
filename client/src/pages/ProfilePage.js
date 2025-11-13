// pages/ProfilePage.js
import { useState, useEffect } from "react";
import { PhotoUploader } from "../components/PhotoUploader.js"; // <-- Пришли мне код этого файла
import '../styles/ProfilePage.css';
import { useParams, Navigate } from "react-router-dom";
import { LoadProfileInfo } from '../utils/LoadProfileInfo.js';
import { 
  fetchFriendStatus,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriendship
} from '../utils/friendshipAPI.js';
import UserSearchBox from "../components/UserSearchBox.js";
import SidebarMenu from "../components/SettingsSidebar.js";

export function ProfilePage() {
  const { userId: urlUserId, username: urlUsername } = useParams();

  const myUserId = localStorage.getItem('userId');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // <-- Наше главное состояние
  const [friendStatus, setFriendStatus] = useState(null);

  // (Остальные состояния)
  const [imageName, setImageName] = useState(null);
  const [friends, setFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const [description, setDescription] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [isPhotoBig, setIsPhotoBig] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // *** НОВАЯ ПЕРЕМЕННАЯ: для отслеживания, для какого именно userId загружены данные ***
  const [loadedUserId, setLoadedUserId] = useState(null);


  useEffect(() => {
    setIsLoadingProfile(true);

    const isOwn = (myUserId === urlUserId);
    setIsOwnProfile(isOwn);
    const fetchData = async () => {
      try {
        const { imageName, description, friends } = await LoadProfileInfo(urlUserId);
        setImageName(imageName);
        setFriends(friends);
        setDescription(description || "");
        setOriginalDescription(description || "");

        if (!isOwn) {
          const status = await fetchFriendStatus(myUserId, urlUserId);
          setFriendStatus(status);
        } else {
          setFriendStatus(null);
        }
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
      } finally {
        setIsLoadingProfile(false); // <-- выключаем загрузку
        setLoadedUserId(urlUserId);
      }
    };
    fetchData();

    
  }, [urlUserId, myUserId]); 

  


  // 2. Нажатие кнопки "Save"
  const handleSaveDescription = async () => {
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
    }
  };

  const handleDoneClick = () => {
    setIsEditing(false); 
    handleSaveDescription();
  };

  const handleFriendAction = async (actionFn, newStatus) => {
    try {
      await actionFn(myUserId, urlUserId);
      setFriendStatus(newStatus);
    } catch (error) {
      console.error("Ошибка действия дружбы:", error.message);
    }
  };

  const handleAddFriend = () => 
    handleFriendAction(sendFriendRequest, 'pending_sent');

  const handleAcceptFriend = () => 
    handleFriendAction(acceptFriendRequest, 'accepted');

  const handleRemoveFriend = () => 
    handleFriendAction(removeFriendship, 'not_friends');

  // --- ФУНКЦИЯ РЕНДЕРИНГА КНОПКИ ДРУЖБЫ ---

  const renderFriendshipButton = () => {
    
    switch (friendStatus) {
      case 'not_friends':
        return (
          <button onClick={handleAddFriend} className="btn-friend-action btn-add">
            Link Up 
          </button>
        );
      case 'pending_sent':
        return (
          <button onClick={handleRemoveFriend} className="btn-friend-action btn-pending-sent">
            Pending
          </button>
        );
      case 'pending_received':
        return (
          <>
            <button onClick={handleAcceptFriend} className="btn-friend-action btn-accept">
              Yeah
            </button>
            <button onClick={handleRemoveFriend} className="btn-friend-action btn-reject">
              Nah
            </button>
          </>
        );
      case 'accepted':
        return (
          <button onClick={handleRemoveFriend} className="btn-friend-action btn-remove">
            Удалить из друзей
          </button>
        );
      default:
        return null;
    }
  };

  // --- РЕНДЕРИНГ ---

  if (showFriends && loadedUserId === urlUserId) {
    return (
      <div className="profile-container">
        <button onClick={() => setShowFriends(false)} className="back-button">
          {"<"}
        </button>
        <UserSearchBox mode="friends" baseList={friends} setShowFriends={setShowFriends}/>
      </div>
    );
  }

   if (isLoadingProfile || loadedUserId !== urlUserId || imageName === null) {
    return <div className="profile-container">Загрузка...</div>;
  }

  // === Основной профиль ===
  return (
    <div className={`profile-container ${isPhotoBig ? 'photo-big-mode' : ''}`}>
      <h1> Chat </h1>
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
        placeholder={isOwnProfile ? "Tell us about yourself..." : "The user has no description"}
      />

      <div className="description-actions">
      
        {/* Сценарий 2: Свой профиль, В режиме редактирования */}
        {isOwnProfile && isEditing && (
          <button
              onClick={handleDoneClick}
              className="btn-done"
          >
              Done
          </button>
        )}

        {/* Сценарий 4: Чужкой профиль*/}
        {!isOwnProfile && (
          <div className="friendship-actions">
            {renderFriendshipButton()}
          </div>
        )}

      </div>
      <SidebarMenu isEditing={isEditing} setIsEditing={setIsEditing} />
    </div>
  );
}
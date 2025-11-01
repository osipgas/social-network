// components/ProfileBtn.jsx
import React from 'react';

const ProfileBtn = ({ userId }) => {
  const handleProfile = async () => {
    try {
      const res = await fetch('http://localhost:5001/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();

      localStorage.setItem('profile_image_name', data.profile_info.profile_image_name);
      localStorage.setItem('description', data.profile_info.description);
      window.location.href = '/profile';
    } catch (err) {
      console.error('Ошибка загрузки профиля');
    }
  };

  return (
    <button onClick={handleProfile} className="btn-primary">
      Профиль
    </button>
  );
};

export default ProfileBtn;
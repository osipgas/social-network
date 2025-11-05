// components/ProfileBtn.js

const ProfileBtn = ({ userId }) => {
  const handleProfile = async () => {
    try {
      const resProfile = await fetch('http://localhost:5001/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await resProfile.json();

      localStorage.setItem('profile_image_name', data.profile_info.profile_image_name);
      localStorage.setItem('description', data.profile_info.description);

      const resFriendsList = await fetch('http://localhost:5001/getFriendsList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const friends = await resFriendsList.json();
      localStorage.setItem('friends', JSON.stringify(friends));

      window.location.href = `/profile/${userId}`;
    } catch (err) {
      console.error('Ошибка загрузки профиля');
    }

  };

  return (
    <button onClick={handleProfile} className="btn-primary"> Profile </button>
  );
};

export default ProfileBtn;
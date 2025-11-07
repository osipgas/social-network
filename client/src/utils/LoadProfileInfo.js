// src/utils/LoadProfileInfo.js
export const LoadProfileInfo = async (userId) => {
    if (!userId) throw new Error('ID отсутствуют');

    try {
        const resProfile = await fetch('http://localhost:5001/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        const data = await resProfile.json();

        const imageName = data.profile_info.profile_image_name || "stock_image.jpg";
        const description = data.profile_info.description || ""

        const resFriendsList = await fetch('http://localhost:5001/getFriendsList', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        const friends = await resFriendsList.json();

        const profileData = {
            imageName: imageName,
            description: description,
            friends: friends
        }
        return profileData;
    } catch (err) {
        console.error('Ошибка загрузки профиля');
    }
};


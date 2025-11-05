// src/utils/photo.js
export const uploadPhoto = async (file, userId, endpoint = '/upload-profile') => {
  if (!file || !userId) throw new Error('Файл или ID отсутствуют');

  const formData = new FormData();
  formData.append('profileImage', file);
  formData.append('userId', userId);

  const res = await fetch(`http://localhost:5001${endpoint}`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Ошибка загрузки');
  return await res.json(); // { filename: 'abc123.jpg' }
};

export const getPhotoUrl = (filename, fallback = 'stock_image.jpg') => {
  return filename
    ? `http://localhost:5001/uploads/${filename}`
    : `http://localhost:5001/uploads/${fallback}`;
};
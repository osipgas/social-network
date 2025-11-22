// src/utils/ProfileCache.js
// Глобальный кэш как Map (userId -> profileData)
const profileCache = new Map();

export const getCachedProfile = (userId) => {
  return profileCache.get(userId);
};

export const setCachedProfile = (userId, data) => {
  profileCache.set(userId, data);
};

export const replaceCachedValue = (userId, key, value) => {
  const data = profileCache.get(userId) || {}; // Если нет кэша — создаём пустой объект
  data[key] = value; // Обновляем или добавляем поле
  profileCache.set(userId, data); // Сохраняем обратно
};
// src/components/PhotoAvatar.js
import { getPhotoUrl } from '../utils/photo.js';

export function PhotoAvatar({ filename, size }) {
    if (!filename) return null;
    // Проверяем что если файл
    const isLocal = filename.startsWith('blob:') || filename.startsWith('data:');
    return (
        <img
            src={isLocal ? filename : getPhotoUrl(filename)}
            alt="Аватар"
            className="avatar-image"
            style={{ width: `${size}px`, height: `${size}px` }}
        />
    );
}
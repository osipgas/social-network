// src/components/PhotoUploader.js
import { useRef, useState, useEffect } from 'react';
import { uploadPhoto } from '../utils/photo.js';
import { PhotoAvatar } from './PhotoAvatar.js';

// === НОВЫЙ ПРОПС: isEditing ===
export function PhotoUploader({ 
  userId, 
  initialFilename = '', 
  endpoint = '/upload-profile', 
  size = 120, 
  onUploadSuccess,
  isEditing = false // <-- ДОБАВЛЕН НОВЫЙ ПРОПС
}) {
  const [filename, setFilename] = useState(initialFilename);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  // === ЛОГИКА ДЛЯ БЛОКИРОВКИ ===
  // Разрешаем взаимодействие только если идет загрузка (нельзя прервать) ИЛИ включен режим редактирования.
  const isInteractive = uploading || isEditing; 

  // Если initialFilename изменился — обновляем локальный state
  useEffect(() => {
    setFilename(initialFilename);
  }, [initialFilename]);

  const handleFile = async (file) => {
    // === ПРОВЕРКА РЕДАКТИРОВАНИЯ: Блокируем, если не в режиме редактирования ===
    if (!isEditing || !file || !userId) return; // <-- ДОБАВЛЕНО УСЛОВИЕ !isEditing
    
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setUploading(true);

    try {
      const data = await uploadPhoto(file, userId, endpoint);
      setFilename(data.filename);
      localStorage.setItem('profile_image_name', data.filename);
      onUploadSuccess?.(data.filename);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  };
  
  // Функция для имитации клика (запускает окно выбора файла), 
  // вызывается при клике на PhotoAvatar
  const triggerFileInput = () => {
    // === УСЛОВИЕ КЛИКА: Кликабельно только при isInteractive ===
    if (isInteractive && inputRef.current) {
      inputRef.current.click();
    }
  };


  return (
    <div 
        style={{ width: size, height: size }}
        // Условное применение стиля, чтобы показать, что аватар кликабелен
        // Если !isEditing, то transform: scale:hover не сработает
        className={isInteractive ? 'avatar-wrapper interactive' : 'avatar-wrapper'}
        onClick={triggerFileInput} // <-- Используем обработчик клика на весь враппер
    >
      <div className="avatar-label" 
           style={{ cursor: isInteractive ? 'pointer' : 'default' }} // <-- Меняем курсор
      >
        <PhotoAvatar filename={previewUrl || filename} size={size} />
        
        {/* Input type="file" теперь всегда скрыт и всегда отслеживает изменения, 
            но запускается только через `triggerFileInput` */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          // Обработчик `handleFile` сам проверит, разрешено ли редактирование
          onChange={(e) => handleFile(e.target.files[0])} 
          style={{ display: 'none' }}
          disabled={uploading}
        />
        
        {/* Опционально: Визуальная индикация режима редактирования */}
        {isEditing && !uploading && (
          <div className="edit-overlay">
            {/* Можно добавить иконку камеры или "Edit" */}
          </div>
        )}
      </div>
    </div>
  );
}
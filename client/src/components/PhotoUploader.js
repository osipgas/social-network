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
  onToggleBig,
  isEditing = false 
}) {
  const [filename, setFilename] = useState(initialFilename);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isReturning, setIsReturning] = useState(false); 
  const inputRef = useRef(null);
  const [isBig, setIsBig] = useState(false); // Состояние для .big
  const wrapperRef = useRef(null); 
  

  // === ЛОГИКА ДЛЯ БЛОКИРОВКИ ===
  const isInteractive = uploading || isEditing; 

  // Если initialFilename изменился — обновляем локальный state
  useEffect(() => {
    setFilename(initialFilename);
  }, [initialFilename]);

  const handleFile = async (file) => {
    if (!isEditing || !file || !userId) return; 
    
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setUploading(true);

    try {
      const data = await uploadPhoto(file, userId, endpoint);
      setFilename(data.filename);
      localStorage.setItem('profile_image_name', data.filename);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  };
  
  // Инкапсулирует логику закрытия
  const closeBigPhoto = () => {
    if (isBig) {
        if (wrapperRef.current) {
              // Имитируем событие 'mouseleave', чтобы браузер убрал hover-эффекты
              const mouseLeaveEvent = new MouseEvent('mouseleave', {
                  bubbles: true,
                  cancelable: true,
              });
              wrapperRef.current.dispatchEvent(mouseLeaveEvent);
        }
        setIsBig(false);
        onToggleBig(false);
        setIsReturning(true); // включаем задержку рамки
        // через 350ms (скорость уменьшения) выключаем возвращение
        setTimeout(() => setIsReturning(false), 200);
    }
  };

  //  Добавляет и удаляет глобальный слушатель клика
  useEffect(() => {
    const handleGlobalClick = () => {
      // При любом клике на документе (кроме запуска редактирования/загрузки)
      // мы просто вызываем функцию закрытия, если фото открыто.
      closeBigPhoto();
    };

    if (isBig) {
      // Добавляем слушатель только когда фото открыто
      document.addEventListener('click', handleGlobalClick);
    } 
    
    // Функция очистки: всегда удаляем слушатель
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [isBig]); // Зависит от состояния isBig

  
  // Функция для имитации клика (запускает окно выбора файла), 
  // вызывается при клике на PhotoAvatar
  const handleClick = (e) => { // 💡 Обязательно принимаем объект события 'e'
    if (isInteractive) {
      // Если идет редактирование/загрузка, запускаем выбор файла
      inputRef.current?.click();
    } else {
      if (!isBig) {
        setIsBig(true);
        onToggleBig(true);
        e.stopPropagation(); 
      }
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`avatar-wrapper ${isInteractive ? 'interactive' : ''} ${isBig ? 'big' : ''} ${isReturning ? 'returning' : ''}`}
      onClick={handleClick}
    >
      
      <div className="avatar-label" 
           style={{ cursor: isInteractive ? 'pointer' : 'default' }}
      >
        <PhotoAvatar filename={previewUrl || filename} size={size} />
        
        {/* Input type="file" */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files[0])} 
          style={{ display: 'none' }}
          disabled={uploading}
        />
        
        {/* Опционально: Визуальная индикация режима редактирования */}
        {isEditing && !uploading && (
          <div className="edit-overlay">
            {/* ... */}
          </div>
        )}
      </div>
    </div>
  );
}
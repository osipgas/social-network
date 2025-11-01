import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../db.js';

// Папка для загрузки
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    // Можно добавить timestamp, чтобы имя было уникальным
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Файл не выбран" });
    }

    const filename = req.file.filename;

    // ⚠️ Предположим, что user_id приходит с клиента (например, в теле запроса)
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "user_id обязателен" });
    }

    // Обновляем путь в таблице
    await pool.query(
      "UPDATE users SET profile_image_path = $1 WHERE id = $2",
      [filename, userId]
    );

    res.json({ filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при обновлении фото" });
  }
};

export { uploadProfilePhoto, upload };
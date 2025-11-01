import multer from 'multer';
import path from 'path';
import { pool } from '../db.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Определяем __dirname вручную, т.к. его нет в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Папка для загрузки
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg, .png и т.д.
    const uniqueName = uuidv4() + ext; // например: "b8f9e4ac-51ab-4a3c-a31d-cda442f24b62.jpg"
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
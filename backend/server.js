import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { pool } from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5001;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Логин пользователя
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    res.json({ message: 'Успешный вход!', user: { id: user.rows[0].id, username: user.rows[0].username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Берем инфу профиля юзера
app.post('/profile', async (req, res) => {
  const { userId } = req.body;

  try {
    const profile_info = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    if (profile_info.rows.length === 0) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    res.json({ message: 'Получили инфу профиля', profile_info: { profile_image_name: profile_info.rows[0].profile_image_path, description: profile_info.rows[0].description } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


// Для загрузки фото

import multer from 'multer';

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

// загружаем фото
app.post("/upload-profile", upload.single("profileImage"), async (req, res) => {
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
});

// Обновление описания профиля
app.post('/upload-description', async (req, res) => {
  const { userId, description } = req.body;

  if (!userId) return res.status(400).json({ message: 'Нет userId' });

  try {
    await pool.query(
      'UPDATE users SET description = $1 WHERE id = $2',
      [description, userId]
    );
    res.json({ message: 'Описание обновлено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
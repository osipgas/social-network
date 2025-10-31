import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { pool } from './db.js';

const app = express();
const PORT = 5001;

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json()); // чтобы читать JSON из запросов

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Регистрация пользователя
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10); // хешируем пароль

  try {
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    res.json({ 
            message: 'Пользователь создан!', 
            user: { 
                id: newUser.rows[0].id, 
                username: newUser.rows[0].username 
            } 
            });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при регистрации' });
  }
});

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

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
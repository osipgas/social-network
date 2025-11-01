import { pool } from '../db.js'
import bcrypt from 'bcrypt';




export const login = async (req, res) => {
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
};




export const profile = async (req, res) => {
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
};


export const register = async (req, res) => {
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
};



 export const uploadDescription = async (req, res) => {
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
};

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

  // Валидация входных данных
  if (!username || !email || !password) {
    return res.status(400).json({ 
      message: 'Все поля обязательны: username, email, password' 
    });
  }

  try {
    // Проверка на существующего пользователя по username
    const existingUsername = await pool.query(
      'SELECT 1 FROM users WHERE username = $1',
      [username]
    );

    if (existingUsername.rows.length > 0) {
      return res.status(408).json({ 
        message: 'Этот username уже занят' 
      });
    }

    // Проверка на существующий email
    const existingEmail = await pool.query(
      'SELECT 1 FROM users WHERE email = $1',
      [email]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(409).json({ 
        message: 'Этот email уже зарегистрирован' 
      });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    // Успешная регистрация
    return res.status(201).json({
      message: 'Пользователь успешно создан!',
      user: {
        id: newUser.rows[0].id,
        username: newUser.rows[0].username,
        email: newUser.rows[0].email
      }
    });

  } catch (err) {
    console.error('Ошибка при регистрации:', err);

    // Обработка ошибок базы данных (например, нарушение уникальности на уровне БД)
    if (err.code === '23505') { // PostgreSQL: unique_violation
      if (err.constraint === 'users_username_key') {
        return res.status(409).json({ message: 'Этот username уже занят' });
      }
      if (err.constraint === 'users_email_key') {
        return res.status(409).json({ message: 'Этот email уже зарегистрирован' });
      }
    }

    // Любая другая ошибка
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
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

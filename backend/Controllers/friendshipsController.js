import { pool } from '../db.js'



export const addFriend = async (req, res) => {
  const { id1, id2} = req.body;
  if (id1 > id2) [id1, id2] = [id2, id1];
  
  try {
    await pool.query(`INSERT INTO friendships (user_id1, user_id2, status) 
                      VALUES ($1, $2, 'pending') 
                      ON CONFLICT DO NOTHING;`, [id1, id2]);
    res.json({ message: 'friendship request has been sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error occured while sending friendship request :((' });
  }
};



export const acceptFriend = async (req, res) => {
  const { userId, friendUserId } = req.body;

  try {
    await pool.query(`UPDATE friendships 
                      SET status = 'accepted' 
                      WHERE (user_id1 = $1 AND user_id2 = $2) 
                      OR (user_id1 = $2 AND user_id2 = $1);`, [userId, friendUserId]);
    res.json({ message: 'friendship has been accepted!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error occured while accepting friendship request :((' });
  }
};



export const removeFriend = async (req, res) => {
  const { userId, friendUserId } = req.body;

  try {
    await pool.query(`DELETE FROM friendships 
                      WHERE (user_id1 = $1 AND user_id2 = $2) 
                      OR (user_id1 = $2 AND user_id2 = $1)`, [userId, friendUserId]);
    res.json({ message: 'friendship has been removed!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error occured while removing friendship :((' });
  }
};



export const getFriendsList = async (req, res) => {
  const { userId } = req.body;
  
  try {
    const result = await pool.query(`SELECT u.id, u.username, f.status FROM users u
                                     JOIN friendships f ON (
                                        (f.user_id1 = $1 AND f.user_id2 = u.id) OR
                                        (f.user_id2 = $1 AND f.user_id1 = u.id))
                                     WHERE f.status = 'accepted'`, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error('getFriendsList error:', err);
    res.status(500).json({ message: 'Ошибка загрузки друзей' });
  }
};
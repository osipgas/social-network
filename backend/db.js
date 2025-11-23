import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'postgres',      // твой логин
  host: 'localhost',
  database: 'bruhnet',  // твоя база
  password: 'elvis9020ozik',  // пароль
  port: 5432,
});
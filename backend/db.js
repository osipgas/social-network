import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'postgres',      // твой логин
  host: '89.23.101.233',
  database: 'bruhnet',  // твоя база
  password: 'elvis9020ozik',  // пароль
  port: 5432,
});
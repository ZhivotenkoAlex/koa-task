import * as mariadb from 'mariadb';

export const pool: mariadb.Pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '111',
  database: 'nodeDB',
  connectTimeout:10000,
  connectionLimit: 30,
});

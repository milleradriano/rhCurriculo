
import mysql from 'mysql2';
require('dotenv').config();


const pool = mysql.createConnection  ({
    host: process.env.URL_DATABASE,
    database: process.env.NAME_DATABASE,
    user: process.env.USER_DATABASE,  
    password: process.env.PASSWORD_DATABASE,   
    port: 3306,
});

pool.connect();
console.log('Conexão com o banco de dados estabelecida!');
pool.on('error', (err: any) => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Database connection was closed.');
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    console.log('Database has too many connections.');
  }
  if (err.code === 'ECONNREFUSED') {
    console.log('Database connection was refused.');
  }
  if (err.code === 'ER_BAD_DB_ERROR') {
    console.log('Database does not exist.');
  }
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    console.log('Database access was denied.');
  }
  if (err.code === 'ETIMEDOUT') {
    console.log("SEM CONEXÃO COM BANCO DE DADOS");
  }
    process.exit(1);
});
pool.on('connect', () => {
    console.log('Conectado ao banco de dados');
    console.log('Sistema pronto para o uso');
})
process.on('SIGINT', () => 
    pool.end((err: any) => {
        if(err) return console.log(err);
        console.log('pool => fechado');
        process.exit(1);
    })
); 



export default pool;



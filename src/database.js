import { createPool } from 'mysql2';
import { promisify } from 'util';
import { database } from './config.js';

const pool = createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('La conexion con la Database fue cerrada');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('La Database tiene demasiadas conexiones');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('database conexion fue rechazada');
        }
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('ACCESO denegado\n' + err);
        }
        console.error('Error de conexión:', err);
    } else if (connection) {
        connection.release();
        console.log('DB is Connected');
    }
});

pool.query = promisify(pool.query);

export default pool;

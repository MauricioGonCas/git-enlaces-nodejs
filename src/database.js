const mysql = require('mysql');
const {promisify} = require('util');

const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {
            console.log("LA CONEXION CON LA BASE DE DATOS FUE CERRADA");
        }
        if (err.code == 'ER_CON_COUNT_ERROR') {
            console.log('NUMERO DE CONEXIONES A LA BASE DE DATOS');
        }
        if (err.code=='ECONNREFUSED') {
            console.log('LA CONEXCION A SIDO RECHAZADA');
        }
    }
    if (connection) connection.release();
    console.log('LA BD ESTA CONECTADA')

    return;
});

//convetimos a promesas los 
pool.query = promisify(pool.query);

module.exports = pool;
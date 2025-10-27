require('dotenv').config()

const config = {
    server: process.env.SERVER,
    authentication: {
        type: 'default',
        options: {
            userName: process.env.USER,
            password: process.env.PASSWORD
        }
    },
    database: 'db_name',
    options: {
        encrypt: false,
        database: process.env.DATABASE
    },
    port:  process.env.DATABASE_PORT
}

module.exports = config;
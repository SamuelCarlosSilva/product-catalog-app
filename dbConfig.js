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
    port: 49858
}

module.exports = config;
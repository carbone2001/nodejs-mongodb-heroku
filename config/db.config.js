// config.js
const dotenv = require('dotenv').config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://admin:admin123@cluster0.hvhus.mongodb.net/',
    MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'tp_ticketera'
}
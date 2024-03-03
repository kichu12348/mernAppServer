const mongoose = require('mongoose');

const connect = async (url) => {
    try {
        await mongoose.connect(url);
        console.log('Connected to the database 😎');
    } catch (error) {
        console.error('Error connecting to the database 😞');
    }
}

module.exports = { connect}
const mongoose = require('mongoose');

const connect = async (url) => {
    try {
        await mongoose.connect(url);
    } catch (error) {
        console.error('Error connecting to the database 😞');
    }
}

module.exports = { connect}
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: false, default:'user' },
    email: { type: String, required: false, default:'user@gmail.com' },
    mobile: { type: String, required: false, default:'0707912063' },
	created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
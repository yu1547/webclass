const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const subjectSchema =new mongoose.Schema({
    name: String,
    clock: Number
});

const testSchema = new mongoose.Schema({
    name: String,
    date: Date,
    subject:[subjectSchema]
});

const calenderSchema = new mongoose.Schema({
    name: String,
    date: Date
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    data:{
        tests:[testSchema],
        calender:[calenderSchema]
    },
    a: Number,
    b: Number
});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

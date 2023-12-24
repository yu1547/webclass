const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const subjectSchema = new mongoose.Schema({
    name: String, // 科目名稱
    clock: Number // 科目所需番茄鐘
    //目前進度
});

const testSchema = new mongoose.Schema({
    name: String, // 考試名稱
    date: Date, // 考試日期
    importance:Number,//考試權重(2,4,6)
    subject: [subjectSchema] // 考試包含科目
    //目前進度
    //總番茄數
});

const freeTimeSchema = new mongoose.Schema({
    day: String,
    start: String,
    end: String,
});

const calenderSchema = new mongoose.Schema({
    name: String, // 安排科目
    date: Date, // 時段
    finish :Boolean //有沒有完成
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
    data: {
        tests: [testSchema], // 考試們
        freeTime: [freeTimeSchema], // 空閒時間
        calender: [calenderSchema] // 安排閱讀的日期與時間
    }
});

userSchema.pre('save', async function (next) {
    // 只有在密碼被修改時才加密
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

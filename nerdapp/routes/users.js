const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const subjectSchema =new mongoose.Schema({
    name: String,//科目名稱
    clock: Number//科目所需番茄鐘
});

const testSchema = new mongoose.Schema({
    name: String,//考試名稱
    date: Date,//考試日期
    subject:[subjectSchema]//考試包含科目
});

const calenderSchema = new mongoose.Schema({
    name: String,//安排科目
    date: Date//時段
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
        tests:[testSchema],//考試們
        freeTime:[Date],//空閒時間
        calender:[calenderSchema]//安排閱讀的日期與時間
    }
    // ,
    // a: Number,
    // b: Number
});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

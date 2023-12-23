const express = require('express');
var router = express.Router();
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./users');
const app = express();
const path = require('path');

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));


// 處理 GET 請求
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});


// 連接到 MongoDB

mongoose.connect('mongodb+srv://01157120:2R9cTuCe6gEDTcEe@nerds.m6vcm0c.mongodb.net/?retryWrites=true&w=majority');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// 將 'dashboard.html' 的路由註冊到 login.js 中

// 處理登入請求
app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(400).send('Invalid username or password.');
    }
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('Invalid username or password.');
    }
    
    req.session.user = user; // 將使用者資訊儲存到 session 中

    // 檢查 'tests' 陣列是否有元素
    console.log(user.data.tests.length)
    if (user.data.tests.length > 0) {
        // 如果有，則傳送 'calculate' 路由的 URL
        res.json({ redirect: '/calculate' });
    } else {
        // 如果沒有，則傳送 'dashboard.html' 的 URL
        // res.json({ redirect: '../public/dashboard.html' });
        res.json({ redirect: '/dashboard.html' });
        
    }
});
            

// 處理註冊請求
app.post('/register', async (req, res) => {
    console.log("第一點")
    
    // 檢查用戶名是否已經存在
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(400).send('Username already exists.');
    }    
    
    
    let user = new User({
        username: req.body.username,
        password: req.body.password
    });
    user = await user.save();
    console.log("第二點")
    
    res.send(user);
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});
app.listen(3000, () => console.log('Server is running on port 3000...'));
module.exports = router;
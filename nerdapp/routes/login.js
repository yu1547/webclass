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
        res.json({ redirect: '/calendar.html' });
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
app.get('/calendar.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/calendar.html'));
});
app.get('/obj.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/obj.html'));
});



app.post('/saveExam', async (req, res) => {
    let user = await User.findOne({ username: req.session.user.username });
    if (user) {
        user.data.tests.push({ name: req.body.name, date: req.body.date, subject: [] });
        await user.save();
        res.send('考試已儲存');
    } else {
        res.status(404).send('用戶未找到');
    }
});

app.post('/saveSubject/:examName', async (req, res) => {
    let user = await User.findOne({ username: req.session.user.username });
    if (user) {
        const exam = user.data.tests.find(test => test.name === req.params.examName);
        if (exam) {
            exam.subject.push(req.body);
            await user.save();
            res.send('科目已儲存');
        } else {
            res.status(404).send('考試未找到');
        }
    } else {
        res.status(404).send('用戶未找到');
    }
});

app.post('/saveLeisure', async (req, res) => {
    let user = await User.findOne({ username: req.session.user.username });
    if (user) {
        user.data.freeTime.push(req.body);
        await user.save();
        res.send('空閒時間已儲存');
    } else {
        res.status(404).send('用戶未找到');
    }
});

// 新增的路由
app.get('/getExams', async (req, res) => {
    let user = await User.findOne({ username: req.session.user.username });
    if (user) {
        res.send(user.data.tests);
    } else {
        res.status(404).send('用戶未找到');
    }
});

app.get('/getFreeTime', async (req, res) => {
    let user = await User.findOne({ username: req.session.user.username });
    if (user) {
        res.send(user.data.freeTime);
    } else {
        res.status(404).send('用戶未找到');
    }
});

app.post('/addSubject', async function (req, res) {
    // 從請求體中獲取考試名稱、科目名稱和所需番茄鐘
    var testName = req.body.testName;
    var subjectName = req.body.name;
    var subjectClock = req.body.clock;

    // 從session中獲取用戶名稱
    var username = req.session.user.username;

    // 從資料庫中獲取用戶資料
    var user = await User.findOne({ username: username });

    // 從用戶的考試中找到對應的考試
    var test = user.data.tests.find(test => test.name === testName);

    // 創建一個新的subject對象
    var newSubject = { name: subjectName, clock: subjectClock };

    // 將新的subject對象添加到對應的test中
    test.subject.push(newSubject);

    // 儲存用戶資料
    user.save()
        .then(() => {
            res.status(200).send('科目已成功新增！');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('新增科目失敗。');
        });

});

app.get('/getSubjects', async function(req, res) {
    // 從請求中獲取考試名稱
    var testName = req.query.testName;

    // 從session中獲取用戶名稱
    var username = req.session.user.username;

    // 從資料庫中獲取用戶資料
    var user = await User.findOne({ username: username });

    // 從用戶的考試中找到對應的考試
    var test = user.data.tests.find(test => test.name === testName);

    // 如果找不到對應的考試，則返回一個錯誤響應
    if (!test) {
        res.status(404).send('找不到對應的考試。');
        return;
    }

    // 返回該考試的所有科目
    res.status(200).json(test.subject);
});



app.listen(3000, () => console.log('Server is running on port 3000...'));
module.exports = router;
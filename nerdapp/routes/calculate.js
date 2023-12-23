var express = require('express');
const app = express();
// calculate.js
var router = express.Router();
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./users');
const path = require('path');

app.post('/saveExam', async (req, res) => {
    const user = req.session.user;
    user.data.tests.push({ name: req.body.name, date: req.body.date, subject: [] });
    await user.save();
    res.send('考試已儲存');
});

app.post('/saveSubject/:examName', async (req, res) => {
    const user = req.session.user;
    const exam = user.data.tests.find(test => test.name === req.params.examName);
    if (exam) {
        exam.subject.push(req.body);
        await user.save();
        res.send('科目已儲存');
    } else {
        res.status(404).send('考試未找到');
    }
});

app.post('/saveLeisure', async (req, res) => {
    const user = req.session.user;
    user.data.freeTime.push(req.body);
    await user.save();
    res.send('空閒時間已儲存');
});

// 新增的路由
app.get('/getExams', async (req, res) => {
    const user = req.session.user;
    res.send(user.data.tests);
});

app.get('/getFreeTime', async (req, res) => {
    const user = req.session.user;
    res.send(user.data.freeTime);
});

module.exports = router;
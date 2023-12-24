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

app.get('/getEvents', async (req, res) => {
    const user = req.session.user;
    const exams = user.data.tests.map(exam => ({
        title: exam.name,
        start: exam.date,
        color: '#36a2eb' // 考試事件的顏色
    }));

    const subjects = user.data.tests.reduce((acc, exam) => {
        exam.subject.forEach(subject => {
            acc.push({
                title: subject.name,
                start: `${exam.date}T${subject.start}`,
                end: `${exam.date}T${subject.end}`,
                color: '#ff6384' // 科目事件的顏色
            });
        });
        return acc;
    }, []);

    const freeTimes = user.data.freeTime.map(freeTime => ({
        title: '空閒時間',
        start: `2023-01-01T${freeTime.start}`,
        end: `2023-01-01T${freeTime.end}`,
        color: '#4bc0c0' // 空閒時間事件的顏色
    }));

    const events = [...exams, ...subjects, ...freeTimes];

    res.json(events);
});

module.exports = router;
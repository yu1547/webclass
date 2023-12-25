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
const Event = require('./event');

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

app.post('/saveEvent', async (req, res) => {
    try {
        // 從請求主體中獲取數據
        const { subjects, startTime, endTime } = req.body;

        // 在這裡執行保存事件的邏輯，例如存儲在數據庫中

        // 創建一個新的事件
        const newEvent = new Event({
            subjects,
            startTime,
            endTime,
        });

        // 將事件保存到數據庫
        await newEvent.save();

        // 返回成功的響應
        res.status(200).json({ message: 'Event saved successfully' });
    } catch (error) {
        // 如果出現錯誤，返回錯誤的響應
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
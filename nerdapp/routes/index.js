const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./user');

const app = express();

// 連接到 MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true, useUnifiedTopology: true});

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
    
    // 在這裡進行運算
    // const result = performCalculation();
    // 這邊做計算，如果沒東西回傳空則前端會進到calculate
    if (user.a && user.b) {
      const result = user.a + user.b;
      res.send({ result: result });
    } else {
      res.send({});
    }
    // 將結果儲存到資料庫
    // user.results.push(result);
    // await user.save();


    // res.send('Login successful!');
});

//處理計算請求並回傳結果
app.post('/calculate', async (req, res) => {
  const user = await User.findOne({ username: req.body.username }); // 你需要一種方法來獲取當前登入的用戶
  user.a = req.body.a;
  user.b = req.body.b;
  await user.save();
  const result = user.a + user.b;
  res.send({ result: result });
});

// 處理註冊請求
app.post('/register', async (req, res) => {
    let user = new User({
        username: req.body.username,
        password: req.body.password
    });

    user = await user.save();

    res.send(user);
});

app.listen(3000, () => console.log('Server is running on port 3000...'));

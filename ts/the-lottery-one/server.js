const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const port = 8001; // node 服务监听的端口
const hostname = ['localhost']; // 限制访问来源域名

const qwRobotApi =
  ''; // 企业微信机器人webhook地址

app.use(function (req, res, next) {
  //   checkHostname(req, res, next);
  if (hostname && !hostname.includes(req.hostname)) {
    res.send('404 - Not Found');
    return;
  }
  next();
}, express.static(__dirname + '/dist'));

app.post('/api/lottery/sendres', function (req, res, next) {
  const { stepName, luckyList } = req.body;
  console.log(`${stepName}名单：${luckyList.join(', ')}`);
  if (!qwRobotApi) {
    return res.json({
      code: -1,
      msg: '请配置企业微信机器人',
    });
  }
  axios.post(qwRobotApi, {
    msgtype: 'text',
    text: {
      content: `${stepName}名单：${luckyList.join(', ')}`,
    },
  });
  res.json({
    code: 0,
    msg: '成功',
  });
});
app.post('/api/lottery/save-name-list', function (req, res, next) {
  const { nameList1To3, nameList4To6 } = req.body;
  let saveFilePath = path.join(__dirname, './data/name-list.json');
  fs.writeFile(
    saveFilePath,
    JSON.stringify({
      nameList1To3,
      nameList4To6,
    }),
    function (err) {
      if (err) {
        res.json({
          code: 1,
          msg: '保存失败',
        });
        return;
      }
      res.json({
        code: 0,
        msg: '保存成功',
      });
    }
  );
});
app.get('/api/lottery/get-name-list', function (req, res, next) {
  let saveFilePath = path.join(__dirname, './data/name-list.json');
  let fileString = fs.readFileSync(saveFilePath);
  try {
    let data = JSON.parse(fileString.toString());
    res.json({
      code: 0,
      ...data,
    });
  } catch (e) {
    res.json({
      code: 1,
      msg: '列表读取失败',
    });
  }
});

app.listen(port, function () {
  console.log(`服务启动成功--> http://127.0.0.1:${port}`);
});

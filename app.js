const express = require('express');
const db = require('./models/index');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT; //환경변수

// 미들웨어처리
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/static', express.static(__dirname + '/static'));

// 라우터
const indexRouter = require('./routes');
app.use('/', indexRouter);

// 404 에러처리
app.get('*', (req, res) => {
  res.render('404');
});

// sync
// - db 연결 성공 후 작업 비동기 진행
// - force: true는 매번 테이블 재생성
db.sequelize.sync({ force: false }).then((result) => {
  // console.log(result);
  console.log('DB 연결 성공!');
  console.log('------');

  // 포트열기 (sync는 비동기적으로 동작)
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});

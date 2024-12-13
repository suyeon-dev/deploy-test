// const Visitor = require('../model/Visitor');
const models = require('../models/index');
const { errorlogs } = require('../utils/common');
// console.log(Visitor.getVisitors()); //cb수정없이 이거 지우면 해결됨 (콜백을 2번타게됨...!!)

/* GET / => localhost:PORT/ */
exports.main = (req, res) => {
  res.render('index');
};

/* 1. GET /visitors => localhost:PORT/visitors */
exports.getVisitors = (req, res) => {
  /* [DB 연결 전] */
  // res.render('visitors', { data: Visitor.getVisitors() });
  /* [DB 연결 후, Sequelize 전] */
  // Visitor.getVisitors((result) => {
  //   console.log('전체목록 Cvisitor.js', result); //모델의 select문의 결과
  //   res.render('visitors', { data: result });
  // });

  /* [Sequelize 이후] */
  // `SELECT * FROM visitor`
  models.Visitor.findAll()
    .then((result) => {
      console.log('findAll 결과:', result); // 배열 형태
      // res.send(result);
      res.render('visitors', { data: result });
    })
    .catch((err) => {
      console.log('getVisitors Controller Err :', err);
      res.status(500).send('server err!');
    });
};

/* 2. GET /visitor/:id */
// - params, query 두가지 방법으로 받을 수 있음 -> params
exports.getVisitor = async (req, res) => {
  console.log('req.params', req.params); //{id: '1'}
  console.log(req.params.id); //1 -> req.params.id를 사용해 URL에서 전달받은 id 값을 가져옴

  /* [sequelize 전] */
  // Visitor.getVisitor(req.params.id, (result) => {
  //   //Cvisitor 1개의 데이터 { id: 19, name: '산타', comment: '호호호호!' }
  //   console.log('Cvisitor 1개의 데이터', result);
  //   res.send(result); //콜백 안에서 응답하기
  // });

  /* [sequelize 후] */
  // (기존 Model) SELECT * FROM visitor WHERE id=${id}
  try {
    const result = await models.Visitor.findOne({
      where: {
        id: req.params.id,
      },
    });
    console.log('findeOnde의 결과:', result); //여러 개를 찾아도 맨 앞 하나만 반환(배열이 아닌 객체 형태)
    res.send(result);
    /*
    findeOnde의 결과: visitor {
      dataValues: { id: 20, name: '루돌프', comment: '징글벨 징글벨' },
      _previousDataValues: { id: 20, name: '루돌프', comment: '징글벨 징글벨' },
      uniqno: 1,
      _changed: Set(0) {},
      _options: {
      isNewRecord: false,
      _schema: null,
      _schemaDelimiter: '',
      raw: true,
      attributes: [ 'id', 'name', 'comment' ]
      },
      isNewRecord: false
    }
    */
  } catch (err) {
    console.log('err', err);
    res.status(500).send('internal server error');
  }
};

/* 3. POST /visitor, 등록 */
// (sequelize) insert into -> create()
exports.postVisitor = (req, res) => {
  console.log('req.body', req.body);

  // [sequelize 이전]
  // Visitor.postVisitor(req.body, (result) => {
  //   console.log('Cvisitor.js:', result); //result=Visitor의 cb(rows.insertId)
  //   res.send({ id: result, comment: req.body.comment, name: req.body.name });
  // });

  // [sequelize 이후]
  // INSERT INTO visitor VALUE(null, "${data.name}", "${data.comment}")
  models.Visitor.create({
    // data = req.body
    name: req.body.name,
    comment: req.body.comment,
  })
    .then((result) => {
      console.log('postVisitor:', result);
      res.send(result); //객체 형태
      /* visitor {
        dataValues: { id: 29, name: '댕댕', comment: '멍' },
        _previousDataValues: { name: '댕댕', comment: '멍', id: 29 },
        uniqno: 1,
        _changed: Set(0) {},
        _options: {
          isNewRecord: true,
          _schema: null,
          _schemaDelimiter: '',
          attributes: undefined,
          include: undefined,
          raw: undefined,
          silent: undefined
        },
        isNewRecord: false
      }
      */
    })
    .catch((err) => {
      console.log('err: ', err);
      res.status(500).send('server err');
    });
};

/* 4. DELETE /visitor, 삭제 */
//(sequelize) delete from ~~ -> destory()
exports.deleteVisitor = async (req, res) => {
  console.log('Cvisitor req.body', req.body); //{ id: '4' }
  console.log('Cvisitor req.body.id', req.body.id); //4

  // [sequelize 이전]
  //삭제 후 실행하는 일 : 콜백함수
  // Visitor.deleteVisitor(req.body.id, () => {
  //   res.send(req.body.id + '번 id 삭제 완료');
  // });
  // res.send('response!');

  // [sequelize 이후]
  // DELETE FROM visitor WHERE id=${req.body.id}
  try {
    const result = await models.Visitor.destroy({
      where: { id: req.body.id },
    });
    //1(삭제 성공)=true, 0(삭제 실패=없는 데이터 삭제 시도)=false
    //POSTMAN으로 확인해보기~!
    console.log('result:', result);

    // 형변환 (number to boolean)
    if (Boolean(result)) {
      res.send(req.body.id + '번 id 삭제 완료');
    } else {
      res.send('잘못된 접근입니다!');
    }
  } catch (err) {
    // console.log('err', err);
    // res.send('internal server error');
    errorlogs(res, err);
  }
};

/* 5. PATCH /visitor, 수정 */
// (seq) update set ~~ -> update
exports.patchVisitor = async (req, res) => {
  console.log('req.body', req.body);

  /* [sequelize 전] */
  // res.send('response patch!');
  // Visitor.patchVisitor(req.body, () => {
  //   res.send('수정 완료');
  // });

  /* [sequelize 후] */
  // UPDATE visitor SET name="${req.body.name}", comment="${req.body.comment}"
  // WHERE id=${data.id}
  try {
    // 선언할 때부터 배열의 구조 분해 -> 결과: 1 또는 0
    const [result] = await models.Visitor.update(
      {
        name: req.body.name,
        comment: req.body.comment,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    //[1] 수정 성공, [0] 수정 실패
    console.log('result:', result); // [1] 또는 [0]
    // const [number] = result[0];//배열의 구조분해
    // console.log(number);

    if (Boolean(result)) {
      res.send('수정 완료');
    } else {
      res.send('잘못된 접근입니다.'); //없는 데이터 수정 요청
    }
  } catch (err) {
    // 에러 함수화 -> utils 폴더에서 관리
    // errorlogs(err, 'patch controller 내부', '수정 에러가 났어요', 500);
    errorlogs(err, 'patch controller 내부');
  }
};

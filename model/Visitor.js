const mysql = require('mysql2');
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'suyeon',
  password: '1125',
  database: 'sesac',
});

//1. 전체 목록 "조회" - select
exports.getVisitors = (cb) => {
  // 연결 테스트
  conn.connect((err) => {
    if (err) {
      console.error('데이터베이스 연결 실패:', err);
      return;
    }
    console.log('데이터베이스에 성공적으로 연결되었습니다.');
  });
  // conn.query 비동기로 DB에서 데이터 조회
  conn.query('SELECT * FROM visitor', (err, rows) => {
    // 쿼리 실행 중 에러 발생하면 중단
    if (err) throw err;
    // 쿼리 결과 Visitor.js : //[{id: , name: , comment: }, {}, ..]
    console.log('쿼리 결과 Visitor.js:', rows);
    cb(rows); //결과 데이터를 Cvisitor.js 컨트롤러로 전달 (배열 형태)
  });
};

// 2. 특정 데이터 조회 - select문
// 컨트롤러에서 cb와 함께 id 넘겨줌
exports.getVisitor = (id, cb) => {
  conn.query(`SELECT * FROM visitor WHERE id=${id}`, (err, rows) => {
    if (err) {
      throw err;
    }
    // Model 테이블 한 개 조회 [ { id: 19, name: '산타', comment: '호호호호!' } ]
    console.log('Model 테이블 한 개 조회', rows);
    cb(rows[0]); //객체 형태
  });
};

// 3. 데이터 등록
// visitor 테이블에 데이터 삽입
exports.postVisitor = (data, cb) => {
  // data= req.body,comment와 name 정보가 있는 객체 형태
  conn.query(
    // 문자열은 따옴표안에 둘러싸야 함
    `INSERT INTO visitor VALUE(null, "${data.name}", "${data.comment}")`,
    (err, rows) => {
      if (err) throw err;
      console.log('model post', rows);
      /* 
  OkPacket {
      fieldCount: 0,
      affectedRows: 1,
      insertId: 5, // 현재 넣어진 id
      serverStatus: 2,
      warningCount: 0,
      message: '',
      protocol41: true,
      changedRows: 0
        }
      */
      cb(rows.insertId);
    }
  );
};

// 4. 데이터 삭제
exports.deleteVisitor = (id, cb) => {
  conn.query(`DELETE FROM visitor WHERE id=${id} `, (err, rows) => {
    if (err) throw err;
    console.log('모델 Visitor.js 특정 데이터 삭제', rows);
    /* 
    OkPacket {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    serverStatus: 2,
    warningCount: 0,
    message: '',
    protocol41: true,
    changedRows: 0
    }
    */
    cb();
  });
};

// 데이터 "수정"
exports.patchVisitor = (data, cb) => {
  console.log('model data', data);
  // {id, name, comment}
  conn.query(
    `UPDATE visitor 
    SET name="${data.name}", comment="${data.comment}" 
    WHERE id=${data.id}`,
    (err, rows) => {
      if (err) throw err;
      console.log('Visitor.js 수정', rows);
      /* 
      OkPacket {
      fieldCount: 0,
      affectedRows: 1,
      insertId: 0,
      serverStatus: 2,
      warningCount: 0,
      message: '(Rows matched: 1  Changed: 0  Warnings: 0',
      protocol41: true,
      changedRows: 0
        }
      */
      cb();
    }
  );
};

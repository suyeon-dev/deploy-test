/* Sequelize 설정 파일 index.js*/
'use strict';

const Sequelize = require('sequelize');
// 문자열로 처리되는 development, production 때문에 .접근법이 아니라 대괄호 접근법
// let config = require(__dirname + '/../config/config.json')['development'];
let config = require(__dirname + '/../config/config.js')['development']; //객체[key] 형태 <- config.json의 development
console.log('config', config);

const db = {};

/* [1] 설정값 */
let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

/* 설정값을 sequelize라는 키안에 넣어주는 중 */
db.sequelize = sequelize; //객체.key = 설정값
/* {
   sequelize: sequelize
} */

/* Sequelize 모듈을 Sequelize라는 key 안에 넣어주는 중 */
db.Sequelize = Sequelize;
/* {
    sequelize: sequelize;
    Sequelize: Sequelize;
}
*/

/* [2] Visitor 추가 */
// models > Visitor.js 함수 호출
db.Visitor = require('./Visitor')(sequelize, Sequelize);
/* db 객체 {
   sequelize: sequelize; //설정값
   Sequelize: Sequelize; //모듈
   Visitor: visitor의 모델(Sequelize.define의 값을 Visitor 키의 value로)
}
*/

module.exports = db; // 우리가 만든 db 객체를 내보내기 -> app.js에서 사용

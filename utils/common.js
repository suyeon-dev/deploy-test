// jsdocs (/** + [enter]키)
// - 내가 만든 함수에 대한 설명
/**
 * 서버 에러가 났을 때 실행될 코드 모음
 * @param {Response} res 실제 에러 전달
 * @param {Error} err 실제 에러 전달
 * @param {string} errMsgInServer 서버 콘솔에 띄워줄 메시지
 * @param {string} errMsgInClient 클라이언트에 보내줄 메시지
 * @param {number} statusCode 에러의 상태코드
 */

exports.errorlogs = (
  res,
  err,
  errMsgInServer = 'ERROR!',
  errMsgInClient = 'internal server error',
  statusCode = 500
) => {
  console.log(errMsgInServer, err);
  res.status(statusCode).send(errMsgInClient);
};

// 매개변수로 기본값 전달 (예: statusCode)

const tbody = document.querySelector('tbody');

// 3. 방명록 "등록"
// POST /visitor
function createVisitor() {
  const form = document.forms['visitor-form'];

  if (form.name.value.length === 0 || form.comment.value.length === 0) {
    alert('이름과 방명록을 모두 기입해주세요.');
    return;
  }

  // 테이블 생성시 name 컬럼을 varchar(10)으로 설정해두어서
  // 프론트에서 유효성검사를 하고 데이터 전송 (서버에 전달했을 때 에러 방지용)
  if (form.name.value.length > 10) {
    alert('이름은 10글자 미만으로 작성해주세요!');
    return;
  }

  axios({
    method: 'post',
    url: '/visitor',
    data: {
      name: form.name.value,
      comment: form.comment.value,
    },
  })
    .then((res) => {
      console.log(res.data);
      //새로고침하지 않아도 테이블에 방명록 등록
      const { id, comment, name } = res.data;
      const newHtml = `
      <tr id="tr_${id}">
          <td>${id}</td>
          <td>${name}</td>
          <td>${comment}</td>
          <td>
            <button onclick="editVisitor(${id})">수정</button>
          </td>
          <td>
            <button onclick="deleteVisitor(this,${id})">
              삭제
            </button>
          </td>
        </tr>`;
      //   tbody.append(newHtml); // append: 태그를 문자열로 인식

      // 문자열을 특정 요소의 맨마지막으로 HTML 추가
      // -- innerHTML이랑 비슷하지만, innerHTML은 이전 데이터를 모두 삭제하고 추가됨
      tbody.insertAdjacentHTML('beforeend', newHtml);
      form.reset();
    })
    .catch((err) => console.error(err));
}

// 4. 방명록 "삭제"
// DELETE /visitor
// - btn: visitor.ejs의 버튼 태그
function deleteVisitor(btn, id) {
  console.log(id);
  console.log(btn); // 태그 -> tr 태그 전체를 지우기 위해
  axios({
    method: 'delete',
    url: '/visitor',
    data: {
      id: id, //Cvisitor에서 사용하는 정보: deleteVisitor의 매개변수
    },
  })
    .then((text) => {
      console.log(text.data);
      //   btn.parentElement.parentElement.remove(); //td -> tr (부모의 부모 찾기)
      btn.closest(`#tr_${id}`).remove(); //선택자를 가진 가장 가까운 조상 요소를 찾아줌
    })
    .catch((err) => console.error(err));
}

// 5. 방명록 수정
// 수정 버튼을 누르면 GET /visitor/:id , 하나의 데이터 조회
// 5-1. 수정을 위한 입력창으로 변함
function editVisitor(id) {
  const form = document.forms['visitor-form'];
  axios({
    method: 'get',
    url: `/visitor/${id}`,
  })
    .then((res) => {
      console.log(res.data);
      const { name, comment, id } = res.data;
      form.name.value = name;
      form.comment.value = comment;

      const btnContainer = document.getElementById('btn-group');
      const html = `
      <button type="button" onclick=editDo(${id})>수정하기</button>
      <button type="button" onclick="editCancel()">수정취소</button>
      `;
      btnContainer.innerHTML = html;
    })
    .catch((err) => console.error(err));
}

// 5-2. 실제 수정 데이터를 요청
// PATCH /visitor
function editDo(id) {
  const form = document.forms['visitor-form'];
  if (form.name.value.length === 0 || form.comment.value.length === 0) {
    alert('이름과 방명록을 모두 기입해주세요.');
    return;
  }

  // 테이블 생성시 name 컬럼을 varchar(10)으로 설정해두어서
  // 프론트에서 유효성검사를 하고 데이터 전송
  if (form.name.value.length > 10) {
    alert('이름은 10글자 미만으로 작성해주세요!');
    return;
  }

  axios({
    method: 'patch',
    url: '/visitor',
    data: {
      id: id,
      comment: form.comment.value,
      name: form.name.value,
    },
  })
    .then((res) => {
      console.log(res.data); //"수정 완료"
      //   const { id, name, comment } = res.data;
      //   console.log(id, name, comment);
      const tr = document.querySelector(`#tr_${id}`);
      console.log(tr);
      console.log(tr.children); //배열 형태
      const children = tr.children; //children= [td,td,td,td,td]
      console.log(children);
      children[1].textContent = form.name.value; // 작성자
      children[2].textContent = form.comment.value; // 방명록 내용

      editCancel();
    })
    .catch((err) => console.error(err));
}

// 수정 취소
function editCancel() {
  // (1) form 안의 input 초기화
  const form = document.forms['visitor-form'];
  //   form.reset();
  form.name.value = '';
  form.comment.value = '';
  // (2) 등록 버튼 보이도록
  const btnContainer = document.getElementById('btn-group');
  btnContainer.innerHTML = `
  <button type="button" onclick="createVisitor()">방명록 등록</button>`;
}

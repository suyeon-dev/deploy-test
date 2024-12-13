show databases;
use sesac;

create table visitor(
    id int primary key AUTO_INCREMENT,
    name varchar(10) not null,
    comment mediumtext
);

desc visitor;
show TABLES;

-- data 삽입
insert into visitor(name, comment) values('홍길동', '내가 왔따');
insert into visitor values(null, '이찬혁', '으라차차');
insert into visitor values(null, '삭제예정', '으라차차');

-- data 조회
select * from visitor;

-- data 수정 
----수정 삭제는 whre 조건
update visitor set comment="야호~!!" where id=2;

-- data 삭제
delete from visitor where id=3;

################ DCL ################
--mySQL 사용자 생성
create user 'suyeon'@'%' IDENTIFIED by '1125';

--권한 부여
grant all PRIVILEGES on *.* to 'suyeon'@'%' with grant option;

-- alter user 'suyeon'@'%' IDENTIFIED with mysql_native_password by '1125';
-- MySQL 비밀번호 변경
ALTER USER 'suyeon'@'%' IDENTIFIED WITH caching_sha2_password BY '1125';
-- 현재 사용 중인 MySQL 캐시를 지우고 새로운 설정 적용
FLUSH PRIVILEGES;

select * from mysql.user;
show grants for 'suyeon'@'%';



--alter문 실행 실패 해결 시도 중...
SHOW PLUGINS;

INSTALL PLUGIN mysql_native_password SONAME 'auth_native_password.so';

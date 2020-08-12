# SyncService

ToGate의 동기화 서버 코드(NodeJS)

## 설치 및 실행 방법
### 1. VSCode 사용
* VSCode 실행 후, ctrl + j를 입력하여 터미널 열기
* git 설치 최상위 경로로 이동
* code .  (워크스페이스 변경 후 재시작)
* npm install 
* npm start
### 2. Docker 사용(별도 설치 필요)
* git 설치 최상위 경로로 이동(Dockerfile위치. Windows일 경우 powershell에서 할 것을 추천)
* docker 이미지 생성
  * docker build -t [이미지명:태그명] [Dockerfile경로]
    * ex) docker build -t sync_server:0.0.0 .
* docker 이미지 실행
  * docker run -p 1337:1337 sync_server:0.0.0

## 테스트
* node [unittest명]
  * ex) node ./bin/client_unittest.js

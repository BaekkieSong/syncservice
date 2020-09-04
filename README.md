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
* jest
  * 테스트 실행
    * package.json에서 "scripts": "test"를 다음과 같이 수정
      * "test": "jest"
    * npm test
  * 테스트 옵션
    * [옵션 목록](https://jestjs.io/docs/en/cli)
    * --colors: 결과 출력 강조
    * --json --outputFile=[파일명]: '파일명'에 결과를 Json으로 작성
    * --logHeapUsage: 테스트별 heap사용량 표시
    * --onlyChanged: 마지막 커밋이후 변경과 관련된 테스트만 수행
    * --maxWorkers=[num]: 작업에 사용할 워커 수 지정
    * --projects path1 path2: 여러 프로젝트 테스트 수행
    * --testNamePattern=[string]: 각 테스트 이름중에 'string'을 포함하는 테스트만 수행
    * --testPathPattern=[string]: 각 테스트 경로중에 'string'에 위치한 테스트만 수행
    * --coverage=true
    * --coverageProvider=babel/v8: 코드 계측 공급자 설정
    * --watch/--watchAll: 파일 변경시마다 테스트 새로 수행


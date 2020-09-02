# 어떤 이미지를 기반으로 이미지를 만들지 결정
FROM node:12.18.3

# Dockerfile을 생성 및 관리하는 사람
# MAINTAINER sbk

# /workdir 디렉토리 생성
RUN mkdir -p /workdir
# /workdir 디렉토리를 WORKDIR로 설정
WORKDIR /workdir
# 현재 Dockerfile이 있는 경로의 모든 파일을 /workdir로 복사. COPY 어디감?
ADD . /workdir
# npm install을 실행. package.json에 명시된 의존성 패키지들을 모두 설치
RUN npm install
RUN npm install https://github.com/mapbox/node-sqlite3/tarball/master

# 환경변수 NODE_ENV값을 development로 설정
ENV NODE_ENV production

# 가상 머신 포트
EXPOSE 1337 80

# 컨테이너에서 실행될 명령을 설정(foreground로 설정해야만 종료 안됨)
# package.json에 명시된 script를 실행
CMD ["npm", "start"]

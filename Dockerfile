# FROM node:16

# # 앱 디렉터리 생성
# WORKDIR /dittybox/src/app

# # 앱 의존성 설치
# # 가능한 경우(npm@5+) package.json과 package-lock.json을 모두 복사하기 위해
# # 와일드카드를 사용
# COPY package*.json ./

# RUN npm install
# # 프로덕션을 위한 코드를 빌드하는 경우
# # RUN npm ci --only=production

# # 앱 소스 추가
# COPY . .

# RUN npm run build


# CMD [ "node", "dist/main" ]

# Step 1
## base image for Step 1: Node 10
FROM node:16 AS builder
WORKDIR /app
## 프로젝트의 모든 파일을 WORKDIR(/app)로 복사한다
COPY . .
## Nest.js project를 build 한다
RUN npm install
RUN npm run build
 
# Step 2
## base image for Step 2: Node 10-alpine(light weight)
FROM node:16-alpine
WORKDIR /app
## Step 1의 builder에서 build된 프로젝트를 가져온다
COPY --from=builder /app ./
## application 실행

EXPOSE 465
EXPOSE 587
EXPOSE 8080

CMD ["npm", "run", "start:prod"]
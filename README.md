# OTC (Objekt Trade) - Backend

## 프로젝트 소개

이 프로젝트는 Objekt Trade 플랫폼의 백엔드 서버입니다. NestJS 프레임워크를 기반으로 구축되었으며, RESTful API와 WebSocket을 통한 실시간 통신을 지원합니다.

## 주요 기능

- RESTful API 제공
- WebSocket을 통한 실시간 메시징
- JWT 기반 인증
- Swagger API 문서 자동화
- CORS 지원

## 기술 스택

- NestJS
- TypeScript
- Socket.IO
- Passport
- JWT
- Swagger
- Redis (선택적)

## 시작하기

### 환경 설정

1. 프로젝트 클론
```bash
git clone [repository-url]
cd backend
```

2. 의존성 설치
```bash
npm install
```

3. 실행
```bash
npm run start:dev
npm run start:prod
```
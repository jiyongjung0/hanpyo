# hanpyo

TypeScript와 Vite로 구축된 React 웹 애플리케이션입니다.

## 시작하기

```bash
# 저장소 클론
git clone https://github.com/jiyongjung0/hanpyo.git
cd hanpyo

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

개발 서버는 http://localhost:5173 에서 실행됩니다.

## 사용 가능한 명령어

```bash
npm run dev      # 개발 서버 시작 (HMR 포함)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 실행
npm run preview  # 프로덕션 빌드 미리보기
```

## 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빠른 빌드 도구 및 개발 서버
- **ESLint** - 코드 품질 도구

## 프로젝트 구조

```
hanpyo/
├── src/
│   ├── main.tsx        # 애플리케이션 진입점
│   ├── App.tsx         # 메인 App 컴포넌트
│   ├── assets/         # 정적 자산
│   └── ...
├── public/             # 공개 정적 파일
├── index.html          # HTML 진입점
├── vite.config.ts      # Vite 설정
├── tsconfig.json       # TypeScript 설정
└── package.json        # 프로젝트 의존성
```

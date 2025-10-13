# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**hanpyo**는 TypeScript와 Vite로 구축된 React 웹 애플리케이션입니다. React 19를 사용하며, ESLint를 통한 린팅과 빠른 개발 및 최적화된 프로덕션 빌드를 위한 Vite를 포함한 최신 도구를 사용합니다.

**저장소**: https://github.com/jiyongjung0/hanpyo

## 개발 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (HMR 포함, http://localhost:5173)
npm run dev

# 린터 실행
npm run lint

# 프로덕션 빌드
npm run build

# 프로덕션 빌드 로컬 미리보기
npm run preview
```

## 프로젝트 구조

- `src/` - 소스 코드 디렉토리
  - `main.tsx` - 애플리케이션 진입점
  - `App.tsx` - 메인 App 컴포넌트
  - `assets/` - 정적 자산 (이미지, 폰트 등)
- `public/` - 그대로 제공되는 공개 정적 파일
- `index.html` - HTML 진입점 (Vite가 이를 진입점으로 사용)

## TypeScript 설정

프로젝트는 다중 설정 TypeScript 구조를 사용합니다:
- `tsconfig.json` - 다른 설정을 참조하는 루트 설정
- `tsconfig.app.json` - 애플리케이션 코드 설정
- `tsconfig.node.json` - Node.js/Vite 설정 파일용 설정

## 빌드 시스템

Vite 설정:
- `@vitejs/plugin-react` - Babel을 통한 React Fast Refresh 제공
- TypeScript 컴파일은 Vite 빌드 전에 실행: `tsc -b && vite build`

## 린팅

ESLint 설정:
- `typescript-eslint`를 통한 TypeScript 지원
- `eslint-plugin-react-hooks` 및 `eslint-plugin-react-refresh`를 통한 React 전용 규칙
- `eslint.config.js`에 설정

린팅 문제를 확인하려면 `npm run lint`를 실행하세요.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**hanpyo**는 외래어 표기 용례를 검색하는 React 웹 애플리케이션입니다. TypeScript와 Vite로 구축되었으며, 국립국어원의 외래어 표기 데이터(CSV)를 기반으로 실시간 검색 기능을 제공합니다.

**저장소**: https://github.com/jiyongjung0/hanpyo
**라이브 데모**: https://jiyongjung0.github.io/hanpyo/

## 주요 기능

- 원어 표기 실시간 검색 (대소문자 구분 없음)
- CSV 데이터 파싱 및 필터링 (PapaParse 사용)
- 검색 결과 테이블 표시 (한글 표기, 원어 표기, 언어명, 국명, 의미)
- 반응형 디자인

## 개발 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (HMR 포함, http://localhost:5173)
npm run dev

# 테스트 실행 (watch 모드)
npm run test

# 테스트 UI
npm run test:ui

# 코드 커버리지
npm run test:coverage

# 린터 실행
npm run lint

# 프로덕션 빌드
npm run build

# 프로덕션 빌드 로컬 미리보기
npm run preview
```

## 프로젝트 구조

```
src/
├── main.tsx                    # 애플리케이션 진입점
├── App.tsx                     # 메인 컨테이너 컴포넌트
├── components/                 # 재사용 가능한 컴포넌트
│   ├── SearchInput.tsx         # 검색 입력 컴포넌트
│   ├── SearchInput.test.tsx    # SearchInput 테스트
│   ├── ResultsTable.tsx        # 결과 테이블 컴포넌트
│   └── ResultsTable.test.tsx   # ResultsTable 테스트
├── hooks/                      # 커스텀 React 훅
│   ├── useForeignWordData.ts   # CSV 데이터 로딩 훅
│   └── useSearch.ts            # 검색 로직 훅
├── utils/                      # 유틸리티 함수
│   ├── csvLoader.ts            # CSV 파일 로드 및 파싱
│   ├── searchUtils.ts          # 검색 필터링 로직
│   └── searchUtils.test.ts     # searchUtils 테스트
├── types/                      # TypeScript 타입 정의
│   └── ForeignWord.ts          # CSV 데이터 타입
├── assets/                     # 정적 자산
│   └── 20251013.csv            # 외래어 표기 데이터 (약 8.8MB)
└── test/                       # 테스트 설정
    └── setup.ts                # Vitest 설정
```

## 아키텍처 설계

### 관심사의 분리 (Separation of Concerns)

1. **컴포넌트 (Presentation Layer)**
   - `SearchInput`: 검색 입력 UI
   - `ResultsTable`: 검색 결과 테이블 UI
   - 순수 프레젠테이션 컴포넌트로 설계 (props를 통한 데이터 전달)

2. **커스텀 훅 (Business Logic Layer)**
   - `useForeignWordData`: 데이터 로딩 및 상태 관리
   - `useSearch`: 검색 쿼리 및 필터링 로직
   - 비즈니스 로직을 재사용 가능한 훅으로 분리

3. **유틸리티 (Utility Layer)**
   - `csvLoader`: CSV 파일 로드 및 파싱
   - `searchUtils`: 순수 함수로 구현된 검색 필터링 로직
   - 테스트 가능한 순수 함수로 설계

### 테스트 전략

- **단위 테스트**: 유틸리티 함수 및 컴포넌트 테스트
- **Vitest**: 빠른 테스트 실행 환경
- **React Testing Library**: 사용자 중심 컴포넌트 테스트
- **총 15개 테스트 케이스** (모두 통과)

## TypeScript 설정

프로젝트는 다중 설정 TypeScript 구조를 사용합니다:
- `tsconfig.json` - 다른 설정을 참조하는 루트 설정
- `tsconfig.app.json` - 애플리케이션 코드 설정
  - `types: ["vite/client", "@testing-library/jest-dom"]` 포함
- `tsconfig.node.json` - Node.js/Vite 설정 파일용 설정

## 빌드 시스템

### Vite 설정 (`vite.config.ts`)
- `@vitejs/plugin-react` - Babel을 통한 React Fast Refresh 제공
- `base: '/hanpyo/'` - GitHub Pages 경로 설정
- `test` 설정 - Vitest 통합
- TypeScript 컴파일은 Vite 빌드 전에 실행: `tsc -b && vite build`

### CSV 파일 처리
- CSV 파일은 `?url` 쿼리를 사용하여 import
- 빌드 시 `dist/assets/` 폴더에 포함됨
- 예: `import csvFile from '../assets/20251013.csv?url'`

## 배포

### GitHub Actions CI/CD (`.github/workflows/deploy.yml`)
- **트리거**: `main` 브랜치에 푸시
- **워크플로우**:
  1. 의존성 설치 (`npm ci`)
  2. 테스트 실행 (`npm run test -- --run`)
  3. 프로덕션 빌드 (`npm run build`)
  4. GitHub Pages 배포

### GitHub Pages 설정
- Source: GitHub Actions
- 배포 URL: https://jiyongjung0.github.io/hanpyo/

## 린팅

ESLint 설정:
- `typescript-eslint`를 통한 TypeScript 지원
- `eslint-plugin-react-hooks` 및 `eslint-plugin-react-refresh`를 통한 React 전용 규칙
- `eslint.config.js`에 설정

린팅 문제를 확인하려면 `npm run lint`를 실행하세요.

## 데이터 구조

### ForeignWordEntry 타입
```typescript
interface ForeignWordEntry {
  번호: string;
  구분: string;
  '한글 표기': string;
  '원어 표기': string;
  국명: string;
  언어명: string;
  의미: string;
}
```

## 개발 가이드라인

### 새로운 기능 추가 시
1. 비즈니스 로직은 훅이나 유틸리티 함수로 분리
2. 컴포넌트는 순수 프레젠테이션 로직만 포함
3. 모든 유틸리티 함수에 대한 단위 테스트 작성
4. TypeScript strict 모드 준수

### 테스트 작성 시
- `describe`와 `it`을 사용한 명확한 테스트 구조
- 한글로 작성된 명확한 테스트 설명
- 엣지 케이스 포함 (빈 문자열, 공백, 대소문자 등)

### 커밋 전
1. `npm run test` - 모든 테스트 통과 확인
2. `npm run lint` - 린팅 오류 해결
3. `npm run build` - 빌드 성공 확인

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**hanpyo**는 외래어 표기 용례를 검색하는 React 웹 애플리케이션입니다. TypeScript와 Vite로 구축되었으며, 국립국어원의 외래어 표기 데이터(CSV)를 기반으로 실시간 검색 기능을 제공합니다.

**저장소**: https://github.com/jiyongjung0/hanpyo
**라이브 데모**: https://jiyongjung0.github.io/hanpyo/

## 주요 기능

- **관련도 순 검색**: 완전일치 → 단어 단위 완전일치 → 전체 시작 → 단어 경계 시작 → 전체 끝 → 단어 경계 끝 → 중간 포함 순으로 정렬
- **단어 경계 매칭**: "Jerome Powell" 검색 시 "Powell"이 "Powellson"보다 우선
- **실시간 검색**: 대소문자 구분 없이 원어 표기 검색
- **검색어 하이라이팅**: 검색 결과의 원어 표기에서 매칭된 부분을 녹색으로 강조 표시
- **전역 키보드 입력**: 입력창에 포커스가 없어도 일반 문자 입력 시 자동으로 입력창에 포커스
- CSV 데이터 파싱 및 필터링 (PapaParse 사용)
- 검색 결과 테이블 표시 (구분, 한글 표기, 원어 표기, 언어명, 국명, 의미)
- 데이터 출처 및 업데이트 날짜 표시
- 키보드 단축키 지원 (ESC: 입력 지우기, Enter: 전체 선택)
- 자동 포커스 및 Clear 버튼
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
├── dataUpdateDate.ts           # 데이터 업데이트 날짜 상수
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
│   ├── search.ts               # 검색 필터링 로직
│   ├── search.test.ts          # search 테스트
│   ├── highlight.tsx           # 검색어 하이라이팅 유틸리티
│   └── highlight.test.tsx      # highlight 테스트
├── types/                      # TypeScript 타입 정의
│   └── ForeignWord.ts          # CSV 데이터 타입
├── assets/                     # 정적 자산
│   └── data.csv                # 외래어 표기 데이터 (2025년 10월 기준 약 8.4MB)
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
   - `search`: 순수 함수로 구현된 검색 필터링 로직
   - `highlight`: 검색어 하이라이팅 로직 (정규식 기반 텍스트 분리 및 JSX 변환)
   - 테스트 가능한 순수 함수로 설계

### 검색 알고리즘

검색 결과는 관련도 순으로 정렬됩니다:

1. **완전 일치**: 검색어와 정확히 일치
2. **단어 단위 완전 일치**: 공백으로 구분된 단어 중 하나가 검색어와 정확히 일치 (예: "Jerome Powell"에서 "Powell" 검색)
3. **전체 시작**: 전체 문자열이 검색어로 시작 (예: "Powellson"에서 "Powell" 검색)
4. **단어 경계에서 시작**: 단어 경계에서 검색어가 시작 (정규식 `\b` 사용)
5. **전체 끝**: 전체 문자열이 검색어로 끝남
6. **단어 경계 끝**: 단어 경계에서 검색어가 끝남
7. **중간 포함**: 그 외 검색어를 포함하는 경우

**2차 정렬 (길이 순)**:
- 각 우선순위 그룹 내에서 원어 표기 길이가 짧은 순으로 정렬
- 길이가 짧을수록 검색어와의 일치율이 높다고 판단
- 완전 일치 그룹은 항상 1개 항목이므로 정렬 불필요

**성능 최적화**:
- 시간 복잡도: O(n log n) - 단일 순회로 그룹 분류 후 각 그룹 정렬 및 병합
- 정규식 재사용으로 불필요한 생성 제거
- 조기 종료로 불필요한 검사 생략

### 하이라이팅 구현

`highlightText` 함수는 검색어와 일치하는 텍스트 부분을 `<strong>` 태그로 감싸서 반환합니다:

**핵심 로직**:
1. **특수문자 이스케이프**: 정규식에서 사용되는 특수문자(`.*+?^${}()|[]\` 등)를 이스케이프 처리
2. **정규식 생성**: `(${escapedQuery})` - 괄호로 캡처 그룹을 만들어 `split()`이 매칭된 부분도 반환하도록 함
3. **텍스트 분리**: `text.split(regex)`로 매칭된 부분과 그렇지 않은 부분을 배열로 분리
4. **JSX 변환**: 각 부분을 순회하며 매칭된 부분은 `<strong>` 태그로, 그렇지 않은 부분은 그대로 반환

**예시**:
```typescript
highlightText('Jerome Powell', 'powell')
// 결과: ['Jerome ', <strong key={1}>Powell</strong>]
```

**주의사항**:
- `.tsx` 확장자 필요 (JSX 문법 사용)
- `import type { ReactNode }` 형태로 타입 import (verbatimModuleSyntax 설정 준수)
- 각 요소에 고유한 `key` prop 할당 필요

### 테스트 전략

- **단위 테스트**: 유틸리티 함수 및 컴포넌트 테스트
- **Vitest**: 빠른 테스트 실행 환경
- **React Testing Library**: 사용자 중심 컴포넌트 테스트
- **총 46개 테스트 케이스** (모두 통과)
  - 검색어 유효성 검증: 8개
  - 기본 검색 기능: 7개
  - 관련도 순 정렬: 2개
  - 단어 경계 매칭: 3개
  - 하이라이팅: 8개
  - 컴포넌트 테스트: 18개 (SearchInput 12개, ResultsTable 6개)

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
- 예: `import csvFile from '../assets/data.csv?url'`
- 파일명을 `data.csv`로 고정하여 업데이트 시 코드 수정 불필요

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
  구분: string;          // 인명, 지명, 일반 용어 등
  '한글 표기': string;   // 한글로 표기된 외래어
  '원어 표기': string;   // 원어 철자
  국명: string;          // 국가명
  언어명: string;        // 언어명 (영어, 프랑스어 등)
  의미: string;          // 용어의 의미/설명
}
```

**참고**: CSV 파일에서 `번호` 필드는 데이터 크기 절감을 위해 제거되었습니다.

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
4. **CLAUDE.md 업데이트** - 주요 기능 추가/변경 시 이 문서를 업데이트하여 최신 상태 유지

## Claude Code 사용 지침

### 자동 문서 업데이트
- 주요 기능이나 아키텍처가 변경될 때마다 **자동으로 CLAUDE.md를 업데이트**하세요
- 새로운 컴포넌트, 훅, 유틸리티 추가 시 "프로젝트 구조" 섹션 업데이트
- 테스트 케이스 수가 변경되면 "테스트 전략" 섹션 업데이트
- 데이터 구조 변경 시 "데이터 구조" 섹션 업데이트
- 사용자가 요청하지 않아도 관련 변경사항이 있으면 이 문서를 먼저 업데이트하세요

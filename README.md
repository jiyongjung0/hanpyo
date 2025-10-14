# hanpyo

외래어 표기 용례를 검색하는 웹 애플리케이션입니다.

국립국어원의 외래어 표기 데이터를 기반으로 원어 표기를 검색하고 한글 표기법을 확인할 수 있습니다.

## 라이브 데모

🌐 **https://jiyongjung0.github.io/hanpyo/**

## 주요 기능

- 📝 **실시간 검색**: 원어 표기를 입력하면 즉시 검색 결과 표시
- 🔍 **부분 일치 검색**: 대소문자 구분 없이 부분 문자열로 검색
- 📊 **상세 정보 제공**: 한글 표기, 원어 표기, 언어명, 국명, 의미 표시
- ⌨️ **키보드 단축키**: ESC로 입력 지우기, Enter로 전체 선택
- 📱 **반응형 디자인**: 모바일 및 데스크톱 환경 모두 지원
- ✅ **테스트 커버리지**: 17개 단위 테스트로 안정성 보장

## 사용 방법

### 키보드 단축키

- **ESC**: 검색어 입력 내용 전체 지우기
- **Enter**: 검색어 전체 선택 (빠른 덮어쓰기)
- 검색창 오른쪽 **✕ 버튼**: 입력 내용 지우기

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
npm run dev            # 개발 서버 시작 (HMR 포함)
npm run build          # 프로덕션 빌드
npm run lint           # ESLint 실행
npm run preview        # 프로덕션 빌드 미리보기
npm run test           # 테스트 실행 (watch 모드)
npm run test:ui        # 테스트 UI로 실행
npm run test:coverage  # 코드 커버리지 확인
```

## 기술 스택

### 프론트엔드
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빠른 빌드 도구 및 개발 서버
- **PapaParse** - CSV 파싱

### 개발 도구
- **Vitest** - 단위 테스트 프레임워크
- **React Testing Library** - 컴포넌트 테스트
- **ESLint** - 코드 품질 도구
- **GitHub Actions** - CI/CD 자동화

### 배포
- **GitHub Pages** - 정적 사이트 호스팅
- 자동 배포: main 브랜치에 푸시 시 자동으로 빌드 및 배포

## 프로젝트 구조

자세한 프로젝트 구조 및 아키텍처 설계는 [CLAUDE.md](./CLAUDE.md)를 참고하세요.


## 배포

이 프로젝트는 GitHub Actions를 통해 자동으로 배포됩니다:

1. `main` 브랜치에 푸시
2. GitHub Actions가 자동으로 실행
3. 테스트 실행 → 빌드 → GitHub Pages 배포

배포된 사이트: https://jiyongjung0.github.io/hanpyo/

## 문의

GitHub issue나 `bwhite8129 @ gmail.com`로 연락 부탁드립니다.

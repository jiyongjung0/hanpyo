/**
 * 애플리케이션 전반에서 사용되는 메시지 상수
 */

export const MESSAGES = {
  // 로딩 및 에러
  LOADING: '데이터 로딩 중...',
  LOAD_ERROR: '데이터를 불러오는데 실패했습니다.',

  // 검색 관련
  NO_RESULTS: '검색 결과가 없습니다.',
  INVALID_QUERY: '영어는 두 글자 이상 입력해주세요.',

  // 입력창
  INPUT_PLACEHOLDER: '원어 표기를 입력하세요 (예: Josie)',
  CLEAR_BUTTON_LABEL: '입력 내용 지우기',

  // Footer
  DATA_SOURCE_LABEL: '데이터 출처:',
  DATA_SOURCE_NAME: '국립국어원 외래어 표기 용례',
  GITHUB_LABEL: 'GitHub 저장소',
} as const

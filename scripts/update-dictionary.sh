#!/bin/bash
# 사전 업데이트 배치 스크립트

set -e  # 에러 발생 시 중단

# 1. API로 CSV 업데이트
# 필요한 환경변수: KOREAN_GO_KR_SERVICE_KEY
echo "🔄 외래어 표기 사전 업데이트 중..."
python importer/update_csv.py src/assets/data.csv

# 2. 사전 변경사항이 없으면 종료
if ! git diff --quiet src/assets/data.csv; then
  echo "✨ 사전 데이터가 변경되었습니다."
else
  echo "ℹ️  사전 데이터 변경사항이 없습니다. 종료합니다."
  exit 0
fi

# 3. dataUpdateDate.ts 업데이트
echo "📝 업데이트 날짜 기록 중..."
TODAY=$(date +%Y-%m-%d)
echo "export const DATA_UPDATE_DATE = '$TODAY'" > src/dataUpdateDate.ts

# 4. 커밋
git add src/assets/data.csv src/dataUpdateDate.ts
git commit -m "데이터: 외래어 표기 사전 업데이트"
git push

echo "✅ 사전 업데이트 완료: $TODAY"

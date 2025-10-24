#!/bin/bash
# 사전 업데이트 배치 스크립트

set -e  # 에러 발생 시 중단

# 1. 사전 파일 다운로드
echo "📥 외래어 표기 사전 다운로드 중..."
curl -sSL -o dictionary.xlsx --retry 3 --connect-timeout 30 --max-time 60 \
   'https://korean.go.kr/kornorms/standard/example/excelDownload.do?regltn_code=0003'

# 2. CSV 변환
echo "🔄 CSV 파일로 변환 중..."
python importer/convert_to_csv.py dictionary.xlsx src/assets/data.csv

# 3. 임시 파일 삭제
rm dictionary.xlsx

# 4. 사전 변경사항이 없으면 종료
if ! git diff --quiet src/assets/data.csv; then
  echo "✨ 사전 데이터가 변경되었습니다."
else
  echo "ℹ️  사전 데이터 변경사항이 없습니다. 종료합니다."
  exit 0
fi

# 5. dataUpdateDate.ts 업데이트
echo "📝 업데이트 날짜 기록 중..."
TODAY=$(date +%Y-%m-%d)
echo "export const DATA_UPDATE_DATE = '$TODAY'" > src/dataUpdateDate.ts

# 6. 커밋
git add src/assets/data.csv src/dataUpdateDate.ts
git commit -m "데이터: 외래어 표기 사전 업데이트"
git push

echo "✅ 사전 업데이트 완료: $TODAY"

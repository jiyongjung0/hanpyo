#!/bin/bash
# 사전 업데이트 배치 스크립트

set -e  # 에러 발생 시 중단

# 1. 사전 파일 다운로드
echo "📥 외래어 표기 사전 다운로드 중..."
curl -vL --retry 3 --retry-delay 5 --max-time 300 -o dictionary.xlsx 'https://korean.go.kr/kornorms/standard/example/excelDownload.do?regltn_code=0003'

# 2. Python 의존성 설치 및 CSV 변환
echo "🔄 CSV 파일로 변환 중..."
pip install -q openpyxl
python importer/convert_to_csv.py dictionary.xlsx src/assets/data.csv

# 3. dataUpdateDate.ts 업데이트
echo "📝 업데이트 날짜 기록 중..."
TODAY=$(date +%Y-%m-%d)
echo "export const DATA_UPDATE_DATE = '$TODAY'" > src/dataUpdateDate.ts

# 4. 임시 파일 삭제
rm dictionary.xlsx

echo "✅ 사전 업데이트 완료: $TODAY"

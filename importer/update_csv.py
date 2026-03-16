#!/usr/bin/env python
# usage: ./update_csv.py <output_csv>
#
# 국립국어원 외래어 표기 API에서 데이터를 가져와 기존 CSV를 업데이트합니다.
# - 한 페이지씩 가져오며, 해당 페이지에 변경사항이 없으면 종료합니다.
# - 변경사항이 있으면 새 항목을 추가하고 다음 페이지를 확인합니다.

import csv
import os
import sys
import time
import urllib.request
import urllib.parse
import json

API_BASE = "https://korean.go.kr/kornorms/exampleReqList.do"
SERVICE_KEY = os.environ.get("KOREAN_GO_KR_SERVICE_KEY", "")
LANG_TYPE = "0003"
NUM_OF_ROWS = 50
DELAY_BETWEEN_REQUESTS = 0.2  # 서버 부하 방지용 딜레이 (초)

CSV_HEADERS = ["구분", "한글 표기", "원어 표기", "국명", "언어명", "의미"]


def api_item_to_row(item: dict) -> dict:
    """API 응답 항목을 CSV 행 dict로 변환합니다."""
    return {
        "구분": (item.get("foreign_gubun") or "").strip(),
        "한글 표기": (item.get("korean_mark") or "").strip(),
        "원어 표기": (item.get("srclang_mark") or "").strip(),
        "국명": (item.get("guk_nm") or "").strip(),
        "언어명": (item.get("lang_nm") or "").strip(),
        "의미": (item.get("mean") or "").strip(),
    }


def row_to_tuple(row: dict) -> tuple:
    return tuple(row.get(h, "") for h in CSV_HEADERS)


def fetch_page(page_no: int) -> dict:
    """API에서 지정한 페이지를 가져옵니다."""
    params = urllib.parse.urlencode({
        "serviceKey": SERVICE_KEY,
        "pageNo": page_no,
        "numOfRows": NUM_OF_ROWS,
        "langType": LANG_TYPE,
        "resultType": "json",
    })
    url = f"{API_BASE}?{params}"

    req = urllib.request.Request(url, headers={"User-Agent": "hanpyo-updater/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    response = data.get("response", {})
    if response.get("resultcode") != 0:
        raise RuntimeError(f"API 오류: {response.get('resultmsg')} (code={response.get('resultcode')})")

    return response


def load_existing_csv(path: str) -> tuple[list[dict], set[tuple]]:
    """기존 CSV를 로드하여 행 목록과 튜플 집합을 반환합니다."""
    rows: list[dict] = []
    tuples: set[tuple] = set()
    try:
        with open(path, newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                clean = {h: row.get(h, "").strip() for h in CSV_HEADERS}
                rows.append(clean)
                tuples.add(row_to_tuple(clean))
    except FileNotFoundError:
        pass
    return rows, tuples


def write_csv(path: str, rows: list[dict]) -> None:
    """행 목록을 CSV 파일로 저장합니다."""
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_HEADERS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def main():
    if len(sys.argv) != 2:
        print("usage: ./update_csv.py <output_csv>")
        sys.exit(1)

    output_path = sys.argv[1]

    if not SERVICE_KEY:
        print("오류: 환경변수 KOREAN_GO_KR_SERVICE_KEY가 설정되지 않았습니다.")
        sys.exit(1)

    print("📂 기존 CSV 로드 중...")
    existing_rows, existing_set = load_existing_csv(output_path)
    print(f"   기존 항목 수: {len(existing_rows)}")

    new_rows: list[dict] = []
    page_no = 1

    while True:
        print(f"🌐 페이지 {page_no} 확인 중...")
        response = fetch_page(page_no)

        if page_no == 1:
            total_count = response.get("totalcount", 0)
            total_pages = (total_count + NUM_OF_ROWS - 1) // NUM_OF_ROWS
            print(f"   전체 항목 수: {total_count}, 전체 페이지 수: {total_pages}")

        items = response.get("items", [])
        if not items:
            print("   더 이상 데이터가 없습니다.")
            break

        page_rows = [api_item_to_row(item) for item in items]
        changed = [r for r in page_rows if row_to_tuple(r) not in existing_set]

        if not changed:
            print(f"   변경사항 없음. 종료합니다. (페이지 {page_no}에서 중단)")
            break

        print(f"   {len(changed)}개 신규/변경 항목 발견.")
        for row in changed:
            new_rows.append(row)
            existing_set.add(row_to_tuple(row))

        if page_no >= total_pages:
            break

        page_no += 1
        time.sleep(DELAY_BETWEEN_REQUESTS)

    if not new_rows:
        print("✅ 변경사항 없음.")
        sys.exit(0)

    # 새 항목을 앞에 추가 (최신 순 유지)
    updated_rows = new_rows + existing_rows
    print(f"\n💾 CSV 저장 중: {output_path} (총 {len(updated_rows)}개 항목)")
    write_csv(output_path, updated_rows)
    print("✅ 저장 완료.")


if __name__ == "__main__":
    main()

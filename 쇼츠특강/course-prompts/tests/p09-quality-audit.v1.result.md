# P09 품질 점검 결과

## 최종 판정

- 이미지 생성형 쇼츠: 그대로 사용 가능
- 그래픽형 쇼츠: 그대로 사용 가능

## 결과물 확인

| 구분 | 파일 | 길이 | 판정 |
| --- | --- | ---: | --- |
| 이미지 생성형 | `out/image-dancing-plague-short.mp4` | 약 31.06초 | 통과 |
| 그래픽형 | `out/graphics-cycloid-short.mp4` | 약 35.69초 | 통과 |

## 스토리보드 검수

| 구분 | scene 수 | narration/chunks 일치 | audio.source | 타이밍 | 판정 |
| --- | ---: | --- | --- | --- | --- |
| 이미지 생성형 | 5 | 전부 일치 | 전부 연결 | 전부 일치 | 통과 |
| 그래픽형 | 5 | 전부 일치 | 전부 연결 | 전부 일치 | 통과 |

## 확인한 항목

- `storyboards/image-dancing-plague.storyboard.json` 파싱 성공
- `storyboards/graphics-cycloid.storyboard.json` 파싱 성공
- `ImageDancingPlagueShort` composition 등록 확인
- `GraphicsCycloidShort` composition 등록 확인
- `npm run typecheck` 통과
- 한글 깨짐 패턴 검사 통과

## 발견 및 조치

- 그래픽형 storyboard에서 TTS용 `narration`에는 문장부호가 있었지만 일부 `subtitleChunks`에는 문장부호가 빠져 있어, 처음 검수에서 정확 일치 조건이 실패했다.
- `storyboards/graphics-cycloid.storyboard.json`의 자막 청크 문장부호를 보정했고, `out/graphics-cycloid-short.mp4`를 다시 렌더했다.

## 수업 운영 메모

- Codex CLI도 웹조사를 사용할 수 있다. 다만 별도 `--search` 옵션을 붙이는 방식이 아니라, 프롬프트에 "웹조사하고 출처를 확인해줘"라고 지시하면 필요한 경우 검색을 수행한다.
- 긴 한글 프롬프트와 한글 JSON 검수는 PowerShell 문자열 인코딩에 민감하다. 수업 프롬프트에는 Node.js `fs.readFileSync(..., "utf8")`로 JSON을 읽으라는 지시를 넣는 것이 안전하다.
- P09 CLI 실행 중 사용량 제한이 발생했다. 실제 수업에서는 CLI 사용량 제한 가능성을 안내하고, 데스크톱 Codex 세션에서 이어서 검수하는 대안을 함께 제시하는 것이 좋다.

# Codex Shorts Workshop Prompt Pack

이 문서는 수업 중 수강생이 순서대로 Codex에 입력할 프롬프트를 정리한 것입니다.

## 공통 실행 메모

긴 한글 프롬프트는 PowerShell 파이프에서 깨질 수 있으므로, CLI 테스트 시에는 UTF-8 인코딩을 먼저 지정합니다.

```powershell
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
Get-Content -Raw -Encoding UTF8 path\to\prompt.txt | codex exec --skip-git-repo-check --color never -m gpt-5.4-mini --sandbox danger-full-access -
```

API 키는 프롬프트나 파일에 직접 적지 않고, `TYPECAST_API_KEY` 환경변수로만 사용합니다.

## P00. CLI 실행 테스트

```text
Respond exactly with: CODEX_CLASS_TEST_OK
```

검증 결과: `CODEX_CLASS_TEST_OK` 출력 확인.

## P01. 작업환경 세팅

```text
Codex에서 AI 쇼츠 제작용 작업환경을 세팅해줘.

너는 지금 수강생 컴퓨터의 새 실습 폴더에서 실행 중이라고 가정해.
현재 폴더 바깥은 건드리지 말고, 현재 폴더 안에만 필요한 파일을 만들어줘.

중요:
- 이번 단계는 환경 세팅까지만 한다.
- Typecast API를 실제로 호출하지 마.
- mp4 렌더링도 하지 마.
- npm install과 타입 체크까지만 확인해줘.
- API 키를 출력하거나 파일에 하드코딩하지 마.
- 문서와 샘플 데이터는 인코딩 문제를 피하기 위해 영어/ASCII 위주로 작성해줘.
- .env.example에는 TYPECAST_API_KEY=your_typecast_api_key_here 형태의 예시만 넣어줘.

해야 할 일:
1. Remotion 기반 프로젝트를 현재 폴더에 세팅해줘.
2. Typecast API 키는 TYPECAST_API_KEY 환경변수로만 읽도록 TTS 스크립트를 만들어줘.
3. 이미지 생성형 쇼츠와 Remotion 그래픽형 쇼츠를 모두 처리할 수 있는 폴더 구조를 만들어줘.
4. package.json scripts, TypeScript 설정, 샘플 storyboard JSON, Remotion composition, TTS helper script를 만들어줘.
5. 마지막에 npm install과 타입 체크를 실행해서 세팅이 정상인지 확인해줘.
```

검증 결과: `codex-shorts-student-test-v2`에서 `npm install`, `npm run typecheck`, Remotion still 렌더 확인.

## P02. 이미지 생성형 쇼츠 자료조사 및 기획

```text
역사의 흥미로운 사실이나 야사 중에서 쇼츠로 만들기 좋은 주제를 웹으로 조사해서 하나 골라줘.

아직 이미지 생성, 파일 생성, 영상 렌더링은 하지 마.
먼저 기획안만 한국어 표로 정리해줘.

조건:
- 45~60초 안에 설명할 수 있는 주제로 골라줘.
- 너무 유명해서 식상한 내용보다, 처음 들으면 "어?" 싶은 소재를 골라줘.
- 사실과 야사가 섞여 있다면 어디까지가 확인된 사실이고 어디부터가 전승/해석인지 구분해줘.
- 마지막 장면은 짧고 기억에 남는 문장으로 끝나게 해줘.
- 대본문장은 실제 TTS로 읽을 문장 기준으로 자연스럽게 써줘.
- 문장을 자막 단위로 미리 쪼개지 말고, 씬마다 완성된 문장으로 써줘.

표에는 다음 열을 넣어줘.
- 장면번호
- 장면묘사
- 실제 대본문장
- 예상 시간초
- 이미지 생성 프롬프트

장면묘사는 이미지로 만들 수 있을 만큼 구체적으로 써줘.
이미지 생성 프롬프트는 각 장면이 같은 스타일로 이어지도록, 공통 스타일 키워드를 반복해서 넣어줘.

표 아래에는 다음을 짧게 정리해줘.
- 선택한 소재 요약
- 참고한 출처 2~3개
- 왜 쇼츠에 적합한지
- 아직 검증이 필요한 표현

내가 승인하면 그다음 단계로 넘어갈게.
```

검증 결과: CLI가 웹 검색을 사용했고, `1518년 스트라스부르의 춤 광란` 소재로 5씬 표 스토리보드와 출처를 생성.

## P03. 대본/자막 청크 검수 웹 UI 만들기

```text
P02에서 만든 이미지 생성형 쇼츠 기획안을 바탕으로, 대본과 자막 청크를 사람이 검수할 수 있는 로컬 웹 UI를 만들어줘.

중요:
- 아직 이미지 생성, Typecast TTS 호출, 영상 렌더링은 하지 마.
- 이번 단계는 "검수 UI + 저장 가능한 JSON"까지만 만든다.
- API 키를 출력하거나 파일에 하드코딩하지 마.
- 현재 폴더 안에서만 작업해줘.
- 기존 Remotion/Typecast starter 구조를 유지해줘.

먼저 P02 기획 결과를 확인해줘.
P02 결과 파일이 있다면 그 파일을 읽고, 없다면 내가 방금 승인한 표 내용을 기준으로 진행해.

해야 할 일:
1. 이미지형 쇼츠 storyboard JSON을 만들어줘.
   - 저장 위치: storyboards/image-dancing-plague.storyboard.json
   - 1080x1920, 30fps 기준
   - 각 씬에는 id, type, durationSeconds, headline, caption, narration, imagePrompt, subtitleChunks를 포함해줘.

2. subtitleChunks는 처음부터 자연스럽게 나눠줘.
   - chunk를 이어 붙이면 narration과 정확히 같아야 한다.
   - 중복/누락 금지.
   - 한 chunk는 보통 2~5어절까지 허용한다.
   - 복합 서술어, 부정 표현, 관형어+명사는 되도록 같은 chunk에 둔다.
   - 좋은 예: "멈추지 못한 채"
   - 나쁜 예: "멈추지" / "못한 채"
   - 좋은 예: "더 깊은 혼란 속으로"
   - 나쁜 예: "더 깊은" / "혼란 속으로"
   - "말이 안 되는 것 같죠" 같은 문장은 의미 단위가 살아야 하며, "말이 안되는" / "것 같죠"처럼 어색하게 나누지 마.

3. 브라우저에서 자막 청크를 수동으로 수정할 수 있는 로컬 웹 UI를 만들어줘.
   - 저장 위치 예시: tools/caption-review-server.mjs, tools/caption-review.html
   - UI에서 씬별 narration 전체 문장과 subtitleChunks를 볼 수 있어야 해.
   - chunks 텍스트, 시작초, 종료초를 수정할 수 있어야 해.
   - 씬별 durationSeconds도 수정할 수 있어야 해.
   - 저장 버튼을 누르면 storyboard JSON에 반영되게 해줘.
   - 각 씬마다 "청크를 이어 붙인 문장"을 보여줘.
   - narration과 chunk 연결문이 다르면 경고를 보여줘.
   - 중복 단어가 의심되거나 시간이 겹치면 경고를 보여줘.
   - 렌더 버튼 자리는 만들어도 되지만, 이번 단계에서는 렌더 실행까지 하지 마.

4. package.json에 UI 실행 스크립트를 추가해줘.
   - 예: "caption:review": "node tools/caption-review-server.mjs"

5. 구현 후 검증해줘.
   - JSON 파싱
   - npm run typecheck
   - 모든 scene에서 subtitleChunks를 이어 붙인 문장이 narration과 정확히 같은지 확인

마지막 응답에는 다음만 정리해줘.
- 만든 파일
- 실행 방법
- 자막 청크 검수 기준
- 검증 결과
```

검증 결과: `caption:review` 서버, 저장 가능한 검수 UI, 자막 청크 검증 패널, `image-dancing-plague.storyboard.json` 생성 확인. 자막 청크는 문법 단위 기준으로 재조정 완료.

## P04. 이미지 생성용 에셋 대기열 만들기

```text
검수 완료된 storyboard JSON을 바탕으로 이미지 생성용 에셋 대기열을 만들어줘.

중요:
- 아직 실제 이미지 생성은 하지 마.
- Typecast TTS 호출도 하지 마.
- 영상 렌더링도 하지 마.
- 현재 폴더 안에서만 작업해줘.
- API 키를 출력하거나 파일에 하드코딩하지 마.
- 한글 JSON은 PowerShell Get-Content로 읽지 말고, 반드시 Node.js fs.readFileSync(..., "utf8") + JSON.parse로 읽어줘.

입력 파일:
- storyboards/image-dancing-plague.storyboard.json

해야 할 일:
1. 각 scene의 imagePrompt를 이미지 생성 도구에 바로 넣을 수 있도록 정리해줘.
2. 장면별 이미지 파일명을 확정해줘.
   - 저장 예정 위치: public/images/image-dancing-plague/
   - 파일명 예시: 01-strasbourg-hook.png
3. 다음 파일을 만들어줘.
   - assets/image-dancing-plague/image-prompts.json
   - assets/image-dancing-plague/image-prompts.md
4. image-prompts.json에는 다음 정보를 포함해줘.
   - projectName
   - outputDir
   - styleGuide
   - images 배열
     - sceneId
     - sceneNumber
     - narration
     - outputFile
     - prompt
     - negativePrompt
5. image-prompts.md에는 수업 중 사람이 보기 쉽게 장면별 프롬프트를 정리해줘.
6. storyboard JSON에도 각 scene.image.source가 확정 파일명으로 들어가게 업데이트해줘.
   - image.enabled는 false로 둬. 실제 이미지 파일이 아직 없기 때문이야.
   - source는 images/image-dancing-plague/01-strasbourg-hook.png 같은 Remotion staticFile 기준 경로로 써줘.

검증:
- Node.js로 storyboard JSON과 image-prompts.json을 파싱해줘.
- storyboard의 scene 수와 image-prompts.json의 images 수가 같은지 확인해줘.
- image-prompts.json과 image-prompts.md 안에 깨진 문자열 패턴이 없는지 확인해줘.
  - 세 개의 물음표 연속, U+FFFD replacement character, 또는 한글이 깨질 때 자주 나오는 CJK/Hangul mojibake marker가 있으면 실패로 봐.
- npm run typecheck

마지막 응답에는 만든 파일, 이미지 저장 예정 경로, 검증 결과만 정리해줘.
```

검증 결과: 이미지 prompt manifest 생성, storyboard image source 연결, 한글 깨짐 패턴 검사, `npm run typecheck` 통과.

## P05. 이미지 생성 후 Typecast + Remotion 렌더

먼저 P04의 `assets/image-dancing-plague/image-prompts.json`을 기준으로 각 장면 이미지를 생성해 `public/images/image-dancing-plague/`에 저장합니다.

Codex 앱에서 이미지 생성 기능을 사용할 수 있다면 다음처럼 요청합니다.

```text
assets/image-dancing-plague/image-prompts.json을 읽고, images 배열의 prompt를 장면별로 하나씩 이미지 생성해줘.

중요:
- 실제 생성된 이미지는 public/images/image-dancing-plague/에 outputFile 이름 그대로 저장해줘.
- 원본 생성 파일은 남겨도 되지만, Remotion에서 참조하는 최종 파일은 반드시 public/images/image-dancing-plague/ 안에 있어야 해.
- 이미지에는 글자, 워터마크, 현대 물건이 들어가면 안 돼.
- 각 장면은 같은 역사 다큐멘터리 일러스트 톤으로 이어져야 해.
- 자막을 올릴 수 있도록 이미지 상단에 하늘/건물/여백이 어느 정도 있어야 해.
```

이미지 5장이 준비되면 아래 프롬프트를 넣습니다.

```text
검수된 이미지형 쇼츠 storyboard와 생성된 이미지 파일을 사용해서 실제 Remotion 쇼츠 영상을 만들어줘.

중요:
- 현재 폴더 안에서만 작업해줘.
- API 키를 출력하거나 파일에 하드코딩하지 마.
- TYPECAST_API_KEY 환경변수는 이미 설정되어 있다고 가정하고, 값은 절대 출력하지 마.
- 실제 Typecast TTS 호출은 이번 단계에서 해도 된다.
- 실제 Remotion 렌더링도 이번 단계에서 해도 된다.

입력:
- storyboard: storyboards/image-dancing-plague.storyboard.json
- 이미지 폴더: public/images/image-dancing-plague/
- Typecast voice id: 수업 중 선택한 voice id
- Typecast model: ssfm-v30

해야 할 일:
1. storyboard를 업데이트해줘.
   - voiceId를 선택한 Typecast voice id로 설정
   - language는 Korean TTS에 맞게 설정
   - 모든 image scene의 image.enabled를 true로 설정
   - public/images/image-dancing-plague/ 안의 5개 이미지 파일이 실제 존재하는지 확인

2. Typecast TTS를 생성해줘.
   - scripts/generate-tts.ts를 활용해도 된다.
   - 출력 위치는 public/audio/image-dancing-plague/
   - storyboard에 audio.enabled=true와 audio.source가 연결되게 해줘.
   - 생성 후 각 scene별 metadata JSON도 보존해줘.
   - TTS 결과의 audioDuration이 storyboard durationSeconds와 많이 다르면, durationSeconds를 audioDuration에 맞춰 업데이트해줘.
   - 기존 subtitleChunks는 의미 단위를 유지하되, 전체 길이가 바뀌면 각 chunk start/end를 비율로 보정해줘.

3. Remotion composition을 실제 이미지형 쇼츠용으로 개선해줘.
   - 새 composition id를 만들어줘.
   - 화면은 1080x1920, 30fps.
   - 상단 헤더, 하단 푸터, 큰 박스형 카드 UI는 제거해줘.
   - 이미지는 풀스크린 또는 거의 풀스크린으로 보여줘.
   - 이미지 위쪽 여백/하늘/건물 부분에 자막이 올라가야 해.
   - 자막은 scene.caption 전체가 아니라 subtitleChunks를 현재 frame에 맞춰 2~5어절 단위로 보여줘.
   - 자막은 화면 중앙보다 약간 위쪽 또는 이미지 상단 여백에 배치해줘.
   - 짧은 fade/scale/pan 애니메이션을 넣어 지루하지 않게 해줘.
   - 텍스트가 너무 작지 않게 하고, 모바일 숏폼에서 바로 읽히게 해줘.
   - 둥근 모서리 카드, 좌측 색상띠, 설명용 헤더/푸터 같은 UI는 넣지 마.

4. 렌더링해줘.
   - 먼저 still 하나를 렌더해서 이미지와 자막이 나오는지 확인
   - 최종 mp4 출력: out/image-dancing-plague-short.mp4

검증:
- npm run typecheck
- storyboard JSON 파싱
- 이미지 5개 존재 확인
- 오디오 5개 존재 확인
- Remotion still 렌더 성공
- mp4 렌더 성공

마지막 응답에는 만든/수정한 파일, 출력 mp4 경로, 검증 결과만 정리해줘.
```

검증 결과: 이미지 5장 생성 및 복사, Typecast TTS 5개 생성, `ImageDancingPlagueShort` composition 생성, still/mp4 렌더 성공. 최종 영상 길이 약 31초.

## P06. 그래픽형 쇼츠 자료조사 및 기획

```text
수학, 과학, 기하학, 좌표, 그래프, 물리 현상 중에서 그래픽형 쇼츠로 만들기 좋은 흥미로운 지식 주제를 웹으로 조사해서 하나 골라줘.

아직 파일 생성, 영상 렌더링, TTS 호출은 하지 마.
먼저 기획안만 한국어 표로 정리해줘.

조건:
- 30~45초 안에 설명할 수 있는 주제로 골라줘.
- "뭔가 수학 그래픽 같은 느낌"이 아니라, 실제로 흥미로운 지식 하나를 설명해야 해.
- 너무 교과서적인 공식 설명보다, 처음 보면 직관과 달라서 궁금해지는 소재를 골라줘.
- 그래픽으로 보여줄 수 있어야 해. 예: 점, 선, 원, 궤적, 파동, 좌표축, 면적, 확대/축소, 비교 애니메이션.
- 실제 대본문장은 TTS로 읽을 자연스러운 한국어 문장으로 써줘.
- 문장을 자막 단위로 미리 쪼개지 말고, 씬마다 완성된 문장으로 써줘.
- 마지막 장면은 짧고 기억에 남는 결론으로 끝내줘.

표에는 다음 열을 넣어줘.
- 장면번호
- 그래픽 장면묘사
- 실제 대본문장
- 예상 시간초
- 그래픽 구현 힌트

그래픽 장면묘사는 Remotion으로 구현할 수 있을 만큼 구체적으로 써줘.
예를 들어 "원 하나"가 아니라, "좌표평면 위에 반지름이 커지는 원, 접선, 이동하는 점, 면적 하이라이트"처럼 써줘.

표 아래에는 다음을 짧게 정리해줘.
- 선택한 소재 요약
- 참고한 출처 2~3개
- 왜 그래픽형 쇼츠에 적합한지
- 정확성을 위해 조심해야 할 표현

내가 승인하면 그다음 단계로 넘어갈게.
```

검증 결과: CLI가 웹 검색을 사용했고, `사이클로이드의 두 가지 반직관적 성질`을 5씬 그래픽 쇼츠로 기획.

## P07. 그래픽형 storyboard와 자막 검수 UI 만들기

```text
P06에서 승인한 그래픽형 쇼츠 기획안을 바탕으로, 그래픽형 storyboard JSON과 자막 청크 검수 웹 UI를 만들어줘.

중요:
- 아직 Typecast TTS 호출과 영상 렌더링은 하지 마.
- 이번 단계는 "검수 가능한 storyboard JSON + 저장 가능한 웹 UI"까지만 만든다.
- 현재 폴더 안에서만 작업해줘.
- API 키를 출력하거나 파일에 하드코딩하지 마.
- 한글 JSON은 PowerShell Get-Content에 의존하지 말고, Node.js fs.readFileSync(..., "utf8") + JSON.parse로 검증해줘.

해야 할 일:
1. 그래픽형 쇼츠 storyboard JSON을 만들어줘.
   - 저장 위치: storyboards/graphics-cycloid.storyboard.json
   - 1080x1920, 30fps 기준
   - 각 씬에는 id, type, durationSeconds, headline, caption, narration, subtitleChunks, graphics 구현 힌트를 포함해줘.
   - type은 graphics로 설정해줘.

2. subtitleChunks를 자연스러운 의미 단위로 나눠줘.
   - 모든 subtitleChunks.text의 앞뒤 공백은 없어야 한다.
   - 검증할 때는 chunks를 " "로 이어 붙이고, 여러 공백을 하나로 정규화한 뒤 narration과 비교해.
   - 중복/누락 금지.
   - 한 chunk는 보통 2~5어절까지 허용한다.
   - 복합 서술어, 부정 표현, 관형어+명사는 되도록 같은 chunk에 둔다.
   - 좋은 예: "가장 짧은 길이 아니라"
   - 나쁜 예: "가장 짧은 길이" / "아니라"
   - 좋은 예: "말이 안 되는 것 같죠."
   - 나쁜 예: "말이 안 되는" / "것 같죠."

3. 기존 caption review UI를 그래픽형 storyboard에도 쓸 수 있게 해줘.
   - 실행 스크립트 예: "caption:review:graphics"
   - UI에서 scene별 narration, subtitleChunks, durationSeconds를 수정할 수 있어야 해.
   - 저장 버튼을 누르면 storyboards/graphics-cycloid.storyboard.json에 반영되게 해줘.
   - 각 씬마다 "청크를 이어 붙인 문장"을 보여줘.
   - narration과 chunk 연결문이 다르면 경고를 보여줘.
   - 시간 겹침, 빈 chunk, 선행/후행 공백을 경고해줘.

4. 사람이 보기 쉬운 설명 파일도 만들어줘.
   - 저장 위치: assets/graphics-cycloid/graphics-storyboard.md
   - 각 씬의 그래픽 장면, 대본, 자막 청크, 구현 힌트를 정리해줘.

검증:
- JSON 파싱
- 모든 subtitleChunks.text에 선행/후행 공백이 없는지 확인
- 모든 scene에서 normalize(chunks.join(" ")) === normalize(narration)인지 확인
- 깨진 문자열 패턴이 없는지 확인: 세 개의 물음표 연속, U+FFFD replacement character, CJK/Hangul mojibake marker.
- npm run typecheck

마지막 응답에는 만든 파일, 실행 방법, 검증 결과만 정리해줘.
```

검증 결과: `graphics-cycloid.storyboard.json`, `caption:review:graphics`, `graphics-storyboard.md` 생성. 청크 선행 공백 문제를 발견해 최종 프롬프트에 예방 규칙을 추가.

## P08. 그래픽형 Typecast + Remotion 렌더

```text
검수된 그래픽형 storyboard를 사용해서 실제 Remotion 그래픽 쇼츠 영상을 만들어줘.

중요:
- 현재 폴더 안에서만 작업해줘.
- API 키를 출력하거나 파일에 하드코딩하지 마.
- TYPECAST_API_KEY 환경변수는 이미 설정되어 있다고 가정하고, 값은 절대 출력하지 마.
- 실제 Typecast TTS 호출은 이번 단계에서 해도 된다.
- 실제 Remotion 렌더링도 이번 단계에서 해도 된다.
- 이미지 생성은 하지 않는다. 이 영상은 텍스트와 코드 기반 그래픽만으로 만든다.

입력:
- storyboard: storyboards/graphics-cycloid.storyboard.json
- Typecast voice id: 수업 중 선택한 voice id
- Typecast model: ssfm-v30

해야 할 일:
1. storyboard를 업데이트해줘.
   - voiceId를 선택한 Typecast voice id로 설정
   - language는 Korean TTS에 맞게 설정

2. Typecast TTS를 생성해줘.
   - scripts/generate-tts.ts를 활용해도 된다.
   - 출력 위치는 public/audio/graphics-cycloid/
   - storyboard에 audio.enabled=true와 audio.source가 연결되게 해줘.
   - 생성 후 각 scene별 metadata JSON도 보존해줘.
   - TTS 결과의 audioDuration이 storyboard durationSeconds와 많이 다르면, durationSeconds를 audioDuration에 맞춰 업데이트해줘.
   - subtitleChunks는 의미 단위를 유지하되, 전체 길이가 바뀌면 각 chunk start/end를 비율로 보정해줘.
   - 보정 후에도 normalize(chunks.join(" ")) === normalize(narration)이 유지되어야 한다.
   - 문장부호도 빠뜨리지 마. narration에 마침표나 쉼표가 있으면 해당 subtitleChunks에도 반영해줘.

3. Remotion composition을 만들어줘.
   - 새 composition id: GraphicsCycloidShort
   - 화면은 1080x1920, 30fps.
   - 중앙에는 수학 그래픽이 크게 보여야 한다.
   - 자막은 그래픽 아래쪽에 subtitleChunks를 현재 frame에 맞춰 보여줘.
   - 자막은 2~5어절 단위로 큼직하게, 모바일에서 바로 읽히게 해줘.
   - 상단 헤더, 하단 푸터, step 번호, 글머리 기호, 설명용 카드 UI는 넣지 마.
   - 둥근 모서리 박스와 좌측 색상띠 같은 안티패턴은 넣지 마.
   - 배경은 어둡지만 단조롭지 않게, 좌표 격자/얇은 선/빛나는 점/궤적을 활용해줘.

4. 장면별 그래픽 구현:
   - Scene 1: 직선, 완만한 원호, 사이클로이드 3개 경로 위에서 점들이 동시에 출발하고 사이클로이드 점이 먼저 도착.
   - Scene 2: 길이와 시간의 차이를 막대/타이머/경로 비교로 보여주되 텍스트 설명보다 시각 비교가 중심.
   - Scene 3: 구르는 원과 원둘레 점이 남기는 사이클로이드 궤적.
   - Scene 4: 뒤집힌 사이클로이드 위 서로 다른 출발점의 구슬 3개가 같은 도착점에 동시에 도착.
   - Scene 5: 사이클로이드 곡선과 핵심 결론을 강하게 마무리.

5. 렌더링해줘.
   - 먼저 still 하나를 렌더해서 그래픽과 자막이 나오는지 확인
   - 최종 mp4 출력: out/graphics-cycloid-short.mp4

검증:
- npm run typecheck
- storyboard JSON 파싱
- 모든 scene에서 normalize(chunks.join(" ")) === normalize(narration) 확인
- 오디오 5개 존재 확인
- Remotion still 렌더 성공
- mp4 렌더 성공

마지막 응답에는 만든/수정한 파일, 출력 mp4 경로, 검증 결과만 정리해줘.
```

검증 결과: Typecast TTS 5개 생성, `GraphicsCycloidShort` composition 생성, still/mp4 렌더 성공. 최종 영상 길이 약 35.69초.

## P09. 최종 품질 점검

```text
완성된 쇼츠 결과물을 수업용 데모 기준으로 품질 점검해줘.

중요:
- 이번 단계는 검수와 개선 제안만 한다.
- 파일을 수정하거나 다시 렌더링하지 마.
- API 키를 출력하거나 파일에서 찾으려고 하지 마.
- 현재 폴더 안의 결과물만 확인해줘.

검수 대상:
- 이미지 생성형 쇼츠: out/image-dancing-plague-short.mp4
- 그래픽형 쇼츠: out/graphics-cycloid-short.mp4
- 관련 storyboard:
  - storyboards/image-dancing-plague.storyboard.json
  - storyboards/graphics-cycloid.storyboard.json

해야 할 일:
1. 두 mp4 파일이 존재하는지 확인하고, 가능하면 ffprobe 등으로 길이를 확인해줘.
2. 두 storyboard JSON을 Node.js fs.readFileSync(..., "utf8") + JSON.parse로 파싱해줘.
3. 각 storyboard에서 다음을 점검해줘.
   - scene 수
   - narration과 subtitleChunks를 공백 기준으로 이어 붙였을 때 의미가 깨지지 않는지
   - "말이 안되는 / 것 같죠"처럼 어색한 청크 분할이 있는지
   - audio.source가 연결되어 있는지
   - durationSeconds와 subtitleChunks endSeconds가 크게 어긋나지 않는지
4. Remotion composition이 등록되어 있는지 확인해줘.
   - ImageDancingPlagueShort
   - GraphicsCycloidShort
5. 수업용 데모 관점에서 최종 판정을 내려줘.
   - 그대로 사용 가능
   - 수업 전 가볍게 수정 권장
   - 다시 생성 권장

출력:
- course-prompts/tests/p09-quality-audit.v1.result.md 파일에 검수 결과를 한국어로 저장해줘.
- 마지막 응답에는 최종 판정과 핵심 이슈만 짧게 말해줘.
```

검증 결과: 두 영상 모두 사용 가능. 그래픽형 자막 문장부호 누락을 발견해 보정 후 재렌더 완료.

## P10. 수업 운영 체크

```text
지금까지 만든 쇼츠 자동화 실습 폴더를 수업 전 최종 점검해줘.

중요:
- API 키를 출력하거나 파일에 하드코딩하지 마.
- node_modules는 검사 대상에서 제외해줘.
- 파일을 대규모로 수정하지 말고, 문제 발견 시 보고 먼저 해줘.

점검할 것:
1. course-prompts/student-prompts.md에 P00부터 P09까지 수업용 프롬프트가 순서대로 정리되어 있는지 확인해줘.
2. 결과 영상이 존재하는지 확인해줘.
   - out/image-dancing-plague-short.mp4
   - out/graphics-cycloid-short.mp4
3. npm run typecheck를 실행해줘.
4. 다음 파일들의 한글 깨짐 패턴을 검사해줘.
   - course-prompts/student-prompts.md
   - storyboards/image-dancing-plague.storyboard.json
   - storyboards/graphics-cycloid.storyboard.json
   - assets/image-dancing-plague/image-prompts.json
   - assets/graphics-cycloid/graphics-storyboard.md
   - 깨짐 패턴: 세 개의 물음표 연속, U+FFFD replacement character, CJK/Hangul mojibake marker
5. 실제 API 키가 파일에 저장되어 있지 않은지 확인해줘.
   - node_modules 제외
   - .env.example의 placeholder는 허용
6. CLI 수업 안내 메모를 확인해줘.
   - Codex CLI도 웹조사는 가능하지만 `--search` 옵션을 붙이는 방식은 아니다.
   - 프롬프트에 "웹조사하고 출처를 확인해줘"라고 지시한다.
   - 긴 한글 프롬프트는 UTF-8 파이프 설정을 사용한다.

마지막 응답에는 통과/주의/수정 필요 항목만 짧게 정리해줘.
```

운영 메모: Codex CLI 사용량 제한이 걸릴 수 있으므로, 수업 중에는 데스크톱 Codex에서 이어서 검수하는 대안을 함께 안내한다.

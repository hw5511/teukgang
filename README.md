# teukgang (특강)

특강·실습용 프로젝트 백업 모노레포. 개별 레포로 흩어져 있던 결과물을 한곳에 모았다.

## 게임·영상 프로젝트

- `metal-slug-game/` — 메탈슬러그 스타일 횡스크롤 런앤건 게임 'Iron Rescue'. 순수 HTML5 Canvas + Vanilla JS. (구 hw5511/iron-rescue, 통합)
- `remotion-typecast-video/` — Remotion 기반 영상 합성 프로젝트(React). Typecast TTS 연동.

## 특강 원본 자료

- `쇼츠특강/` — 'Codex로 AI 쇼츠 자동화' 특강 실습 세트. Remotion + Typecast 스타터, 순서별 프롬프트(`course-prompts/`), 스토리보드, 샘플 결과 영상(`out/`) 포함. 첫 진입: `강의자료_안내.md`.
- `웹게임강의/` — 'Codex로 나만의 웹 게임 만들기' 1시간 실습 워크숍 원본 기록. 슬라이드 덱 소스(`codex-webgame-workshop.html`) + 게임 데모(`index.html`/`script.js`/`style.css`). 첫 진입: `README.md`.

## GitHub Pages 배포 (라이브: https://hw5511.github.io/teukgang/)

`.github/workflows/webgame-pages.yml`이 아래 폴더를 조립해 배포한다.

- `pages-root/` — 두 슬라이드로 연결하는 허브 랜딩 페이지(사이트 루트).
- `webgame-workshop-pages/` — Codex 웹게임 특강 배포용 슬라이드 덱(`웹게임강의`의 배포 번들).
- `shorts-workshop/` — Codex 쇼츠 특강 배포용 슬라이드 덱(`쇼츠특강`의 배포 번들). ⚠️ `standalone.html`(약 22MB)은 배포 아티팩트에서 제외됨.

## 비고

- 각 하위 프로젝트의 기존 개별 git 이력은 정리하고 이 모노레포로 통합 관리한다.
- node_modules 등 빌드 산출물은 `.gitignore` 처리.
- `쇼츠특강`↔`shorts-workshop`, `웹게임강의`↔`webgame-workshop-pages`는 각각 원본 자료 ↔ Pages 배포 번들 대응 관계다.

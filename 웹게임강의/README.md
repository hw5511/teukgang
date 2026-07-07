# Codex 웹게임 특강 기록

## 특강 개요

- 제목: Codex로 나만의 웹 게임 만들기
- 대상:
  - Codex를 처음 써보는 사람
  - AI로 게임 만들기에 흥미가 있는 사람
  - 코딩 경험이 많지 않아도 웹 결과물을 만들어보고 싶은 사람
- 시간: 1시간
- 목표:
  - Codex와 대화하며 브라우저에서 실행되는 2D 웹 게임을 만든다.
  - AI 생성 에셋을 게임에 적용한다.
  - 모바일 터치 UI를 추가한다.
  - Cloudflare Pages로 공유 가능한 URL까지 배포한다.

## 최종 수업 흐름

| 순서 | 단계 | 진행 내용 | 핵심 프롬프트/포인트 |
|---:|---|---|---|
| 1 | Codex 설치 및 실행 | Codex 설치 후 GPT 계정으로 로그인 | Codex 앱 실행, 작업 폴더 열기 |
| 2 | 게임 콘셉트 정하기 | 만들고 싶은 2D 게임의 장르, 캐릭터, 목표 정하기 | "슈퍼마리오 느낌의 귀여운 2D 게임을 만들고 싶어" |
| 3 | 첫 게임 만들기 | HTML/CSS/JS 기반 게임 생성 | "HTML/CSS/JS로 만들어줘" |
| 4 | 로컬 테스트 | Codex가 실행한 로컬 주소에서 게임 확인 | 브라우저에서 플레이하며 문제 찾기 |
| 5 | 에셋 만들기 | 캐릭터, 적, 아이템, 배경 생성 | "배경을 투명화할 수 있게 PNG 에셋을 만들어줘" |
| 6 | 완성도 높이기 | 점수, 체력, 난이도, 피드백, UI 개선 | "게임 완성도를 높여줘" |
| 7 | 모바일 반응형 | 터치 버튼, 화면 크기 대응 추가 | "모바일에서도 플레이 가능한 터치 UI를 추가해줘" |
| 8 | Cloudflare 가입 | 수강생이 Cloudflare 계정 생성 및 로그인 | `cloudflare.com` 가입 시간 명시 |
| 9 | Wrangler 로그인 | Codex가 Wrangler 로그인 실행, 수강생이 브라우저에서 승인 | "wrangler cli를 설치하고 wrangler login을 실행해줘. 내가 로그인할게" |
| 10 | Pages 배포 | Codex가 Cloudflare Pages로 배포 | "인증되면 바로 Pages로 배포해줘" |
| 11 | 결과 확인 | `pages.dev` 링크로 접속 및 공유 | 모바일에서도 접속 확인 |

## 배포 방식 결정

최종 수업 배포 방식은 Cloudflare Pages + Wrangler CLI로 결정했다.

선택 이유:

- `npx -y wrangler login` 실행 시 브라우저 OAuth 창이 바로 열려 수강생이 직접 승인하기 쉽다.
- GitHub 레포 생성, commit, push, GitHub Pages 설정을 설명하지 않아도 된다.
- 정적 HTML/CSS/JS 게임을 바로 `*.pages.dev` URL로 배포할 수 있다.
- 1시간 수업에서 인증과 배포 흐름이 가장 짧다.

비교 결과:

| 방식 | 판단 |
|---|---|
| GitHub CLI + GitHub Pages | 가능하지만 로그인 인증 코드 확인, repo 생성, push, Pages 설정까지 초보자에게 단계가 많다. |
| Vercel | 배포는 쉬우나 수업 중 OAuth/프로젝트 연결 설명이 조금 늘어난다. 테스트 배포 후 삭제했다. |
| Netlify | 배포 가능하지만 CLI/계정 컨텍스트가 수업용으로 덜 단순했다. 테스트 배포 후 삭제했다. |
| Cloudflare Tunnel | 임시 공유에는 좋지만 최종 배포 URL을 만드는 수업 목표와는 다르다. |
| Cloudflare Pages | 최종 선택. 브라우저 로그인 후 Wrangler로 바로 배포 가능하다. |

## 테스트된 결과물

- 게임 테스트 배포: https://codex-iron-rescue.pages.dev
- 로컬 게임 프로젝트: `C:\Users\yangh\woohee_dev\metal-slug-game`
- HTML 발표자료 초안: `C:\Users\yangh\woohee_dev\workshop-slides\index.html`
- 현재 기록 폴더: `C:\Users\yangh\woohee_dev\teukgang\웹게임강의`

삭제한 테스트 배포:

- Vercel: `https://metal-slug-game.vercel.app` 삭제 확인
- Netlify: `https://iron-rescue-codex.netlify.app` 삭제 확인

## 수업 진행 멘트 예시

Cloudflare 가입 전:

```text
이제 만든 게임을 웹에 배포하기 위해 Cloudflare 계정이 필요합니다.
아직 계정이 없는 분은 cloudflare.com에 가입하고 로그인까지 완료해주세요.
그다음 Codex에게 "wrangler cli를 설치하고 wrangler login을 실행해줘"라고 요청하면,
브라우저 인증창이 열리고 여러분이 직접 승인하면 됩니다.
```

Wrangler 로그인 요청:

```text
wrangler cli를 설치해줘.
그다음 wrangler login을 실행해줘.
브라우저가 열리면 내가 직접 Cloudflare 로그인을 승인할게.
인증이 완료되면 이 게임을 Cloudflare Pages로 배포해줘.
```

## 참고 문서

- [프롬프트 모음](./프롬프트_모음.md)
- [배포 및 인증 실험 기록](./배포_인증_실험기록.md)
- [포스터 및 발표자료 메모](./포스터_발표자료_메모.md)

<p align="center">
  <img src="src/resource/start/background.jpg" alt="Impact Design Canvas" width="600"/>
</p>

<h1 align="center">Impact Design Canvas</h1>

<p align="center">
  <strong>조직의 성과관리를 위한 AI 교육 시스템</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19"/>
  <img src="https://img.shields.io/badge/Chart.js-4.5-FF6384?logo=chartdotjs&logoColor=white" alt="Chart.js"/>
  <img src="https://img.shields.io/badge/jsPDF-4.0-red" alt="jsPDF"/>
  <img src="https://img.shields.io/badge/License-Private-gray" alt="License"/>
</p>

---

## 소개

**Impact Design Canvas**는 조직의 성과관리를 위한 AI 교육 시스템입니다.

> **학생** — 6단계 캔버스 과정을 수행하며 성과 설계 역량을 학습합니다.
> **강사** — 수업 생성, 학생 제출물 조회, 벌크 리포트 다운로드 등 수업 전반을 관리합니다.

---

## 학생 워크플로우

```
 ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
 │    A    │───>│    B    │───>│    C    │───>│    D    │───>│    E    │───>│    F    │
 │ Impact  │    │Identity │    │Perform- │    │  Quick  │    │  Build  │    │ Impact  │
 │  Check  │    │ Canvas  │    │ance Flow│    │   Win   │    │   Win   │    │ Review  │
 └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
   자가 진단      비전/미션       실행 흐름       빠른 실행       장기 실행       종합 검토
                   설정            설계            과제            과제
```

---

## 시작하기

### 사전 요구사항

- **Node.js** 18 이상
- **npm** 9 이상
- 백엔드 서버 (기본: `localhost:8080`)

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd id_front

# 의존성 설치
npm install
```

### 실행

```bash
# 개발 서버 시작 (localhost:3000)
npm start

# 프로덕션 빌드
npm run build
```

> 개발 모드에서 `/api` 요청은 자동으로 `localhost:8080`으로 프록시됩니다.

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| **프레임워크** | React 19 (Create React App) |
| **상태 관리** | React Context API |
| **스타일링** | Pure CSS (컴포넌트별 고유 프리픽스) |
| **폰트** | Pretendard (CDN) |
| **인증** | Token 기반 (Access/Refresh Token) |
| **차트** | Chart.js + chartjs-plugin-datalabels |
| **PDF 생성** | jsPDF + html2canvas |
| **파일 처리** | JSZip + file-saver |

---

## 프로젝트 구조

```
src/
├── components/           # 재사용 컴포넌트
│   ├── common/           #   GNB, TipsModal
│   ├── identity/         #   Identity Canvas 관련
│   └── teacher/          #   강사 레이아웃 (Header, Sidebar, Layout)
│
├── screens/              # 화면 컴포넌트
│   ├── Main.js           #   랜딩 페이지
│   ├── MemberLogin.js    #   학생 로그인
│   ├── StartScreen.js    #   시작 화면
│   ├── *Screen.js        #   A~F 단계 워크플로우 화면
│   └── teacher/          #   강사 화면 (Dashboard, List, Detail 등)
│
├── contexts/             # React Context
│   ├── AuthContext.js    #   인증 (토큰 관리, 자동 로그아웃)
│   └── IdentityCanvasContext.js
│
├── services/             # API 서비스 모듈
│   ├── apiConfig.js      #   Base URL, authFetch 래퍼
│   ├── teacherService.js #   강사 API (30+ 엔드포인트)
│   └── *Service.js       #   각 단계별 API 서비스
│
├── utils/                # 유틸리티
└── resource/             # 이미지 리소스
```

> 상세 구조는 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)를 참고하세요.

---

## 아키텍처

### 네비게이션

React Router를 사용하지 않고 **상태 기반 네비게이션**을 사용합니다.

```javascript
// App.js
handleNavigate(screenName, params)
  → setCurrentScreen(screenName)
  → setScreenParams(params)
```

### 인증 흐름

```
로그인 → Token 발급 → sessionStorage 저장
       → authFetch()가 모든 API에 Bearer Token 자동 첨부
       → 401 응답 시 자동 로그아웃
```

### 역할별 화면 분리

- **학생**: `App.js`에서 직접 렌더링
- **강사**: `TeacherLayout` (사이드바 + 헤더) 안에서 렌더링

---

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm start` | 개발 서버 시작 (HMR 지원) |
| `npm run build` | 프로덕션 빌드 (`build/` 폴더) |
| `npm test` | 테스트 실행 |

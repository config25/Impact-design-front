# Impact Design Canvas - 프로젝트 구조

## 개요

**Impact Design Canvas**는 조직의 성과관리를 위한 AI 교육 시스템입니다.
학생이 6단계 캔버스 과정을 수행하고, 강사가 수업/학생/제출물을 관리하는 두 가지 역할 기반 시스템입니다.

| 항목 | 내용 |
|------|------|
| 프레임워크 | React 19 (CRA) |
| 라우팅 | React Router 미사용, 상태 기반 네비게이션 (`currentScreen`) |
| 스타일링 | Pure CSS (BEM-like 프리픽스 방식) |
| 폰트 | Pretendard (CDN) |
| 인증 | Token 기반 (sessionStorage), AuthContext + authFetch |
| 차트 | Chart.js + chartjs-plugin-datalabels |
| PDF/Export | jsPDF, html2canvas, JSZip, file-saver |

---

## 디렉토리 구조

```
id_front/
├── public/                    # 정적 파일
├── src/
│   ├── App.js                 # 메인 앱 - 전체 화면 라우팅 및 상태 관리
│   ├── index.js               # React 엔트리포인트
│   ├── index.css              # 글로벌 스타일 (Pretendard 폰트 등)
│   │
│   ├── components/            # 재사용 컴포넌트
│   │   ├── common/            #   공통 컴포넌트
│   │   │   ├── GNB.js         #     학생용 글로벌 네비게이션 바 (6단계 워크플로우)
│   │   │   └── TipsModal.js   #     팁/안내 모달
│   │   ├── identity/          #   Identity Canvas 관련 컴포넌트
│   │   │   ├── IdentityCanvasLayout.js  #  캔버스 레이아웃
│   │   │   ├── IdentityCard.js          #  개별 카드 컴포넌트
│   │   │   ├── LegacySection.js         #  레거시 섹션
│   │   │   ├── NewIdentitySection.js    #  신규 아이덴티티 섹션
│   │   │   └── ThreatSection.js         #  위협 섹션
│   │   └── teacher/           #   강사 시스템 레이아웃
│   │       ├── TeacherLayout.js   #  사이드바 + 헤더 + 컨텐츠 레이아웃
│   │       ├── TeacherHeader.js   #  상단 헤더 (브레드크럼)
│   │       └── TeacherSidebar.js  #  좌측 사이드바 (접기 토글 지원)
│   │
│   ├── screens/               # 화면 (페이지) 컴포넌트
│   │   ├── Main.js            #   랜딩 페이지 (로그인/회원가입 선택)
│   │   ├── MemberLogin.js     #   학생 로그인
│   │   ├── MemberRegister.js  #   학생 회원가입
│   │   ├── TeachLogin.js      #   강사 로그인
│   │   ├── StartScreen.js     #   시작 화면 (로그인 후 워크플로우 진입)
│   │   │
│   │   │  ── 학생 워크플로우 화면 ──
│   │   ├── ImpactCheckScreen.js       #   A단계: 임팩트 체크
│   │   ├── IdentityCanvasScreen.js    #   B단계: 아이덴티티 캔버스
│   │   ├── PerformanceStreamScreen.js #   C단계: 퍼포먼스 스트림(플로우)
│   │   ├── QuickWinScreen.js          #   D단계: 퀵윈 캔버스
│   │   ├── BuildWinScreen.js          #   E단계: 빌드윈 캔버스
│   │   ├── ImpactReviewScreen.js      #   F단계: 임팩트 리뷰
│   │   ├
│   │   │
│   │   └── teacher/           #   강사 전용 화면
│   │       ├── TeachDashboard.js  #     대시보드 (수업 현황)
│   │       ├── TeachList.js       #     수업 목록
│   │       ├── TeachSave.js       #     수업 생성/수정
│   │       ├── TeachDetail.js     #     수업 상세 (임팩트체크/아이덴티티)
│   │       ├── TeachDetail2.js    #     수업 상세 (퀵윈/빌드윈)
│   │       └── StudentList.js     #     학생 목록 관리
│   │       └── ReportScreen.js    #     리포트 화면 (PDF 출력)
│   │ 
│   ├── contexts/              # React Context
│   │   ├── AuthContext.js     #   인증 상태 관리 (토큰, 로그인/로그아웃)
│   │   └── IdentityCanvasContext.js  #  Identity Canvas 폼 데이터 상태
│   │
│   ├── services/              # API 서비스 모듈
│   │   ├── apiConfig.js       #   API 기본 설정 (BASE URL, authFetch 래퍼)
│   │   ├── authService.js     #   인증 API (로그인, 토큰 갱신)
│   │   ├── gameService.js     #   게임 진행 API (단계 관리)
│   │   ├── impactCheckService.js      #   임팩트 체크 API
│   │   ├── identityCanvasService.js   #   아이덴티티 캔버스 API
│   │   ├── flowCanvasService.js       #   퍼포먼스 플로우 API
│   │   ├── quickWinCanvasService.js   #   퀵윈 캔버스 API
│   │   ├── buildWinCanvasService.js   #   빌드윈 캔버스 API
│   │   ├── fundingService.js          #   펀딩 API
│   │   ├── reportService.js           #   리포트 API
│   │   └── teacherService.js          #   강사 시스템 API (30+ 엔드포인트)
│   │
│   ├── utils/                 # 유틸리티
│   │   └── logoUtil.js        #   이미지/로고 URL 처리
│   │
│   ├── resource/              # 정적 이미지 리소스
│   │   ├── build/             #     빌드윈 관련 이미지
│   │   ├── dev/               #     개발 참고 이미지 (화면 기획서 등)
│   │   ├── flow/              #     퍼포먼스 플로우 이미지
│   │   ├── identity/          #     아이덴티티 캔버스 이미지
│   │   ├── quick/             #     퀵윈 관련 이미지
│   │   ├── report/            #     리포트/PDF 커버 이미지
│   │   ├── start/             #     시작 화면 배경/아이콘
│   │   └── teacher/           #     강사 화면 참고 이미지
│   │
│   └── setupProxy.js          # 개발 프록시 설정 (localhost:8080)
│
├── package.json
└── build/                     # 빌드 결과물
```

---

## 핵심 아키텍처

### 네비게이션 패턴

React Router를 사용하지 않고 `App.js`의 `currentScreen` 상태로 화면을 전환합니다.

```
handleNavigate(screenName, params)  →  setCurrentScreen(screenName)
                                       setScreenParams(params)
```

- 학생 화면: `App.js`에서 직접 렌더링
- 강사 화면: `TeacherLayout`으로 감싸서 사이드바/헤더 포함 렌더링

### 인증 흐름

```
로그인 → accessToken/refreshToken → sessionStorage 저장
       → authFetch()가 모든 API 요청에 Bearer 토큰 자동 첨부
       → 401 응답 시 자동 로그아웃
```

### 학생 워크플로우 (6단계)

| 단계 | 화면 | 설명 |
|------|------|------|
| A | ImpactCheckScreen | 임팩트 체크 - 자가 진단 |
| B | IdentityCanvasScreen | 아이덴티티 캔버스 - 비전/미션 설정 |
| C | PerformanceStreamScreen | 퍼포먼스 스트림 - 실행 흐름 설계 |
| D | QuickWinScreen | 퀵윈 캔버스 - 빠른 실행 과제 |
| E | BuildWinScreen | 빌드윈 캔버스 - 장기 실행 과제 |
| F | ImpactReviewScreen | 임팩트 리뷰 - 종합 검토 |

- GNB 컴포넌트가 6단계를 표시하며, `gameStep`에 따라 활성화/비활성화
- 강사 시스템의 ReportScreen에서 PDF 리포트 출력 가능

### 강사 시스템

| 화면 | 설명 |
|------|------|
| TeachDashboard | 수업 현황 대시보드 |
| TeachList | 수업 목록 조회 |
| TeachSave | 수업 생성/수정 |
| TeachDetail | 수업 상세 - 임팩트체크/아이덴티티 제출 현황 |
| TeachDetail2 | 수업 상세 - 퀵윈/빌드윈 제출 현황 |
| StudentList | 학생 목록 관리 |

---

## 스타일링 규칙

- 각 화면/컴포넌트마다 고유 CSS 프리픽스 사용 (예: `.tl-`, `.td-`, `.sl-`)
- 공통 패턴:
  - 패널: `white bg, border-radius, box-shadow, 컬러 헤딩 (#337ab7)`
  - 테이블: `border-collapse, #f5f5f5 헤더, hover 효과`
  - 버튼: `컬러 배경, opacity 0.85 hover`
  - 모달: `fixed overlay + centered white box`

---

## 주요 의존성

| 패키지 | 용도 |
|--------|------|
| react 19 | UI 프레임워크 |
| chart.js | 차트 렌더링 (리포트 등) |
| chartjs-plugin-datalabels | 차트 데이터 레이블 |
| jspdf | PDF 생성 |
| html2canvas | HTML → 이미지 캡처 |
| jszip | ZIP 파일 생성 (벌크 다운로드) |
| file-saver | 파일 다운로드 |

---

## 개발 환경

```bash
npm start        # 개발 서버 시작 (localhost:3000)
npm run build    # 프로덕션 빌드
```

- 개발 시 `/api` 요청은 `setupProxy.js`를 통해 `localhost:8080`으로 프록시됩니다.

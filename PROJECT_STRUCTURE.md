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
│   │   ├── report/            #   PDF 리포트 페이지별 컴포넌트 (14개)
│   │   │   ├── ReportCover.js           #  표지
│   │   │   ├── ReportAbout.js           #  소개 페이지
│   │   │   ├── ReportContents.js        #  목차
│   │   │   ├── ReportPerformanceProfile.js  #  성과 프로파일 (4사분면)
│   │   │   ├── ReportVoicePage.js       #  Voice 페이지
│   │   │   ├── ReportNewFuture.js       #  New Future 페이지
│   │   │   ├── ReportGoalsTable.js      #  전략목표 테이블
│   │   │   ├── ReportTwoColTable.js     #  2컬럼 테이블 (전술/전략)
│   │   │   ├── ReportWinTable.js        #  Win Canvas 테이블
│   │   │   ├── BulkCanvasPages.js       #  전체 PDF용 캔버스 페이지 (가로 1415x820)
│   │   │   ├── ReportBackCover.js       #  뒤표지
│   │   │   ├── ReportFooter.js          #  페이지 푸터
│   │   │   ├── ReportSectionHeader.js   #  섹션 헤더
│   │   │   └── ReportTopBar.js          #  상단 바
│   │   └── teacher/           #   강사 시스템 레이아웃
│   │       ├── TeacherLayout.js         #  사이드바 + 헤더 + 컨텐츠 레이아웃
│   │       ├── TeacherHeader.js         #  상단 헤더 (브레드크럼)
│   │       ├── TeacherSidebar.js        #  좌측 사이드바 (접기 토글 지원)
│   │       └── TeachDetail2Modals.js    #  TeachDetail2 모달 모음 (분리됨)
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
│   │   ├── QuickWinScreen.js          #   D단계: 퀵윈 캔버스 (WinCanvasScreen 래퍼)
│   │   ├── BuildWinScreen.js          #   E단계: 빌드윈 캔버스 (WinCanvasScreen 래퍼)
│   │   ├── WinCanvasScreen.js         #   D/E 공용: Win Canvas 통합 화면
│   │   ├── ImpactReviewScreen.js      #   F단계: 임팩트 리뷰
│   │   │
│   │   └── teacher/           #   강사 전용 화면
│   │       ├── TeachDashboard.js  #     대시보드 (수업 현황)
│   │       ├── TeachList.js       #     수업 목록
│   │       ├── TeachSave.js       #     수업 생성/수정
│   │       ├── TeachDetail.js     #     수업 상세 (레거시)
│   │       ├── TeachDetail2.js    #     수업 상세 (메인 - 전체 단계 관리)
│   │       ├── StudentList.js     #     학생 목록 관리
│   │       └── ReportScreen.js    #     리포트 화면 (PDF 출력)
│   │
│   ├── hooks/                 # 커스텀 훅
│   │   ├── useTeachDetail2Modals.js  #  TeachDetail2 모달 상태/핸들러
│   │   └── usePdfDownload.js         #  PDF 벌크 다운로드 로직
│   │
│   ├── constants/             # 상수 및 공용 서브컴포넌트
│   │   └── teachDetail2Constants.js  #  평가 문항, 차트 상수, FundingModalBody 등
│   │
│   ├── contexts/              # React Context
│   │   ├── AuthContext.js           #   인증 상태 관리 (토큰, 로그인/로그아웃)
│   │   ├── DashboardContext.js      #   대시보드 전역 상태 (강의실명, 팀명 등)
│   │   └── IdentityCanvasContext.js #   Identity Canvas 폼 데이터 상태
│   │
│   ├── services/              # API 서비스 모듈
│   │   ├── apiConfig.js             #   API 기본 설정 (BASE URL, authFetch 래퍼)
│   │   ├── authService.js           #   인증 API (로그인, 토큰 갱신)
│   │   ├── gameService.js           #   게임 진행 API (단계 관리)
│   │   ├── impactCheckService.js    #   임팩트 체크 API
│   │   ├── identityCanvasService.js #   아이덴티티 캔버스 API
│   │   ├── flowCanvasService.js     #   퍼포먼스 플로우 API
│   │   ├── canvasServiceFactory.js  #   캔버스 서비스 팩토리 (공용 CRUD 생성기)
│   │   ├── winCanvasService.js      #   Win Canvas API (팩토리 기반)
│   │   ├── quickWinCanvasService.js #   퀵윈 캔버스 API (팩토리 기반)
│   │   ├── buildWinCanvasService.js #   빌드윈 캔버스 API (팩토리 기반)
│   │   ├── fundingService.js        #   펀딩/평가 API
│   │   ├── reportService.js         #   리포트 API (개별 + 벌크)
│   │   ├── teachClassService.js     #   강사 - 강의실 관리 API
│   │   ├── teachTeamService.js      #   강사 - 팀 관리 API
│   │   ├── teachSubmissionService.js #  강사 - 제출물 조회 API
│   │   └── teacherService.js        #   (레거시 - 위 3개로 분리됨)
│   │
│   ├── styles/                # 공통 CSS
│   │   └── common.css         #   공유 버튼 스타일 (tips, save, submit)
│   │
│   ├── utils/                 # 유틸리티
│   │   ├── logoUtil.js        #   이미지/로고 URL 처리
│   │   ├── reportUtils.js     #   리포트 계산 로직 (점수, 프로파일 타입)
│   │   └── reportPdfUtils.js  #   PDF 생성 유틸 (html2canvas + jsPDF)
│   │
│   ├── resource/              # 정적 이미지 리소스
│   │   ├── GNB/               #     네비게이션 바 이미지
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
| D | QuickWinScreen → WinCanvasScreen | 퀵윈 캔버스 - 빠른 실행 과제 |
| E | BuildWinScreen → WinCanvasScreen | 빌드윈 캔버스 - 장기 실행 과제 |
| F | ImpactReviewScreen | 임팩트 리뷰 - 종합 검토 |

- GNB 컴포넌트가 6단계를 표시하며, `gameStep`에 따라 활성화/비활성화
- GNB 아이콘 클릭 시 StartScreen으로 이동
- 강사 시스템의 ReportScreen에서 PDF 리포트 출력 가능

### 강사 시스템

| 화면 | 설명 |
|------|------|
| TeachDashboard | 수업 현황 대시보드 |
| TeachList | 수업 목록 조회 |
| TeachSave | 수업 생성/수정 |
| TeachDetail2 | 수업 상세 - 전체 단계 제출 현황 + 모달 열람 |
| StudentList | 학생 목록 관리 |
| ReportScreen | PDF 리포트 (개별 + 벌크 ZIP) |

### 서비스 레이어 구조

```
apiConfig.js (authFetch 래퍼)
├── 학생용
│   ├── impactCheckService.js
│   ├── identityCanvasService.js
│   ├── flowCanvasService.js
│   ├── canvasServiceFactory.js → winCanvasService / quickWin / buildWin
│   └── fundingService.js
├── 강사용
│   ├── teachClassService.js      (강의실 CRUD)
│   ├── teachTeamService.js       (팀/팀원 관리)
│   └── teachSubmissionService.js (제출물 조회)
└── 공용
    ├── authService.js
    ├── gameService.js
    └── reportService.js
```

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

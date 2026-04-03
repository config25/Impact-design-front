import { useCallback, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DashboardProvider } from "./contexts/DashboardContext";
import { GameStepProvider, useGameStep } from "./contexts/GameStepContext";
import AuthGuard from "./components/common/AuthGuard";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Public screens
const Main = lazy(() => import("./screens/Main"));
const MemberLogin = lazy(() => import("./screens/MemberLogin"));
const MemberRegister = lazy(() => import("./screens/MemberRegister"));
const TeachLogin = lazy(() => import("./screens/TeachLogin"));

// Student screens
const StartScreen = lazy(() => import("./screens/StartScreen"));
const ImpactCheckScreen = lazy(() => import("./screens/ImpactCheckScreen"));
const IdentityCanvasScreen = lazy(() => import("./screens/IdentityCanvasScreen"));
const PerformanceStreamScreen = lazy(() => import("./screens/PerformanceStreamScreen"));
const QuickWinScreen = lazy(() => import("./screens/QuickWinScreen"));
const BuildWinScreen = lazy(() => import("./screens/BuildWinScreen"));
const ImpactReviewScreen = lazy(() => import("./screens/ImpactReviewScreen"));

// Teacher screens
const TeacherLayout = lazy(() => import("./components/teacher/TeacherLayout"));
const TeachDashboard = lazy(() => import("./screens/teacher/TeachDashboard"));
const TeachList = lazy(() => import("./screens/teacher/TeachList"));
const TeachSave = lazy(() => import("./screens/teacher/TeachSave"));
const TeachDetail = lazy(() => import("./screens/teacher/TeachDetail"));
const TeachDetail2 = lazy(() => import("./screens/teacher/TeachDetail2"));
const StudentList = lazy(() => import("./screens/teacher/StudentList"));

const STEP_ORDER = [
    { path: "/impactcheck", key: "A" },
    { path: "/identity", key: "B" },
    { path: "/performance", key: "C" },
    { path: "/quickwin", key: "D" },
    { path: "/buildwin", key: "E" },
    { path: "/review", key: "F" },
];

function getFirstAllowedPath(gameStep) {
    if (!gameStep) return "/impactcheck";
    const allowed = gameStep.split(",").map(s => s.trim());
    for (const { path, key } of STEP_ORDER) {
        if (allowed.some(s => s === key || s.startsWith(key + "-"))) {
            return path;
        }
    }
    return "/impactcheck";
}

function StartScreenWrapper() {
    const { gameStep, fetchStep } = useGameStep();

    const handleStart = useCallback(async () => {
        let step = gameStep;
        if (step === null) {
            step = await fetchStep();
        }
        return getFirstAllowedPath(step);
    }, [gameStep, fetchStep]);

    return <StartScreen onStart={handleStart} />;
}

/* 학생 라우트 래퍼 */
const S = ({ children }) => <AuthGuard>{children}</AuthGuard>;

/* 강사 라우트 래퍼 */
const T = ({ children }) => <AuthGuard role="teacher">{children}</AuthGuard>;

function App() {
    return (
        <ErrorBoundary>
        <BrowserRouter>
            <AuthProvider>
                <DashboardProvider>
                    <GameStepProvider>
                        <Suspense fallback={null}>
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<Main />} />
                            <Route path="/login" element={<MemberLogin />} />
                            <Route path="/register" element={<MemberRegister />} />
                            <Route path="/teacher_login" element={<TeachLogin />} />

                            {/* Student routes (토큰 필요) */}
                            <Route path="/start" element={<S><StartScreenWrapper /></S>} />
                            <Route path="/impactcheck" element={<S><ImpactCheckScreen /></S>} />
                            <Route path="/identity" element={<S><IdentityCanvasScreen /></S>} />
                            <Route path="/performance" element={<S><PerformanceStreamScreen /></S>} />
                            <Route path="/quickwin" element={<S><QuickWinScreen /></S>} />
                            <Route path="/buildwin" element={<S><BuildWinScreen /></S>} />
                            <Route path="/review" element={<S><ImpactReviewScreen /></S>} />

                            {/* Teacher routes (강사 토큰 필요) */}
                            <Route path="/teacher" element={<T><TeacherLayout /></T>}>
                                <Route index element={<TeachDashboard />} />
                                <Route path="list" element={<TeachList />} />
                                <Route path="save" element={<TeachSave />} />
                                <Route path="detail/:gameId" element={<TeachDetail />} />
                                <Route path="detail2/:gameId" element={<TeachDetail2 />} />
                                <Route path="students/:gameId" element={<StudentList />} />
                            </Route>

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                        </Suspense>
                    </GameStepProvider>
                </DashboardProvider>
            </AuthProvider>
        </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;

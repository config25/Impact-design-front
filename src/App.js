import { useState, useEffect, useCallback } from "react";
import Main from "./screens/Main";
import MemberLogin from "./screens/MemberLogin";
import MemberRegister from "./screens/MemberRegister";
import TeachLogin from "./screens/TeachLogin";
import StartScreen from "./screens/StartScreen";
import ImpactCheckScreen from "./screens/ImpactCheckScreen";
import IdentityCanvasScreen from "./screens/IdentityCanvasScreen";
import PerformanceStreamScreen from "./screens/PerformanceStreamScreen";
import QuickWinScreen from "./screens/QuickWinScreen";
import BuildWinScreen from "./screens/BuildWinScreen";
import ReportScreen from "./screens/ReportScreen";
import ImpactReviewScreen from "./screens/ImpactReviewScreen";
import { AuthProvider } from "./contexts/AuthContext";
import { getUserStep } from "./services/gameService";

// Teacher screens
import TeacherLayout from "./components/teacher/TeacherLayout";
import TeachDashboard from "./screens/teacher/TeachDashboard";
import TeachList from "./screens/teacher/TeachList";
import TeachSave from "./screens/teacher/TeachSave";
import TeachDetail from "./screens/teacher/TeachDetail";
import TeachDetail2 from "./screens/teacher/TeachDetail2";
import StudentList from "./screens/teacher/StudentList";

const teacherScreens = ["teach", "teach_list", "teach_save", "teach_detail", "teach_detail2",
    "teach_modify", "student_list", "teach_mission", "teach_layer",
    "teach_community", "teach_community_form", "teach_submission_team", "teach_submission_step"];

const studentScreens = ["impactcheck", "identity", "performance", "quickwin", "buildwin", "review"];

function App() {
    const isTeacherLogin = window.location.pathname === "/teacher_login";
    const [currentScreen, setCurrentScreen] = useState(isTeacherLogin ? "teachlogin" : "login");
    const [screenParams, setScreenParams] = useState({});
    const [gameStep, setGameStep] = useState(null);

    const handleNavigate = (screen, params) => {
        setCurrentScreen(screen);
        if (params) setScreenParams(params);
    };

    const fetchStep = useCallback(async () => {
        try {
            const step = await getUserStep();
            setGameStep(step);
        } catch {
            setGameStep("");
        }
    }, []);

    useEffect(() => {
        if (studentScreens.includes(currentScreen) && gameStep === null) {
            fetchStep();
        }
    }, [currentScreen, gameStep, fetchStep]);

    // Teacher content renderer
    const renderTeacherContent = () => {
        switch (currentScreen) {
            case "teach":
                return <TeachDashboard onNavigate={handleNavigate} />;
            case "teach_list":
                return <TeachList onNavigate={handleNavigate} />;
            case "teach_save":
                return <TeachSave onNavigate={handleNavigate} />;
            case "teach_detail":
                return <TeachDetail onNavigate={handleNavigate} params={screenParams} />;
            case "teach_detail2":
                return <TeachDetail2 onNavigate={handleNavigate} params={screenParams} />;
            case "student_list":
                return <StudentList onNavigate={handleNavigate} params={screenParams} />;
            default:
                return <TeachDashboard onNavigate={handleNavigate} />;
        }
    };

    const renderScreen = () => {
        // Teacher screens → TeacherLayout wrapper
        if (teacherScreens.includes(currentScreen)) {
            return (
                <TeacherLayout
                    currentScreen={currentScreen}
                    onNavigate={handleNavigate}
                    onLogout={() => handleNavigate("teachlogin")}
                >
                    {renderTeacherContent()}
                </TeacherLayout>
            );
        }

        switch (currentScreen) {
            case "login":
                return <Main onLogin={() => handleNavigate("memberlogin")} onRegister={() => handleNavigate("memberregister")} />;
            case "memberlogin":
                return <MemberLogin onLogin={() => handleNavigate("start")} />;
            case "memberregister":
                return <MemberRegister onRegister={() => handleNavigate("login")} />;
            case "teachlogin":
                return <TeachLogin onLogin={() => handleNavigate("teach")} />;
            case "start":
                return <StartScreen onStart={() => handleNavigate("impactcheck")} />;
            case "impactcheck":
                return <ImpactCheckScreen onNavigate={handleNavigate} gameStep={gameStep} />;
            case "identity":
                return <IdentityCanvasScreen onNavigate={handleNavigate} gameStep={gameStep} />;
            case "performance":
                return <PerformanceStreamScreen onNavigate={handleNavigate} gameStep={gameStep} />;
            case "quickwin":
                return <QuickWinScreen onNavigate={handleNavigate} gameStep={gameStep} />;
            case "buildwin":
                return <BuildWinScreen onNavigate={handleNavigate} gameStep={gameStep} />;
            case "review":
                return <ImpactReviewScreen onNavigate={handleNavigate} gameStep={gameStep} />;
            case "report":
                return <ReportScreen onNavigate={handleNavigate} gameStep={gameStep} />;
            default:
                return <Main onLogin={() => handleNavigate("start")} onRegister={() => handleNavigate("start")} />;
        }
    };

    return (
        <AuthProvider onLogout={(wasTeacher) => { setGameStep(null); handleNavigate(wasTeacher ? "teachlogin" : "login"); }}>
            {renderScreen()}
        </AuthProvider>
    );
}

export default App;

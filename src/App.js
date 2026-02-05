import { useState } from "react";
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
import { AuthProvider } from "./contexts/AuthContext";

function App() {
    const isTeacherLogin = window.location.pathname === "/teacher_login";
    const [currentScreen, setCurrentScreen] = useState(isTeacherLogin ? "teachlogin" : "login");

    const handleNavigate = (screen) => {
        setCurrentScreen(screen);
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case "login":
                return <Main onLogin={() => handleNavigate("memberlogin")} onRegister={() => handleNavigate("memberregister")} />;
            case "memberlogin":
                return <MemberLogin onLogin={() => handleNavigate("start")} />;
            case "memberregister":
                return <MemberRegister onRegister={() => handleNavigate("login")} />;
            case "teachlogin":
                return <TeachLogin onLogin={() => handleNavigate("start")} />;
            case "start":
                return <StartScreen onStart={() => handleNavigate("impactcheck")} />;
            case "impactcheck":
                return <ImpactCheckScreen onNavigate={handleNavigate} />;
            case "identity":
                return <IdentityCanvasScreen onNavigate={handleNavigate} />;
            case "performance":
                return <PerformanceStreamScreen onNavigate={handleNavigate} />;
            case "quickwin":
                return <QuickWinScreen onNavigate={handleNavigate} />;
            case "buildwin":
                return <BuildWinScreen onNavigate={handleNavigate} />;
            case "review":
                return <ReportScreen onNavigate={handleNavigate} />;
            default:
                return <Main onLogin={() => handleNavigate("start")} onRegister={() => handleNavigate("start")} />;
        }
    };

    return (
        <AuthProvider onLogout={() => handleNavigate("login")}>
            {renderScreen()}
        </AuthProvider>
    );
}

export default App;

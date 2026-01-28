import { useState } from "react";
import StartScreen from "./screens/StartScreen";
import ImpactCheckScreen from "./screens/ImpactCheckScreen";
import IdentityCanvasScreen from "./screens/IdentityCanvasScreen";
import PerformanceStreamScreen from "./screens/PerformanceStreamScreen";
import QuickWinScreen from "./screens/QuickWinScreen";
import BuildWinScreen from "./screens/BuildWinScreen";

function App() {
    const [currentScreen, setCurrentScreen] = useState("start");

    const handleStart = () => {
        setCurrentScreen("impactcheck");
    };

    const handleNavigate = (screen) => {
        setCurrentScreen(screen);
    };

    switch (currentScreen) {
        case "start":
            return <StartScreen onStart={handleStart} />;
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
        default:
            return <StartScreen onStart={handleStart} />;
    }
}

export default App;

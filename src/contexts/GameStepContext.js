import { createContext, useState, useCallback, useContext } from "react";
import { getUserStep } from "../services/gameService";

export const GameStepContext = createContext();

export const GameStepProvider = ({ children }) => {
    const [gameStep, setGameStep] = useState(null);

    const fetchStep = useCallback(async () => {
        try {
            const step = await getUserStep();
            setGameStep(step);
            return step;
        } catch {
            setGameStep("");
            return "";
        }
    }, []);

    const resetGameStep = useCallback(() => setGameStep(null), []);

    return (
        <GameStepContext.Provider value={{ gameStep, setGameStep, fetchStep, resetGameStep }}>
            {children}
        </GameStepContext.Provider>
    );
};

export const useGameStep = () => useContext(GameStepContext);

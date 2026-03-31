import { useState, useRef, useCallback } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { getTeamCanvases } from "../services/reportService";

const usePdfDownload = ({ gameId, teams, gameInfo }) => {
    const [pdfAllRunning, setPdfAllRunning] = useState(false);
    const [pdfProgress, setPdfProgress] = useState({ current: 0, total: 0, teamName: "", done: false, error: null });
    const pdfReportRef = useRef(null);
    const pdfReadyResolveRef = useRef(null);
    const [pdfRenderData, setPdfRenderData] = useState(null);
    const [pdfRenderTeamCanvas, setPdfRenderTeamCanvas] = useState(null);

    const handlePdfReportReady = useCallback(() => {
        if (pdfReadyResolveRef.current) {
            pdfReadyResolveRef.current();
            pdfReadyResolveRef.current = null;
        }
    }, []);

    const handleDownloadAllPDF = useCallback(async () => {
        if (teams.length === 0) return;
        setPdfAllRunning(true);
        setPdfProgress({ current: 0, total: teams.length, teamName: "캔버스 데이터 로딩 중...", done: false, error: null });

        const result = await getTeamCanvases(gameId);
        if (!result.success) {
            setPdfProgress(prev => ({ ...prev, error: result.message }));
            setPdfAllRunning(false);
            return;
        }
        const allCanvases = result.data;

        const zip = new JSZip();

        for (let i = 0; i < allCanvases.length; i++) {
            const teamCanvas = allCanvases[i];
            const teamName = teamCanvas.teamName || `팀${i + 1}`;
            setPdfProgress(prev => ({ ...prev, current: i + 1, teamName }));

            setPdfRenderData(null);
            setPdfRenderTeamCanvas(null);
            await new Promise(r => setTimeout(r, 100));
            setPdfRenderData({ className: gameInfo?.name, target: gameInfo?.target, projectDate: new Date().toISOString().slice(0, 10) });
            setPdfRenderTeamCanvas([teamCanvas]);

            await new Promise((resolve) => {
                pdfReadyResolveRef.current = resolve;
                setTimeout(() => { pdfReadyResolveRef.current = null; resolve(); }, 30000);
            });

            try {
                const blob = await pdfReportRef.current?.generatePDFBlob();
                if (blob) {
                    zip.file(`${teamName}_Report.pdf`, blob);
                }
            } catch (err) {
                console.error(`PDF 생성 실패 (${teamName}):`, err);
            }
        }

        setPdfRenderData(null);
        setPdfRenderTeamCanvas(null);

        try {
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `${gameInfo?.name || "강의실"}_전체보고서.zip`);
            setPdfProgress(prev => ({ ...prev, done: true }));
        } catch {
            setPdfProgress(prev => ({ ...prev, error: "ZIP 생성에 실패했습니다." }));
        }
        setPdfAllRunning(false);
    }, [teams, gameInfo, gameId]);

    return {
        pdfAllRunning, pdfProgress, setPdfProgress,
        pdfRenderData, pdfRenderTeamCanvas, pdfReportRef,
        handleDownloadAllPDF, handlePdfReportReady,
    };
};

export default usePdfDownload;

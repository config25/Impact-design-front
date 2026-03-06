import { useState, useRef, useCallback } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { getBulkReport } from "../services/reportService";

const usePdfDownload = ({ gameId, teams, gameInfo }) => {
    const [pdfAllRunning, setPdfAllRunning] = useState(false);
    const [pdfProgress, setPdfProgress] = useState({ current: 0, total: 0, teamName: "", done: false, error: null });
    const pdfReportRef = useRef(null);
    const pdfReadyResolveRef = useRef(null);
    const [pdfRenderTeamId, setPdfRenderTeamId] = useState(null);
    const [pdfRenderData, setPdfRenderData] = useState(null);

    const handlePdfReportReady = useCallback(() => {
        if (pdfReadyResolveRef.current) {
            pdfReadyResolveRef.current();
            pdfReadyResolveRef.current = null;
        }
    }, []);

    const handleDownloadAllPDF = useCallback(async () => {
        if (teams.length === 0) return;
        setPdfAllRunning(true);
        setPdfProgress({ current: 0, total: teams.length, teamName: "데이터 로딩 중...", done: false, error: null });

        const bulkResult = await getBulkReport(gameId);
        if (!bulkResult.success) {
            setPdfProgress(prev => ({ ...prev, error: bulkResult.message }));
            setPdfAllRunning(false);
            return;
        }
        const allReports = bulkResult.data;

        const zip = new JSZip();

        for (let i = 0; i < allReports.length; i++) {
            const report = allReports[i];
            const teamName = report.teamName || `팀${i + 1}`;
            setPdfProgress(prev => ({ ...prev, current: i + 1, teamName }));

            setPdfRenderTeamId(null);
            setPdfRenderData(null);
            await new Promise(r => setTimeout(r, 100));
            setPdfRenderData(report);
            setPdfRenderTeamId(report.teamId);

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

        setPdfRenderTeamId(null);
        setPdfRenderData(null);

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
        pdfRenderTeamId, pdfRenderData, pdfReportRef,
        handleDownloadAllPDF, handlePdfReportReady,
    };
};

export default usePdfDownload;

import { useState, useRef, useCallback } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { getTeamCanvases } from "../services/reportService";

// 카테고리(캔버스 종류)별로 묶어 PDF 생성
const CANVAS_TYPES = [
    { key: "identity", label: "1_Identity_Canvas" },
    { key: "flow", label: "2_Flow_Canvas" },
    { key: "quick", label: "3_QuickWin_Canvas" },
    { key: "build", label: "4_BuildWin_Canvas" },
];

// 팀명에서 숫자 추출 (팀1, 팀2 ...). 숫자가 없으면 teamId를 사용.
const extractTeamNumber = (team) => {
    const m = (team?.teamName || "").match(/\d+/);
    if (m) return parseInt(m[0], 10);
    return team?.teamId ?? 0;
};

const usePdfDownload = ({ gameId, teams, gameInfo }) => {
    const [pdfAllRunning, setPdfAllRunning] = useState(false);
    const [pdfProgress, setPdfProgress] = useState({ current: 0, total: 0, teamName: "", done: false, error: null });
    const pdfReportRef = useRef(null);
    const pdfReadyResolveRef = useRef(null);
    const [pdfRenderData, setPdfRenderData] = useState(null);
    const [pdfRenderTeamCanvas, setPdfRenderTeamCanvas] = useState(null);
    const [pdfRenderCanvasType, setPdfRenderCanvasType] = useState(null);

    const handlePdfReportReady = useCallback(() => {
        if (pdfReadyResolveRef.current) {
            pdfReadyResolveRef.current();
            pdfReadyResolveRef.current = null;
        }
    }, []);

    const handleDownloadAllPDF = useCallback(async () => {
        if (teams.length === 0) return;
        setPdfAllRunning(true);
        setPdfProgress({ current: 0, total: CANVAS_TYPES.length, teamName: "캔버스 데이터 로딩 중...", done: false, error: null });

        const result = await getTeamCanvases(gameId);
        if (!result.success) {
            setPdfProgress(prev => ({ ...prev, error: result.message }));
            setPdfAllRunning(false);
            return;
        }

        // 백엔드 응답 형태 (GameCanvasesResponse):
        // {
        //   imageUrl,
        //   identityCanvases: [{ teamId, teamName, writerUserId, canvas }, ...],
        //   flowCanvases:     [{ teamId, teamName, writerUserId, canvas }, ...],
        //   quickWinCanvases: [{ teamId, teamName, writerUserId, canvas }, ...],
        //   buildWinCanvases: [{ teamId, teamName, writerUserId, canvas }, ...]
        // }
        // teamId 기준으로 4종 캔버스를 같은 팀에 매칭하여 팀 객체 배열로 재조립한다.
        const d = result.data || {};
        const sharedImageUrl = d.imageUrl || null;

        const indexByTeamId = (arr) => {
            const map = new Map();
            (Array.isArray(arr) ? arr : []).forEach(item => {
                if (item && item.teamId != null) map.set(item.teamId, item);
            });
            return map;
        };

        const idMap = indexByTeamId(d.identityCanvases);
        const flMap = indexByTeamId(d.flowCanvases);
        const qwMap = indexByTeamId(d.quickWinCanvases);
        const bwMap = indexByTeamId(d.buildWinCanvases);

        // 모든 캔버스에 등장한 teamId 합집합
        const teamIdSet = new Set([...idMap.keys(), ...flMap.keys(), ...qwMap.keys(), ...bwMap.keys()]);
        if (teamIdSet.size === 0) {
            console.warn("[usePdfDownload] 알 수 없는 응답 형태:", result.data);
            setPdfProgress(prev => ({ ...prev, error: "캔버스 데이터가 없습니다." }));
            setPdfAllRunning(false);
            return;
        }

        const merged = Array.from(teamIdSet).map(teamId => {
            const id = idMap.get(teamId);
            const fl = flMap.get(teamId);
            const qw = qwMap.get(teamId);
            const bw = bwMap.get(teamId);
            const teamName = id?.teamName || fl?.teamName || qw?.teamName || bw?.teamName || `팀${teamId}`;
            return {
                teamId,
                teamName,
                imageUrl: sharedImageUrl,
                identityCanvas: id?.canvas || null,
                flowCanvas: fl?.canvas || null,
                quickWinCanvas: qw?.canvas || null,
                buildWinCanvas: bw?.canvas || null,
            };
        });

        // 팀 순서대로 정렬 (팀1, 팀2, ... 팀6) - teamName의 숫자 → teamId 순
        const sortedCanvases = merged.sort((a, b) => {
            const na = extractTeamNumber(a);
            const nb = extractTeamNumber(b);
            if (na !== nb) return na - nb;
            return (a.teamId || 0) - (b.teamId || 0);
        });

        const zip = new JSZip();

        for (let i = 0; i < CANVAS_TYPES.length; i++) {
            const ct = CANVAS_TYPES[i];
            setPdfProgress(prev => ({ ...prev, current: i + 1, teamName: ct.label }));

            // 이전 렌더 초기화
            setPdfRenderData(null);
            setPdfRenderTeamCanvas(null);
            setPdfRenderCanvasType(null);
            await new Promise(r => setTimeout(r, 100));

            setPdfRenderData({ className: gameInfo?.name, target: gameInfo?.target, projectDate: new Date().toISOString().slice(0, 10) });
            setPdfRenderTeamCanvas(sortedCanvases);
            setPdfRenderCanvasType(ct.key);

            // 렌더 완료 대기 (타임아웃 60초 - 팀 수 만큼 렌더되므로 여유)
            await new Promise((resolve) => {
                pdfReadyResolveRef.current = resolve;
                setTimeout(() => { pdfReadyResolveRef.current = null; resolve(); }, 60000);
            });

            try {
                const blob = await pdfReportRef.current?.generatePDFBlob();
                if (blob) {
                    zip.file(`${ct.label}.pdf`, blob);
                }
            } catch (err) {
                console.error(`PDF 생성 실패 (${ct.label}):`, err);
            }
        }

        setPdfRenderData(null);
        setPdfRenderTeamCanvas(null);
        setPdfRenderCanvasType(null);

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
        pdfRenderData, pdfRenderTeamCanvas, pdfRenderCanvasType, pdfReportRef,
        handleDownloadAllPDF, handlePdfReportReady,
    };
};

export default usePdfDownload;

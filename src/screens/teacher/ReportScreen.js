import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import "./ReportScreen.css";
import { getImageUrl } from "../../utils/logoUtil";
import { getReport, getReportByTeam } from "../../services/reportService";
import { calculateScores, getProfileType, getPageNumber } from "../../utils/reportUtils";
import { generatePDFFromContainer } from "../../utils/reportPdfUtils";

import ReportCover from "../../components/report/ReportCover";
import ReportAbout from "../../components/report/ReportAbout";
import ReportContents from "../../components/report/ReportContents";
import ReportPerformanceProfile from "../../components/report/ReportPerformanceProfile";
import ReportVoicePage from "../../components/report/ReportVoicePage";
import ReportNewFuture from "../../components/report/ReportNewFuture";
import ReportGoalsTable from "../../components/report/ReportGoalsTable";
import ReportTwoColTable from "../../components/report/ReportTwoColTable";
import ReportWinTable from "../../components/report/ReportWinTable";
import ReportBackCover from "../../components/report/ReportBackCover";
import BulkCanvasPages from "../../components/report/BulkCanvasPages";

const VOICE_DESC = "Strategic Identity는 조직을 둘러싼 위협적인 '외부 변화'와 이를 극복하기 위한 '내부 한계점'에 대한 구성원들의 생생한 목소리를 담고 있습니다. 우리 조직의 존재 이유와 목표를 재정의하고, 구성원들이 도출한 새로운 미션, 비전, 핵심가치를 통해 위기를 돌파할 실질적인 미래 청사진을 제안합니다.";

const ReportScreen = forwardRef(({ onNavigate, gameStep, teamId, onClose, onReady, hideControls, bulkMode, bulkCanvasData, bulkCanvasType, initialData }, ref) => {
    const containerRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [logoUrl, setLogoUrl] = useState(null);

    useEffect(() => {
        if (initialData) {
            setReportData(initialData);
            if (initialData.imageUrl) setLogoUrl(getImageUrl(initialData.imageUrl));
            setLoading(false);
            return;
        }
        const fetchReport = async () => {
            setLoading(true);
            try {
                const result = teamId ? await getReportByTeam(teamId) : await getReport();
                if (result.success) {
                    setReportData(result.data);
                    if (result.data?.imageUrl) setLogoUrl(getImageUrl(result.data.imageUrl));
                }
            } catch (err) {
                console.error("리포트 조회 실패:", err);
            }
            setLoading(false);
        };
        fetchReport();
    }, [teamId, initialData]);

    const generatePDFBlob = async () => {
        const pdf = await generatePDFFromContainer(containerRef, { landscape: !!bulkMode });
        return pdf ? pdf.output("blob") : null;
    };

    useImperativeHandle(ref, () => ({ generatePDFBlob }));

    useEffect(() => {
        if (!loading && reportData && onReady) {
            const timer = setTimeout(() => onReady(), 500);
            return () => clearTimeout(timer);
        }
    }, [loading, reportData, onReady]);

    if (loading) return (
        <div className="report-loading">
            <div className="report-loading-spinner"></div>
            <p className="report-loading-text">리포트를 불러오는 중...</p>
            <div className="report-loading-bar"><div className="report-loading-bar-fill"></div></div>
        </div>
    );
    if (!reportData) return <div className="report-loading">리포트 데이터가 없습니다.</div>;

    const handleDownloadPDF = async () => {
        if (!containerRef.current || isExporting) return;
        setIsExporting(true);
        try {
            const pdf = await generatePDFFromContainer(containerRef);
            if (pdf) pdf.save("Impact_Report.pdf");
        } catch (err) {
            console.error("PDF export failed:", err);
        } finally {
            setIsExporting(false);
        }
    };

    const scores = bulkMode ? {} : calculateScores(reportData.impactCheckScores);
    const profileType = bulkMode ? "" : getProfileType(scores.performanceCreation, scores.futureCompetitiveness);

    const has11P = (reportData?.flowCanvasGoals?.goals?.length || 0) >= 21;
    const has13P = (reportData?.tacticals?.length || 0) >= 45;
    const has15P = (reportData?.strategicActivities?.length || 0) >= 45;
    const gp = (basePage) => getPageNumber(has11P, has13P, has15P, basePage);

    const tacticals = reportData?.tacticals || [];
    const strategicActivities = reportData?.strategicActivities || [];

    return (
        <div className="report-container" ref={containerRef}>
            {!hideControls && (
                <button className="pdf-download-btn" onClick={handleDownloadPDF} disabled={isExporting}>
                    {isExporting ? "PDF 생성 중..." : "PDF 다운로드"}
                </button>
            )}

            {/* Page 1 - Cover */}
            {!bulkMode && <ReportCover reportData={reportData} />}

            {/* Page 2 - About */}
            {!bulkMode && <ReportAbout />}

            {!bulkMode && <>
            {/* Page 3 - Contents I */}
            <ReportContents activeSection={1} />

            {/* Page 4 - Performance Profile */}
            <ReportPerformanceProfile logoUrl={logoUrl} scores={scores} profileType={profileType} />

            {/* Page 5 - Contents II */}
            <ReportContents activeSection={2} />

            {/* Page 6 - External Threats */}
            <ReportVoicePage
                logoUrl={logoUrl}
                pageNumber={6}
                descText={VOICE_DESC}
                resultHighlight="외부 환경 변화"
                boxTitle="외부의 위협신호"
                boxSubtitle="External Threats"
                data={reportData?.externalThreats}
                dataMaxWidth="852px"
                fallbackWidth="709px"
            />

            {/* Page 7 - Internal Limits */}
            <ReportVoicePage
                logoUrl={logoUrl}
                pageNumber={7}
                descText={VOICE_DESC}
                resultHighlight="내부 역량 한계"
                boxTitle="내부의 한계점"
                boxSubtitle="Internal Limits"
                data={reportData?.internalLimitations}
                dataMaxWidth="830px"
                fallbackWidth="740px"
                fallbackWidthLast="200px"
            />

            {/* Page 8 - Contents III */}
            <ReportContents activeSection={3} />

            {/* Page 9 - New Future */}
            <ReportNewFuture logoUrl={logoUrl} reportData={reportData} />

            {/* Page 10 - Strategic Goals */}
            <ReportGoalsTable logoUrl={logoUrl} reportData={reportData} page={10} />

            {/* Page 11 - Strategic Goals (continued) */}
            {has11P && <ReportGoalsTable logoUrl={logoUrl} reportData={reportData} page={11} isSecondPage />}

            {/* Page 12 - Tactical KPI */}
            <ReportTwoColTable
                logoUrl={logoUrl}
                pageNumber={gp(12)}
                pageClassName="12"
                items={tacticals}
                totalCount={tacticals.length}
                startIdx={0}
                maxItems={44}
                headers={["전술적 성과지표", "목표"]}
                titleKr="전술적 성과지표 제시"
                infoText="구성원들은 전략목표 달성을 위한 전술적 성과지표"
                contentBox={{
                    title: "전술적 성과지표 (Tactical KPI)",
                    badge1: "열매(Fruit)", badge1Class: "fruit",
                    badge2: "토양(Soil)", badge2Class: "soil",
                    desc: "전술적 성과지표(Tactical Key Performance Index)는 조직이 설정한 단기 전략 목표가 계획대로 달성되었는지를 확인하는 '결과 중심'의 정량 지표입니다. 당면한 목표의 달성 여부를 객관적으로 측정하여, 실질적 성과창출 능력을 입증합니다. (Performance 관점)",
                }}
                getField1={(item) => item?.metric}
                getField2={(item) => item?.goal}
                field1MaxLen={20}
                field2MaxLen={15}
            />

            {/* Page 13 - Tactical KPI (continued) */}
            {has13P && (
                <ReportTwoColTable
                    logoUrl={logoUrl}
                    pageNumber={gp(13)}
                    pageClassName="13"
                    items={tacticals}
                    totalCount={tacticals.length}
                    startIdx={44}
                    maxItems={44}
                    headers={["전술적 성과지표", "목표"]}
                    titleKr="전술적 성과지표 제시"
                    infoText="구성원들은 전략목표 달성을 위한 전술적 성과지표"
                    isSecondPage
                    getField1={(item) => item?.metric}
                    getField2={(item) => item?.goal}
                    field1MaxLen={20}
                    field2MaxLen={15}
                />
            )}

            {/* Page 14 - Strategic KAI */}
            <ReportTwoColTable
                logoUrl={logoUrl}
                pageNumber={gp(14)}
                pageClassName="14"
                items={strategicActivities}
                totalCount={strategicActivities.length}
                startIdx={0}
                maxItems={44}
                headers={["전략적 행동지표", "내재화 기준"]}
                titleKr="전략적 행동지표 제시"
                infoText="구성원들은 전략목표 달성을 위한 전략적 행동지표"
                contentBox={{
                    extraClass: " p14-content-box",
                    title: "전략적 행동지표 (Strategic KAI)",
                    badge1: "열매(Fruit)", badge1Class: "soil",
                    badge2: "토양(Soil)", badge2Class: "fruit",
                    desc: "전략적 행동지표(Strategic Key Action Index)는 단순한 목표 달성을 넘어, 성과를 지속적으로 낼 수 있는 '반복 가능한 구조'와 '근본적인 체질'을 만드는 행동 중심의 지표입니다. 지속가능한 성과창출 조직을 만들기 위한 전략적 행동을 측정하여, 조직의 DNA를 변화시킵니다.(Fundamental관점)",
                }}
                getField1={(item) => item?.activityMetric}
                getField2={(item) => item?.interCriteria}
                field1MaxLen={20}
                field2MaxLen={15}
            />

            {/* Page 15 - Strategic KAI (continued) */}
            {has15P && (
                <ReportTwoColTable
                    logoUrl={logoUrl}
                    pageNumber={gp(15)}
                    pageClassName="15"
                    items={strategicActivities}
                    totalCount={strategicActivities.length}
                    startIdx={44}
                    maxItems={44}
                    headers={["전략적 행동지표", "내재화 기준"]}
                    titleKr="전략적 행동지표 제시"
                    infoText="구성원들은 전략목표 달성을 위한 전략적 행동지표"
                    isSecondPage
                    getField1={(item) => item?.activityMetric}
                    getField2={(item) => item?.interCriteria}
                    field1MaxLen={20}
                    field2MaxLen={15}
                />
            )}

            {/* Page 16 - Contents IV */}
            <ReportContents activeSection={4} />

            {/* Page 17 - Quick Win */}
            <ReportWinTable
                logoUrl={logoUrl}
                pageNumber={gp(17)}
                title="전술적 실행과제 (Quick Win)"
                descText={<>전술적 실행과제(Quick Win)는 즉시 실행하여 가시적인 성과를 창출할 수 있는 '단기적 실행과제'입니다. 빠르게 축적된 '작은 성공(Small Success)'의 경험을 통해 조직에 변화의 모멘텀을 만들고, 단기적인 전술적 성과지표(Tactical KPI) 달성을 견인할 수<br />있습니다.</>}
                infoText="구성원들은 성과체질 개선을 위한 전술적 실행과제"
                subtitleLeft="[별첨 1] Quick Win Canvas(전술적 실행과제) 모음집"
                list={reportData?.quickWinCanvasList || []}
            />

            {/* Page 18 - Build Win */}
            <ReportWinTable
                logoUrl={logoUrl}
                pageNumber={gp(18)}
                title="전략적 실행과제 (Build Win)"
                descText={<>전략적 실행과제(Build Win)는 조직의 미래 경쟁력을 확보하기 위해 긴 호흡으로 추진해야 할 '중장기 혁신 과제'입니다.<br />성과창출 체질과 토양을 만드는 '견고한 구조'를 구축하여,<br />지속 가능한 성장의 토대를 마련합니다.</>}
                infoText="구성원들은 성과체질 개선을 위한 전략적 실행과제"
                subtitleLeft="[별첨 2] Build Win Canvas(전략적 실행과제) 모음집"
                list={reportData?.buildWinCanvasList || []}
            />
            </>}

            {/* Bulk Canvas Pages */}
            {bulkMode && bulkCanvasData && (
                <BulkCanvasPages canvasData={bulkCanvasData} canvasType={bulkCanvasType} />
            )}

            {/* Page 19 - Back Cover */}
            {!bulkMode && <ReportBackCover />}
        </div>
    );
});

export default ReportScreen;

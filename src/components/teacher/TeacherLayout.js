import { useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import TeacherHeader from "./TeacherHeader";
import "./TeacherLayout.css";

const breadcrumbConfig = {
    teach: { category: "강의실 관리", page: "강의실 현황" },
    teach_list: { category: "강의실 관리", page: "강의실 현황" },
    teach_save: { category: "강의실 관리", page: "강의실 생성" },
    teach_detail: { category: "강의실 관리", page: "강의실 상세정보" },
    teach_detail2: { category: "교육 진행", page: "시뮬레이션 및 출력" },
    student_list: { category: "교육 진행", page: "교육생 목록" },
    teach_mission: { category: "교육 진행", page: "미션 성과" },
    teach_layer: { category: "교육 진행", page: "미션 상세" },
    teach_community: { category: "커뮤니티", page: "커뮤니티" },
    teach_community_form: { category: "커뮤니티", page: "커뮤니티" },
    teach_submission_team: { category: "교육 진행", page: "팀별 제출현황" },
    teach_submission_step: { category: "교육 진행", page: "단계별 제출현황" },
};

const TeacherLayout = ({ currentScreen, onNavigate, onLogout, children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

    const crumb = breadcrumbConfig[currentScreen] || { category: "강의실 관리", page: "대시보드" };

    return (
        <div className="tly-main">
            <TeacherHeader
                onLogout={onLogout}
                onToggleSidebar={toggleSidebar}
            />

            <TeacherSidebar
                currentScreen={currentScreen}
                onNavigate={onNavigate}
                collapsed={sidebarCollapsed}
                onToggleCollapse={toggleSidebar}
            />

            <section
                className={`tly-content-wrapper ${sidebarCollapsed ? "tly-content-wrapper--collapsed" : ""}`}
            >
                <header className="tly-topbar">
                    <ol className="tly-breadcrumb">
                        <li className="tly-crumb-active">
                            <a href="#/" onClick={(e) => { e.preventDefault(); onNavigate("teach"); }}>
                                {crumb.category}
                            </a>
                        </li>
                        <li className="tly-crumb-icon">
                            <a href="#/" onClick={(e) => { e.preventDefault(); onNavigate("teach"); }}>
                                <span className="fa fa-home"></span>
                            </a>
                        </li>
                        <li className="tly-crumb-trail">{crumb.page}</li>
                    </ol>
                </header>

                <section className="tly-content">
                    {children}
                </section>
            </section>
        </div>
    );
};

export default TeacherLayout;

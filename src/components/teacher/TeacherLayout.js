import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import TeacherHeader from "./TeacherHeader";
import "./TeacherLayout.css";

const breadcrumbConfig = {
    "/teacher": { category: "강의실 관리", page: "강의실 현황" },
    "/teacher/list": { category: "강의실 관리", page: "강의실 현황" },
    "/teacher/save": { category: "강의실 관리", page: "강의실 생성" },
    "/teacher/detail": { category: "강의실 관리", page: "강의실 상세정보" },
    "/teacher/detail2": { category: "교육 진행", page: "시뮬레이션 및 출력" },
    "/teacher/students": { category: "교육 진행", page: "교육생 목록" },
};

function getBreadcrumb(pathname) {
    if (breadcrumbConfig[pathname]) return breadcrumbConfig[pathname];
    // Match patterns like /teacher/detail/123
    for (const [key, value] of Object.entries(breadcrumbConfig)) {
        if (pathname.startsWith(key + "/")) return value;
    }
    return { category: "강의실 관리", page: "대시보드" };
}

const TeacherLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

    const handleLogout = () => {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("userRole");
        navigate("/teacher_login");
    };

    const crumb = getBreadcrumb(location.pathname);

    return (
        <div className="tly-main">
            <TeacherHeader
                onLogout={handleLogout}
                onToggleSidebar={toggleSidebar}
            />

            <TeacherSidebar
                collapsed={sidebarCollapsed}
                onToggleCollapse={toggleSidebar}
            />

            <section
                className={`tly-content-wrapper ${sidebarCollapsed ? "tly-content-wrapper--collapsed" : ""}`}
            >
                <header className="tly-topbar">
                    <ol className="tly-breadcrumb">
                        <li className="tly-crumb-active">
                            <a href="#/" onClick={(e) => { e.preventDefault(); navigate("/teacher"); }}>
                                {crumb.category}
                            </a>
                        </li>
                        <li className="tly-crumb-icon">
                            <a href="#/" onClick={(e) => { e.preventDefault(); navigate("/teacher"); }}>
                                <span className="fa fa-home"></span>
                            </a>
                        </li>
                        <li className="tly-crumb-trail">{crumb.page}</li>
                    </ol>
                </header>

                <section className="tly-content">
                    <Outlet />
                </section>
            </section>
        </div>
    );
};

export default TeacherLayout;

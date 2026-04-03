import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./TeacherSidebar.css";

const TeacherSidebar = ({ collapsed, onToggleCollapse }) => {
    const [openMenus, setOpenMenus] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;

    const isClassroomActive = pathname.startsWith("/teacher/save") ||
        pathname.startsWith("/teacher/list") ||
        pathname.startsWith("/teacher/detail");

    const isGroupOpen = (groupKey) => {
        if (openMenus[groupKey] !== undefined) return openMenus[groupKey];
        if (groupKey === "classroom") return isClassroomActive;
        return false;
    };

    const toggleGroup = (groupKey) => {
        setOpenMenus((prev) => ({ ...prev, [groupKey]: !isGroupOpen(groupKey) }));
    };

    return (
        <aside id="sidebar_left" className={collapsed ? "ts-collapsed" : ""}>
            <div className="ts-sidebar-menu">
                <ul className="ts-nav-main">
                    {/* HOME */}
                    <li className="ts-sidebar-label">HOME</li>
                    <li>
                        <button
                            className={`ts-nav-link ${pathname === "/teacher" ? "ts-nav-link--active" : ""}`}
                            onClick={() => navigate("/teacher")}
                            title="Dashboard"
                        >
                            <span className="fa fa-home ts-nav-icon"></span>
                            <span className="ts-nav-title">Dashboard</span>
                        </button>
                    </li>

                    {/* MENU */}
                    <li className="ts-sidebar-label">MENU</li>

                    {/* 강의실 관리 */}
                    <li>
                        <button
                            className={`ts-nav-link ${isClassroomActive ? "ts-nav-link--active" : ""}`}
                            onClick={() => toggleGroup("classroom")}
                            title="강의실 관리"
                        >
                            <span className="fa fa-book ts-nav-icon"></span>
                            <span className="ts-nav-title">강의실 관리</span>
                            <span className={`ts-nav-caret ${isGroupOpen("classroom") ? "ts-nav-caret--open" : ""}`}>
                                <i className="fa fa-angle-right"></i>
                            </span>
                        </button>
                        <ul className={`ts-sub-nav ${isGroupOpen("classroom") ? "ts-sub-nav--open" : ""}`}>
                            <li>
                                <button
                                    className={`ts-sub-link ${pathname === "/teacher/save" ? "ts-sub-link--active" : ""}`}
                                    onClick={() => navigate("/teacher/save")}
                                >
                                    <span className="fa fa-file-pdf-o ts-sub-icon"></span>
                                    강의실 생성
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`ts-sub-link ${pathname.startsWith("/teacher/list") || pathname.startsWith("/teacher/detail") ? "ts-sub-link--active" : ""}`}
                                    onClick={() => navigate("/teacher/list")}
                                >
                                    <span className="fa fa-cube ts-sub-icon"></span>
                                    강의실 현황
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

            {/* .sidebar-toggle-mini */}
            <button className="ts-collapse-toggle" onClick={onToggleCollapse}>
                <i className="fa fa-sign-out"></i>
            </button>
        </aside>
    );
};

export default TeacherSidebar;

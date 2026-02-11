import { useState } from "react";
import "./TeacherSidebar.css";

const TeacherSidebar = ({ currentScreen, onNavigate, collapsed, onToggleCollapse }) => {
    const [openMenus, setOpenMenus] = useState({});

    const isClassroomActive = ["teach_save", "teach_list", "teach_detail", "teach_modify"].includes(currentScreen);

    const isGroupOpen = (groupKey) => {
        if (openMenus[groupKey] !== undefined) return openMenus[groupKey];
        if (groupKey === "classroom") return isClassroomActive;
        return false;
    };

    const toggleGroup = (groupKey) => {
        setOpenMenus((prev) => ({ ...prev, [groupKey]: !isGroupOpen(groupKey) }));
    };

    const handleNav = (screen, params) => {
        if (onNavigate) onNavigate(screen, params);
    };

    return (
        <aside id="sidebar_left" className={collapsed ? "ts-collapsed" : ""}>
            <div className="ts-sidebar-menu">
                <ul className="ts-nav-main">
                    {/* HOME */}
                    <li className="ts-sidebar-label">HOME</li>
                    <li>
                        <button
                            className={`ts-nav-link ${currentScreen === "teach" ? "ts-nav-link--active" : ""}`}
                            onClick={() => handleNav("teach")}
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
                                    className={`ts-sub-link ${currentScreen === "teach_save" ? "ts-sub-link--active" : ""}`}
                                    onClick={() => handleNav("teach_save")}
                                >
                                    <span className="fa fa-file-pdf-o ts-sub-icon"></span>
                                    강의실 생성
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`ts-sub-link ${["teach_list", "teach_detail"].includes(currentScreen) ? "ts-sub-link--active" : ""}`}
                                    onClick={() => handleNav("teach_list")}
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

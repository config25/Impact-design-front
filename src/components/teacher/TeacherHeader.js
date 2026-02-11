import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import "./TeacherHeader.css";

const TeacherHeader = ({ onLogout, onToggleSidebar }) => {
    const { logout } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="th-header">
            {/* .navbar-branding - 로고 영역 */}
            <div className="th-branding">
                <a className="th-brand-link" href="#/">
                    <img
                        src={process.env.PUBLIC_URL + "/q_logo.png"}
                        alt="Quantum Edu"
                        className="th-brand-logo"
                    />
                </a>
                <button className="th-toggle-btn" onClick={onToggleSidebar}>
                    <i className="fa fa-bars"></i>
                </button>
            </div>

            {/* .navbar-slogan */}
            <div className="th-slogan">Quantum Edu Tutor Page</div>

            {/* 프로필 드롭다운 */}
            <div className="th-profile-area" ref={dropdownRef}>
                <span className="th-divider">
                    <i className="fa fa-circle"></i>
                </span>
                <button
                    className="th-profile-btn"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                >
                    <img
                        src={process.env.PUBLIC_URL + "/avatar_default.jpg"}
                        alt="avatar"
                        className="th-avatar"
                    />
                    <span className="th-caret"></span>
                </button>

                {dropdownOpen && (
                    <ul className="th-dropdown">
                        <li>
                            <button className="th-dropdown-item">
                                <span className="fa fa-book"></span> Quantum Edu 강사 메뉴얼
                            </button>
                        </li>
                        <li>
                            <button className="th-dropdown-item">
                                <span className="fa fa-user"></span> 프로필
                            </button>
                        </li>
                        <li className="th-dropdown-footer">
                            <button
                                className="th-dropdown-item"
                                onClick={async () => {
                                    setDropdownOpen(false);
                                    await logout();
                                }}
                            >
                                <span className="fa fa-power-off"></span> Logout
                            </button>
                        </li>
                    </ul>
                )}
            </div>
        </header>
    );
};

export default TeacherHeader;

import frame27Bg from "../../resource/report/Frame 27.png";
import polygon3Image from "../../resource/report/Polygon 3.png";
import polygon2Image from "../../resource/report/Polygon 2.png";

const ReportBackCover = () => (
    <div className="report-page report-page-22">
        <img src={frame27Bg} alt="" className="p22-bg" />
        <img src={polygon3Image} alt="" className="p22-polygon3" />

        <span className="p22-word p22-we">WE</span>
        <span className="p22-word p22-build">BUILD</span>
        <span className="p22-word p22-win">WIN</span>
        <span className="p22-word p22-together">TOGETHER</span>

        <p className="p22-quote">" 성과를 설계하는 전략적 파트너 "</p>

        <div className="p22-divider"></div>

        <img src={process.env.PUBLIC_URL + "/q_logo.png"} alt="QUANTUM EDU SOLUTION" className="p22-logo" />

        <div className="p22-contact-card">
            <p className="p22-director">Director :  김영천 Ph.D.</p>
            <p className="p22-contact">yckim@qtedu.kr &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; 02-6953-9788</p>
        </div>

        <img src={polygon2Image} alt="" className="p22-polygon2" />

        <p className="p22-confidential">CONFIDENTIAL &amp; PROPRIETARY</p>
        <p className="p22-notice">
            This document contains proprietary information and intellectual property of Quantum Edu Solution.
            <br />
            It is submitted to the client on a confidential basis and may not be reproduced, shared,
            <br />
            or distributed without prior written permission.
        </p>
        <p className="p22-copyright">Copyright © 2026 Quantum Edu Solution. All Rights Reserved.</p>
    </div>
);

export default ReportBackCover;

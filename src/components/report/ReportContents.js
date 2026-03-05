import polygon3Image from "../../resource/report/Polygon 3.png";
import polygon2Image from "../../resource/report/Polygon 2.png";

const getSectionData = (idx) => {
    switch (idx) {
        case 0: return {
            title: "I. Performance Profile (성과 인식 프로파일)",
            quote: <>{"\u201C"} 우리는 지금 성과를 어떻게 인식하고 있는가? {"\u201D"}</>,
            desc: <>성과를 결과로 보고 있는지,<br />아니면 구조와 체질의 문제로 보고 있는지를 점검합니다.</>,
        };
        case 1: return {
            title: "II. Strategic Identity (미래 방향성에 대한 인식)",
            quote: <>{"\u201C"} 어떤 성과를 만들어내는 조직이 되고자 하는가? {"\u201D"}</>,
            desc: <>환경 변화와 내부 한계를 바탕으로<br />앞으로의 성과 방향과 정체성을 재정의합니다.</>,
        };
        case 2: return {
            title: "III. Performance Stream (전략 목표에 대한 인식)",
            quote: <>{"\u201C"} 그 방향이 성과로 나타나려면,<br />무엇을 목표와기준으로 설정해야 하는가? {"\u201D"}</>,
            desc: "비전을 실행 가능한 전략목표와 성과 기준으로 전환합니다.",
        };
        case 3: return {
            title: "IV. Quick & Build Win(실행과제 제안과 평가)",
            quote: <>{"\u201C"} 그 방향이 성과로 나타나려면,<br />무엇을 목표와기준으로 설정해야 하는가? {"\u201D"}</>,
            desc: "비전을 실행 가능한 전략목표와 성과 기준으로 전환합니다.",
        };
        default: return null;
    }
};

const ReportContents = ({ activeSection }) => {
    const activeIdx = activeSection - 1;
    const pageClassMap = { 1: 3, 2: 5, 3: 8, 4: 16 };

    return (
        <div className={`report-page report-page-${pageClassMap[activeSection]}`}>
            <h2 className="p3-title">CONTENTS</h2>

            {[0, 1, 2, 3].map((idx) => {
                const section = getSectionData(idx);
                const isActive = idx === activeIdx;

                return (
                    <div key={idx}>
                        {isActive ? (
                            <div className="p3-main-box" style={idx === 0 ? undefined : undefined}>
                                <h3 className="p3-main-heading">{section.title}</h3>
                                <p className="p3-main-quote">{section.quote}</p>
                                <p className="p3-main-desc">{section.desc}</p>
                            </div>
                        ) : (
                            <div className="p3-section-box" style={idx === 0 ? { marginTop: '128px' } : undefined}>
                                <p className="p3-section-text">{section.title}</p>
                            </div>
                        )}
                        {idx < 3 && <div className="p3-divider"></div>}
                    </div>
                );
            })}

            <img src={polygon3Image} alt="" className="p3-polygon3" />
            <img src={polygon2Image} alt="" className="p3-polygon2" />
        </div>
    );
};

export default ReportContents;

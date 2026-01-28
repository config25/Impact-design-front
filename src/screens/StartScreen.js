import "./StartScreen.css";
import backgroundImage from "../resource/start/background.jpg";
import isolationIcon1 from "../resource/start/_격리_모드.png";
import isolationIcon2 from "../resource/start/_격리_모드2.png";
import isolationIcon3 from "../resource/start/_격리_모드3.png";
import isolationIcon4 from "../resource/start/_격리_모드4.png";
import isolationIcon5 from "../resource/start/_격리_모드5.png";
import isolationIcon6 from "../resource/start/_격리_모드6.png";

const StartScreen = ({ onStart }) => {
    const canvasItems = [
        {
            koreanTitle: "성과관리 현황진단",
            englishTitle: "IMPACT",
            englishSubtitle: "Check",
            iconImage: isolationIcon1
        },
        {
            koreanTitle: "정체성 설계",
            englishTitle: "Strategic",
            englishSubtitle: "Identity Canvas",
            iconImage: isolationIcon2
        },
        {
            koreanTitle: "성과경로 설계",
            englishTitle: "Performance",
            englishSubtitle: "Flow Canvas",
            iconImage: isolationIcon3
        },
        {
            koreanTitle: "전술적 실행과제",
            englishTitle: "Quick Win",
            englishSubtitle: "Canvas",
            iconImage: isolationIcon4
        },
        {
            koreanTitle: "전략적 실행과제",
            englishTitle: "Build Win",
            englishSubtitle: "Canvas",
            iconImage: isolationIcon5
        },
        {
            koreanTitle: "실행과제 검증",
            englishTitle: "IMPACT",
            englishSubtitle: "Review",
            iconImage: isolationIcon6
        }
    ];

    return (
        <div
            className="start-screen"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="start-overlay">
                <div className="start-content">
                    <p className="start-subtitle">
                        압도적 성과조직을 만드는 네 가지 Performance Secret
                    </p>
                    <h1 className="start-title">Impact Design Canvas</h1>

                    <button className="start-button" onClick={onStart}>
                        시작하기
                    </button>

                    <div className="canvas-items-container">
                        {canvasItems.map((item, index) => (
                            <div key={index} className="canvas-item-wrapper">
                                <div className="canvas-item">
                                    <div className="canvas-text-group">
                                        <span className="canvas-korean-title">{item.koreanTitle}</span>
                                        <span className="canvas-english-title">{item.englishTitle}</span>
                                        {item.englishSubtitle && (
                                            <span className="canvas-english-subtitle">{item.englishSubtitle}</span>
                                        )}
                                        {item.englishSubtitle2 && (
                                            <span className="canvas-english-subtitle">{item.englishSubtitle2}</span>
                                        )}
                                    </div>
                                    {item.iconImage ? (
                                        <img src={item.iconImage} alt="" className="canvas-icon-img" />
                                    ) : (
                                        <span className="canvas-icon">{item.icon}</span>
                                    )}
                                </div>
                                {index < canvasItems.length - 1 && (
                                    <div className="canvas-arrow"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartScreen;

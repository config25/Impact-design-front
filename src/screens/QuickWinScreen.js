import WinCanvasScreen from "./WinCanvasScreen";
import "./QuickWinScreen.css";
import component1 from "../resource/quick/Component 1.png";
import vector3 from "../resource/quick/Vector 3.png";
import { getQuickWinCanvas, saveQuickWinCanvas, submitQuickWinCanvas } from "../services/quickWinCanvasService";

const quickConfig = {
    containerClass: "quickwin-container",
    headerClass: "quickwin-header",
    contentClass: "quickwin-content",
    activeScreen: "quickwin",
    stepNumber: "3",
    stepBadgeImg: component1,
    stepBadgeVector: vector3,
    title: "Quick Win Canvas",
    titleSub: "(전술적 실행과제)",
    headerDesc: [
        "Quick Win은 전략목표 달성을 가로막는 장애물을 빠르게 제거하여 단기적으로 가시적인 성과를 만들어내는 실행과제입니다.",
        "이 Quick Win이 실행되지 않으면, 우리는 지금 만들 수 있는 성과를 계속 '놓치게' 됩니다.",
    ],
    colorClass: "cyan",
    labelPrefix: "전술적",
    placeholders: {
        alignment: "이 과제는 회사의 어떤 전략목표(방향)와 연계되어 있습니까?",
        taskName: "이 과제를 한 문장으로 표현하면, '무엇을 제거/해결하는 과제'입니까?",
        taskContent: "이 과제를 실행하면 [어떤 문제]가 해결되어 [어떤 결과]가 나올 것이라고 확신합니까?",
        signal: "지금 이 과제를 실행해야 할 이유나 신호(Signal)는 무엇입니까?",
        signalQuestion: ["지금 이 과제를 실행해야 할", "이유나 신호(Signal)는 무엇입니까?"],
        signalExample: "(예: 매출하락, 고객이탈 등)",
        painPoint: "성과를 막고 문제를 발생시키는 구체적인 '장애물(Bottleneck)'은 무엇입니까?",
        painPointQuestion: ["성과를 막고 문제를 발생시키는 구체적인", "'장애물(Bottleneck)'은 무엇입니까?"],
        painPointExample: "(예: 시스템 오류 등)",
        qualitative: "현장에서 가장 먼저 체감되는 변화는 무엇입니까?",
        quantitative: "6개월 내 수치로 확인 가능한 변화는 무엇입니까?",
    },
    subHeaders: {
        signal: "위기의 신호 (Crisis Signal)",
        procedure: "추진 절차",
        content: "주요 내용",
    },
    outputExamples: [
        "(업무 매뉴얼, 체크리스트,",
        "개선된 양식, 분석 보고서,",
        "시범 운영 결과 등)",
    ],
    tipsModal: {
        title: "전술적 실행과제",
        concept: `Quick Win Canvas는 전략목표 달성을 가로막는 장애물을 빠르게 제거하여, 단기간에 가시적 성과를 만들어내는 전술적 실행과제를 설계하는 도구입니다.\n\nQuick Win이 실행되지 않으면, 지금 당장 만들 수 있는 성과를 계속 놓치게 됩니다.`,
        method: `1. 전략목표 Alignment: 이 과제가 연계된 전략목표(방향)를 명확히 합니다.\n2. 전술적 실행과제: 과제명과 주요 내용을 구체적으로 작성합니다.\n   - 과제명은 '무엇을 제거/해결하는 과제'인지 한 문장으로 표현\n3. 상황(Situation): 위기의 신호와 Pain/Touch point를 분석합니다.\n4. 투입(Input) → 활동(Activity) → 산출(Outputs): 필요 자원, 추진 절차, 팀워크를 논리적 흐름으로 작성합니다.\n5. 성과(Outcomes): 정성적 효과(체감 변화)와 정량적 효과(측정 가능 변화)를 구분하여 작성합니다.`,
    },
    serviceFns: {
        get: getQuickWinCanvas,
        save: saveQuickWinCanvas,
        submit: submitQuickWinCanvas,
    },
};

const QuickWinScreen = (props) => <WinCanvasScreen {...props} {...quickConfig} />;

export default QuickWinScreen;

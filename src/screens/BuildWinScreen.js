import WinCanvasScreen from "./WinCanvasScreen";
import "./BuildWinScreen.css";
import component1 from "../resource/build/Component 1.png";
import vector3 from "../resource/build/Vector 3.png";
import { getBuildWinCanvas, saveBuildWinCanvas, submitBuildWinCanvas } from "../services/buildWinCanvasService";

const buildConfig = {
    containerClass: "buildwin-container",
    headerClass: "buildwin-header",
    contentClass: "buildwin-content",
    activeScreen: "buildwin",
    stepNumber: "4",
    stepBadgeImg: component1,
    stepBadgeVector: vector3,
    title: "Build Win Canvas",
    titleSub: "(전략적 실행과제)",
    headerDesc: [
        "Build Win은 단기 성과를 만드는 과제가 아니라, 성과가 반복되게 만드는 '체질'을 바꾸는 과제입니다.",
        "이 Build Win이 성공하면, 우리는 한 차원 높은 성과창출 역량을 확보하게 됩니다.",
    ],
    colorClass: "purple",
    labelPrefix: "전략적",
    placeholders: {
        alignment: "Build Win을 통해 중·장기적으로 바꾸고자 하는 '성과가 만들어지는 방식'은 무엇입니까?",
        taskName: "이 과제를 한 문장으로 정의하면, '무엇을 새로 만들거나 바꾸는 과제'입니까?",
        taskContent: "이 과제가 완료되면, 조직의 어떤 기준·구조·역량이 달라집니까?",
        signal: "지금의 성과 방식이 중·장기적으로 지속되기 어렵다고 판단되는 신호는 무엇입니까?",
        signalQuestion: ["지금의 성과 방식이 중·장기적으로 지속되기", "어렵다고 판단되는 신호는 무엇입니까?"],
        signalExample: "(예: 매출하락, 고객이탈 등)",
        painPoint: "지금 성과가 나더라도, 앞으로 해결되지 않으면 결국 반복될 문제는 무엇입니까?",
        painPointQuestion: ["지금 성과가 나더라도, 앞으로 해결되지 않으면", "결국 반복될 문제는 무엇입니까?"],
        painPointExample: "(예: 복잡한 의사결정 구조 등)",
        qualitative: "현장에서 가장 먼저 체감되는 변화는 무엇입니까?",
        quantitative: "6~18개월 내 추세로 확인 가능한 변화는 무엇입니까?",
    },
    subHeaders: {
        signal: "변화의 신호(Trigger)",
        procedure: "전환 단계",
        content: "전환 활동",
    },
    outputExamples: [
        "(기준 / 규칙 프로세스",
        "/ 체계 시스템 / 플랫폼",
        "역할 정의 등)",
    ],
    tipsModal: {
        title: "전략적 실행과제",
        concept: `Build Win Canvas는 단기 성과를 만드는 과제가 아니라, 성과가 반복되게 만드는 '체질'을 바꾸는 중장기적 전략 실행과제를 설계하는 도구입니다.\n\nBuild Win이 성공하면, 조직은 한 차원 높은 성과창출 역량을 확보하게 됩니다.`,
        method: `1. 전략목표 Alignment: Build Win을 통해 중·장기적으로 바꾸고자 하는 '성과 방식'을 명확히 합니다.\n2. 전략적 실행과제: 과제명과 주요 내용을 구체적으로 작성합니다.\n   - 과제명은 '무엇을 새로 만들거나 바꾸는 과제'인지 한 문장으로 정의\n3. 상황(Situation): 변화의 신호(Trigger)와 Pain/Touch point를 분석합니다.\n4. 투입(Input) → 활동(Activity) → 산출(Outputs): 필요 자원, 전환 단계, 팀워크를 논리적 흐름으로 작성합니다.\n5. 성과(Outcomes): 정성적 효과(체감 변화)와 정량적 효과(측정 가능 변화)를 구분하여 작성합니다.`,
    },
    serviceFns: {
        get: getBuildWinCanvas,
        save: saveBuildWinCanvas,
        submit: submitBuildWinCanvas,
    },
};

const BuildWinScreen = (props) => <WinCanvasScreen {...props} {...buildConfig} />;

export default BuildWinScreen;

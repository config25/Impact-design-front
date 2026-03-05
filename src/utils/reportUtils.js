export const calculateScores = (impactCheckScores) => {
    if (!impactCheckScores || impactCheckScores.length === 0) {
        return { performanceGoal: 0, execution: 0, identity: 0, system: 0, performanceCreation: 0, futureCompetitiveness: 0 };
    }

    let totalPerformanceGoal = 0, totalExecution = 0, totalIdentity = 0, totalSystem = 0;
    const count = impactCheckScores.length;

    impactCheckScores.forEach(score => {
        totalPerformanceGoal += (score.q4Score + score.q5Score + score.q6Score) / 3;
        totalExecution += (score.q7Score + score.q8Score + score.q9Score) / 3;
        totalIdentity += (score.q1Score + score.q2Score + score.q3Score) / 3;
        totalSystem += (score.q10Score + score.q11Score + score.q12Score) / 3;
    });

    const performanceGoal = (totalPerformanceGoal / count).toFixed(2);
    const execution = (totalExecution / count).toFixed(2);
    const identity = (totalIdentity / count).toFixed(2);
    const system = (totalSystem / count).toFixed(2);
    const performanceCreation = ((parseFloat(performanceGoal) + parseFloat(execution)) / 2).toFixed(2);
    const futureCompetitiveness = ((parseFloat(identity) + parseFloat(system)) / 2).toFixed(2);

    return { performanceGoal, execution, identity, system, performanceCreation, futureCompetitiveness };
};

export const getProfileType = (performanceCreation, futureCompetitiveness) => {
    const coordY = parseFloat(performanceCreation);
    const coordX = parseFloat(futureCompetitiveness);

    if (coordX >= 3 && coordY >= 3) {
        return {
            name: "Impact Player",
            korean: "(지속가능한 리더)",
            quadrant: "TR",
            tagline: "높은 효능감과 시스템이 조화를 이룬 '확신'의 단계",
            diagnosis: "구성원들은 현재의 성과뿐만 아니라, 미래를 위한 시스템과 비전에 대해서도 매우 긍정적으로 '인식(Perception)'하고 있습니다. 이는 조직의 성공 방식에 대한 내부 신뢰가 높다는 뜻이며, 성과와 시스템이 균형을 이룬 이상적인 상태입니다. 다만, 이 확신이 '자만'이 되지 않도록 현재의 성공을 객관화하는 작업이 필요합니다.",
            solution: "지금의 성과는 '우연'이 아닙니다. 이 성공 모델을 조직 전체의 '표준(Standard)'으로 만들어야 합니다. 첫째, 특정 고성과자(High Performer)들의 암묵적인 노하우를 발굴하여 조직의 공용 자산으로 만드십시오. 둘째, 이 성공 방정식을 다른 부서나 차세대 리더들에게 확산(Spread)하여, 리더 한 명의 역량이 아닌 '시스템의 힘'으로 성과가 재생산되는 선순환 구조를 완성하십시오."
        };
    }
    if (coordX < 3 && coordY >= 3) {
        return {
            name: "Burnout Runner",
            korean: "(지쳐가는 러너)",
            quadrant: "TL",
            tagline: "높은 성과 '인식'과 취약한 '기반'의 딜레마",
            diagnosis: "구성원들은 현재 조직의 성과 창출 수준을 매우 높게 '인식(Perception)'하고 있습니다. 그러나 이는 탄탄한 시스템이나 명확한 목표 의식에 기반한 것이 아니라, 단순히 \"우리는 열심히 하고 있다\"는 주관적 자신감일 가능성이 큽니다. 지속가능한 성과 창출 시스템이 빈약하다고 판단하고 있기 때문에, 작은 환경 변화에도 그 자신감이 쉽게 무너질 수 있는 구조적 취약성을 안고 있습니다.",
            solution: "지금 필요한 것은 막연한 '열심'이 아니라, 성공을 담아낼 그릇인 '시스템'입니다. 첫째, 구성원들이 동일한 곳을 바라볼 수 있도록 명확한 목표(Clear Goal)를 재설정하여 방향성을 정렬(Alignment)해야 합니다. 둘째, 개인의 암묵지에 의존하던 업무 방식을 프로세스로 자산화하여, 어떤 환경 변화에도 흔들리지 않는 '이기는 구조'를 구축하십시오."
        };
    }
    if (coordX >= 3 && coordY < 3) {
        return {
            name: "Idle Dreamer",
            korean: "(잠자는 몽상가)",
            quadrant: "BR",
            tagline: "이상적인 '계획'과 빈약한 '실행'의 괴리 단계",
            diagnosis: "구성원들은 현재 조직의 성과 창출 수준을 매우 높게 '인식(Perception)'하고 있습니다. 그러나 이는 탄탄한 시스템이나 명확한 목표 의식에 기반한 것이 아니라, 단순히 \"우리는 열심히 하고 있다\"는 주관적 자신감일 가능성이 큽니다. 지속가능한 성과 창출 시스템이 빈약하다고 판단하고 있기 때문에, 작은 환경 변화에도 그 자신감이 쉽게 무너질 수 있는 구조적 취약성을 안고 있습니다.",
            solution: "책상 위의 완벽주의를 버리고, 거칠더라도 현장에서 부딪히는 '야생성(Wildness)'을 회복해야 합니다. 첫째, 계획 수립에 쓰는 시간을 절반으로 줄이고, 즉시 실행하고 실패를 통해 수정하는 '애자일(Agile) 방식'을 도입하십시오. 둘째, 말이 아닌 '행동'과 '결과'로 평가받는 문화를 정착시켜, 조직의 무게중심을 '생각'에서 '실행'으로 옮겨야 합니다."
        };
    }
    return {
        name: "Survival Walker",
        korean: "(생존형 보행자)",
        quadrant: "BL",
        tagline: "성과와 방향성을 모두 상실한 '위기 의식'의 단계",
        diagnosis: "구성원들은 현재의 성과 창출력도 낮고, 미래를 위한 준비도 부족하다고 인식(Perception)하고 있습니다. 이는 단순한 실적 부진을 넘어, 조직이 어디로 가야 할지 모른다는 '방향 상실감'과 해도 안 된다는 '무기력함'이 팽배해 있음을 시사합니다. 비전보다 생존이 급한 위험 신호입니다.",
        solution: "지금 필요한 것은 거창한 '비전 선포'가 아니라, 당장 눈앞의 '작은 성공(Small Win)'입니다. 첫째, 불필요한 업무와 형식적인 절차를 과감히 제거(Cut)하여 구성원들의 숨통을 틔워주어야 합니다. 둘째, 단기간에 달성 가능한 구체적인 목표를 부여하고 이를 성취하게 함으로써, 바닥에 떨어진 조직의 '자기 효능감'부터 회복하는 것이 급선무입니다."
    };
};

export const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const getPageNumber = (has11P, has13P, has15P, basePage) => {
    let offset = 0;
    if (basePage > 10 && !has11P) offset -= 1;
    if (basePage > 12 && !has13P) offset -= 1;
    if (basePage > 14 && !has15P) offset -= 1;
    return basePage + offset;
};

export const blueprintSteps = [
    {
        roman: "I",
        tag: "인식",
        tagColor: "#B8C1DB",
        title: "Performance\nProfile",
        subtitle: "성과인식 프로파일",
        question: "우리는 성과를\n어떻게 바라보는가?",
    },
    {
        roman: "II",
        tag: "방향",
        tagColor: "#8494BF",
        title: "Strategic\nIdentity",
        subtitle: "미래의 정체성 확립",
        question: "우리는 어디로\n어떻게 가야 하는가?",
    },
    {
        roman: "III",
        tag: "기준",
        tagColor: "#5E72A9",
        title: "Performance\nStream",
        subtitle: "성과와 행동의 기준",
        question: "우리의 목표와\n기준은 무엇인가?",
    },
    {
        roman: "IV",
        tag: "실행",
        tagColor: "#314A8F",
        title: "Quick &\nBuild Win",
        subtitle: "단기/중장기 실행과제",
        question: "당장 무엇을\n실행할 것인가?",
    },
];

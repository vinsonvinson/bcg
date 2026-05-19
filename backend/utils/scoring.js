// 5C Scoring Logic

const toNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
};

const calculateCharacterScore = (scores) => {
    const willingness = toNumber(scores.willingness ?? scores.willingnessScore);
    const integrity = toNumber(scores.integrity ?? scores.integrityScore);
    const personalRisk = toNumber(
        scores.personalRisk ?? scores.personalRiskScore,
    );
    const socialRelation = toNumber(
        scores.socialRelation ?? scores.socialRelationScore,
    );
    return (willingness + integrity + personalRisk + socialRelation) / 4;
};

const calculateCapacityScore = (scores) => {
    const management = toNumber(
        scores.management ?? scores.managementSkillScore,
    );
    const experience = toNumber(
        scores.experience ?? scores.businessExperienceScore,
    );
    const production = toNumber(
        scores.production ?? scores.productionCapacityScore,
    );
    const costProductivity = toNumber(
        scores.costProductivity ?? scores.costProductivityScore,
    );
    const equipment = toNumber(
        scores.equipment ?? scores.equipmentSupportScore,
    );
    const sales = toNumber(scores.sales ?? scores.salesProfitScore);
    return (
        (management +
            experience +
            production +
            costProductivity +
            equipment +
            sales) /
        6
    );
};

const calculateCapitalScore = (scores) => {
    const capitalPosition = toNumber(
        scores.capitalPosition ?? scores.capitalPositionScore,
    );
    const debtPosition = toNumber(
        scores.debtPosition ?? scores.debtPositionScore,
    );
    const personalContribution = toNumber(
        scores.personalContribution ?? scores.personalContributionScore,
    );
    const receivableStock = toNumber(
        scores.receivableStock ?? scores.receivableStockScore,
    );
    return (
        (capitalPosition +
            debtPosition +
            personalContribution +
            receivableStock) /
        4
    );
};

const calculateCollateralScore = (scores) => {
    const type = toNumber(scores.type ?? scores.collateralTypeScore);
    const marketability = toNumber(
        scores.marketability ?? scores.collateralMarketabilityScore,
    );
    const binding = toNumber(scores.binding ?? scores.collateralBindingScore);
    const ltv = toNumber(scores.ltv ?? scores.ltvRatioScore);
    return (type + marketability + binding + ltv) / 4;
};

const calculateConditionScore = (scores) => {
    const market = toNumber(scores.market ?? scores.marketConditionScore);
    const material = toNumber(
        scores.material ?? scores.materialAvailabilityScore,
    );
    const distribution = toNumber(
        scores.distribution ?? scores.distributionSupportScore,
    );
    const regulation = toNumber(
        scores.regulation ?? scores.regulationLegalityScore,
    );
    return (market + material + distribution + regulation) / 4;
};

const calculateTotalScore = (
    characterScore,
    capacityScore,
    capitalScore,
    collateralScore,
    conditionScore,
) => {
    const total =
        characterScore * 0.3 +
        capacityScore * 0.25 +
        capitalScore * 0.15 +
        collateralScore * 0.2 +
        conditionScore * 0.1;
    return Number.isFinite(total) ? total : 0;
};

const mapToRiskZone = (totalScore) => {
    const score = toNumber(totalScore);

    if (score >= 4.1 && score <= 5.0) {
        return {
            zone: "HIJAU TUA",
            riskLevel: "Risiko Diterima (Accept Risk)",
            decision: "Disetujui tanpa syarat tambahan.",
            color: "#4CAF50",
        };
    }

    if (score >= 3.5 && score < 4.1) {
        return {
            zone: "HIJAU MUDA",
            riskLevel: "Risiko Dimitigasi (Mitigate Risk)",
            decision: "Disetujui dengan syarat mitigasi.",
            color: "#8BC34A",
        };
    }

    if (score >= 3.0 && score < 3.5) {
        return {
            zone: "KUNING",
            riskLevel: "Risiko Dipindahkan (Transfer Risk)",
            decision: "Disetujui dengan tambahan agunan.",
            color: "#FFC107",
        };
    }

    return {
        zone: "MERAH",
        riskLevel: "Risiko Dihindari (Avoid Risk)",
        decision: "Otomatis ditolak.",
        color: "#F44336",
    };
};

const generateAssessmentCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
    return `ASS-${timestamp}${random}`;
};

module.exports = {
    calculateCharacterScore,
    calculateCapacityScore,
    calculateCapitalScore,
    calculateCollateralScore,
    calculateConditionScore,
    calculateTotalScore,
    mapToRiskZone,
    generateAssessmentCode,
};

const Assessment = require("../models/Assessment");
const Score = require("../models/Score");
const {
    generateAssessmentCode,
    calculateCharacterScore,
    calculateCapacityScore,
    calculateCapitalScore,
    calculateCollateralScore,
    calculateConditionScore,
    calculateTotalScore,
    mapToRiskZone,
} = require("../utils/scoring");
const { generateExcelReport } = require("../utils/excel");

const AssessmentController = {
    async createAssessment(req, res) {
        try {
            const { business_name, product_name, assessment_date } = req.body;
            const assessmentCode = generateAssessmentCode();
            const assessmentDate =
                assessment_date || new Date().toISOString().slice(0, 10);

            const assessmentId = await Assessment.create({
                assessment_code: assessmentCode,
                business_name,
                product_name,
                assessment_date: assessmentDate,
                analyst_id: req.user.id,
            });

            res.status(201).json({
                message: "Assessment created successfully",
                assessmentId,
                assessmentCode,
            });
        } catch (error) {
            console.error("Create assessment error:", error);
            res.status(500).json({ error: "Failed to create assessment" });
        }
    },

    async getAssessment(req, res) {
        try {
            const { id } = req.params;

            const assessment = await Assessment.getById(id);

            if (!assessment) {
                return res.status(404).json({ error: "Assessment not found" });
            }

            const scores = await Score.getScoresByAssessmentId(id);

            res.json({
                assessment,
                scores,
            });
        } catch (error) {
            console.error("Get assessment error:", error);
            res.status(500).json({ error: "Failed to get assessment" });
        }
    },

    async getAllAssessments(req, res) {
        try {
            const { status, risk_zone } = req.query;
            const filters = {
                analyst_id: req.user.id,
            };

            if (status) filters.status = status;
            if (risk_zone) filters.risk_zone = risk_zone;

            const assessments = await Assessment.getAll(filters);

            res.json({
                count: assessments.length,
                assessments,
            });
        } catch (error) {
            console.error("Get assessments error:", error);
            res.status(500).json({ error: "Failed to get assessments" });
        }
    },

    async submitScores(req, res) {
        try {
            const { id } = req.params;
            const {
                characterScores,
                capacityScores,
                capitalScores,
                collateralScores,
                conditionScores,
            } = req.body;

            const assessment = await Assessment.getById(id);
            if (!assessment) {
                return res.status(404).json({ error: "Assessment not found" });
            }

            await Score.createCharacterScore(id, {
                willingness: characterScores.willingness,
                integrity: characterScores.integrity,
                personalRisk: characterScores.personalRisk,
                socialRelation: characterScores.socialRelation,
                average: calculateCharacterScore(characterScores),
            });

            await Score.createCapacityScore(id, {
                management: capacityScores.management,
                experience: capacityScores.experience,
                production: capacityScores.production,
                costProductivity: capacityScores.costProductivity,
                equipment: capacityScores.equipment,
                sales: capacityScores.sales,
                average: calculateCapacityScore(capacityScores),
            });

            await Score.createCapitalScore(id, {
                capitalPosition: capitalScores.capitalPosition,
                debtPosition: capitalScores.debtPosition,
                personalContribution: capitalScores.personalContribution,
                receivableStock: capitalScores.receivableStock,
                average: calculateCapitalScore(capitalScores),
            });

            await Score.createCollateralScore(id, {
                type: collateralScores.type,
                marketability: collateralScores.marketability,
                binding: collateralScores.binding,
                ltv: collateralScores.ltv,
                average: calculateCollateralScore(collateralScores),
            });

            await Score.createConditionScore(id, {
                market: conditionScores.market,
                material: conditionScores.material,
                distribution: conditionScores.distribution,
                regulation: conditionScores.regulation,
                average: calculateConditionScore(conditionScores),
            });

            const charScore = calculateCharacterScore(characterScores);
            const capScore = calculateCapacityScore(capacityScores);
            const capitalScore = calculateCapitalScore(capitalScores);
            const collScore = calculateCollateralScore(collateralScores);
            const condScore = calculateConditionScore(conditionScores);
            const totalScore = calculateTotalScore(
                charScore,
                capScore,
                capitalScore,
                collScore,
                condScore,
            );
            const riskZone = mapToRiskZone(totalScore);

            const status =
                riskZone.zone === "MERAH"
                    ? "Risiko_Dihindari"
                    : riskZone.zone === "KUNING"
                      ? "Risiko_Dipindahkan"
                      : riskZone.zone === "HIJAU MUDA"
                        ? "Risiko_Dimitigasi"
                        : "Risiko_Diterima";

            await Assessment.update(id, {
                total_score: totalScore,
                risk_zone: riskZone.zone,
                status,
            });

            res.json({
                message: "Scores submitted successfully",
                scores: {
                    characterScore: charScore.toFixed(2),
                    capacityScore: capScore.toFixed(2),
                    capitalScore: capitalScore.toFixed(2),
                    collateralScore: collScore.toFixed(2),
                    conditionScore: condScore.toFixed(2),
                    totalScore: totalScore.toFixed(2),
                    riskZone,
                },
            });
        } catch (error) {
            console.error("Submit scores error:", error);
            res.status(500).json({ error: "Failed to submit scores" });
        }
    },

    async exportToExcel(req, res) {
        try {
            const { id } = req.params;

            const assessment = await Assessment.getById(id);
            if (!assessment) {
                return res.status(404).json({ error: "Assessment not found" });
            }

            const { mapToRiskZone } = require("../utils/scoring");

            const scores = await Score.getScoresByAssessmentId(id);

            const scores_obj = {
                characterScore: scores.character?.average_score || 0,
                capacityScore: scores.capacity?.average_score || 0,
                capitalScore: scores.capital?.average_score || 0,
                collateralScore: scores.collateral?.average_score || 0,
                conditionScore: scores.condition?.average_score || 0,

                characterDetail: scores.character || {},
                capacityDetail: scores.capacity || {},
                capitalDetail: scores.capital || {},
                collateralDetail: scores.collateral || {},
                conditionDetail: scores.condition || {},

                totalScore: assessment.total_score,
                riskZone: mapToRiskZone(assessment.total_score),
            };

            const workbook = await generateExcelReport(assessment, scores_obj);

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            );
            res.setHeader(
                "Content-Disposition",
                `attachment; filename=Assessment-${assessment.assessment_code}.xlsx`,
            );

            await workbook.xlsx.write(res);

            res.end();
        } catch (error) {
            console.error("Export error:", error);
            res.status(500).json({ error: "Failed to export assessment" });
        }
    },

    async getAdminAssessments(req, res) {
        try {
            const { status, risk_zone, page = 1, limit = 10 } = req.query;
            const filters = {};

            if (status) filters.status = status;
            if (risk_zone) filters.risk_zone = risk_zone;

            const assessments = await Assessment.getAll(filters);

            const startIndex = (page - 1) * limit;
            const paginatedAssessments = assessments.slice(
                startIndex,
                startIndex + parseInt(limit),
            );

            res.json({
                total: assessments.length,
                page: parseInt(page),
                limit: parseInt(limit),
                count: paginatedAssessments.length,
                assessments: paginatedAssessments,
            });
        } catch (error) {
            console.error("Get assessments error:", error);
            res.status(500).json({ error: "Failed to get assessments" });
        }
    },
};

module.exports = AssessmentController;

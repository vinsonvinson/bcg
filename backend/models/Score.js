const pool = require("../config/database");

const Score = {
    async createCharacterScore(assessmentId, scores) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                "INSERT INTO character_scores (assessment_id, willingness_score, integrity_score, personal_risk_score, social_relation_score, average_score) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    assessmentId,
                    scores.willingness,
                    scores.integrity,
                    scores.personalRisk,
                    scores.socialRelation,
                    scores.average,
                ],
            );
            return result.insertId;
        } finally {
            connection.release();
        }
    },

    async createCapacityScore(assessmentId, scores) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                "INSERT INTO capacity_scores (assessment_id, management_skill_score, business_experience_score, production_capacity_score, cost_productivity_score, equipment_support_score, sales_profit_score, average_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    assessmentId,
                    scores.management,
                    scores.experience,
                    scores.production,
                    scores.costProductivity,
                    scores.equipment,
                    scores.sales,
                    scores.average,
                ],
            );
            return result.insertId;
        } finally {
            connection.release();
        }
    },

    async createCapitalScore(assessmentId, scores) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                "INSERT INTO capital_scores (assessment_id, capital_position_score, debt_position_score, personal_contribution_score, receivable_stock_score, average_score) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    assessmentId,
                    scores.capitalPosition,
                    scores.debtPosition,
                    scores.personalContribution,
                    scores.receivableStock,
                    scores.average,
                ],
            );
            return result.insertId;
        } finally {
            connection.release();
        }
    },

    async createCollateralScore(assessmentId, scores) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                "INSERT INTO collateral_scores (assessment_id, collateral_type_score, collateral_marketability_score, collateral_binding_score, ltv_ratio_score, average_score) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    assessmentId,
                    scores.type,
                    scores.marketability,
                    scores.binding,
                    scores.ltv,
                    scores.average,
                ],
            );
            return result.insertId;
        } finally {
            connection.release();
        }
    },

    async createConditionScore(assessmentId, scores) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                "INSERT INTO condition_scores (assessment_id, market_condition_score, material_availability_score, distribution_support_score, regulation_legality_score, average_score) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    assessmentId,
                    scores.market,
                    scores.material,
                    scores.distribution,
                    scores.regulation,
                    scores.average,
                ],
            );
            return result.insertId;
        } finally {
            connection.release();
        }
    },

    async getScoresByAssessmentId(assessmentId) {
        const connection = await pool.getConnection();
        try {
            const [character] = await connection.execute(
                "SELECT * FROM character_scores WHERE assessment_id = ?",
                [assessmentId],
            );
            const [capacity] = await connection.execute(
                "SELECT * FROM capacity_scores WHERE assessment_id = ?",
                [assessmentId],
            );
            const [capital] = await connection.execute(
                "SELECT * FROM capital_scores WHERE assessment_id = ?",
                [assessmentId],
            );
            const [collateral] = await connection.execute(
                "SELECT * FROM collateral_scores WHERE assessment_id = ?",
                [assessmentId],
            );
            const [condition] = await connection.execute(
                "SELECT * FROM condition_scores WHERE assessment_id = ?",
                [assessmentId],
            );

            // MAPPING: Menyesuaikan raw data (snake_case) dari MySQL menjadi camelCase untuk sisa aplikasi
            return {
                character: character[0]
                    ? {
                          willingness: character[0].willingness_score,
                          integrity: character[0].integrity_score,
                          personalRisk: character[0].personal_risk_score,
                          socialRelation: character[0].social_relation_score,
                          average_score: character[0].average_score,
                      }
                    : null,

                capacity: capacity[0]
                    ? {
                          management: capacity[0].management_skill_score,
                          experience: capacity[0].business_experience_score,
                          production: capacity[0].production_capacity_score,
                          costProductivity: capacity[0].cost_productivity_score,
                          equipment: capacity[0].equipment_support_score,
                          sales: capacity[0].sales_profit_score,
                          average_score: capacity[0].average_score,
                      }
                    : null,

                capital: capital[0]
                    ? {
                          capitalPosition: capital[0].capital_position_score,
                          debtPosition: capital[0].debt_position_score,
                          personalContribution:
                              capital[0].personal_contribution_score,
                          receivableStock: capital[0].receivable_stock_score,
                          average_score: capital[0].average_score,
                      }
                    : null,

                collateral: collateral[0]
                    ? {
                          type: collateral[0].collateral_type_score,
                          marketability:
                              collateral[0].collateral_marketability_score,
                          binding: collateral[0].collateral_binding_score,
                          ltv: collateral[0].ltv_ratio_score,
                          average_score: collateral[0].average_score,
                      }
                    : null,

                condition: condition[0]
                    ? {
                          market: condition[0].market_condition_score,
                          material: condition[0].material_availability_score,
                          distribution: condition[0].distribution_support_score,
                          regulation: condition[0].regulation_legality_score,
                          average_score: condition[0].average_score,
                      }
                    : null,
            };
        } finally {
            connection.release();
        }
    },
};

module.exports = Score;

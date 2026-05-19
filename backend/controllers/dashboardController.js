const pool = require("../config/database");

const DashboardController = {
    async getSummary(req, res) {
        try {
            const connection = await pool.getConnection();

            // Get counts by status
            const [statusCounts] = await connection.execute(
                `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
          SUM(CASE WHEN status = 'mitigated' THEN 1 ELSE 0 END) as mitigated,
          SUM(CASE WHEN status = 'pending_collateral' THEN 1 ELSE 0 END) as pending_collateral,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
         FROM assessments`,
            );

            // Get risk zone distribution
            const [riskZones] = await connection.execute(
                `SELECT risk_zone, COUNT(*) as count FROM assessments WHERE risk_zone IS NOT NULL GROUP BY risk_zone`,
            );

            // Get average scores
            const [avgScores] = await connection.execute(
                `SELECT AVG(total_score) as average_score FROM assessments WHERE total_score IS NOT NULL`,
            );

            // Get recent assessments
            const [recent] = await connection.execute(
                `SELECT id, assessment_code, business_name, product_name, status, risk_zone, total_score, created_at 
         FROM assessments ORDER BY created_at DESC LIMIT 5`,
            );

            connection.release();

            res.json({
                summary: {
                    total: statusCounts[0].total,
                    approved: statusCounts[0].approved || 0,
                    mitigated: statusCounts[0].mitigated || 0,
                    pending_collateral: statusCounts[0].pending_collateral || 0,
                    rejected: statusCounts[0].rejected || 0,
                    average_score: avgScores[0].average_score?.toFixed(2) || 0,
                },
                riskZones: riskZones.reduce((acc, zone) => {
                    acc[zone.risk_zone] = zone.count;
                    return acc;
                }, {}),
                recent,
            });
        } catch (error) {
            console.error("Dashboard error:", error);
            res.status(500).json({ error: "Failed to get dashboard data" });
        }
    },
};

module.exports = DashboardController;

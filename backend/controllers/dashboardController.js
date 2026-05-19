const pool = require("../config/database");

const DashboardController = {
    async getSummary(req, res) {
        try {
            const connection = await pool.getConnection();

            // Get counts by status
            const [statusCounts] = await connection.execute(
                `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'Risiko_Diterima' THEN 1 ELSE 0 END) as Risiko_Diterima,
          SUM(CASE WHEN status = 'Risiko_Dimitigasi' THEN 1 ELSE 0 END) as Risiko_Dimitigasi,
          SUM(CASE WHEN status = 'Risiko_Dipindahkan' THEN 1 ELSE 0 END) as Risiko_Dipindahkan,
          SUM(CASE WHEN status = 'Risiko_Dihindari' THEN 1 ELSE 0 END) as Risiko_Dihindari
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
                    Risiko_Diterima: statusCounts[0].Risiko_Diterima || 0,
                    Risiko_Dimitigasi: statusCounts[0].Risiko_Dimitigasi || 0,
                    Risiko_Dipindahkan: statusCounts[0].Risiko_Dipindahkan || 0,
                    Risiko_Dihindari: statusCounts[0].Risiko_Dihindari || 0,
                    average_score: Number(
                        avgScores[0].average_score || 0,
                    ).toFixed(2),
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

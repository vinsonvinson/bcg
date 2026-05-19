const pool = require("../config/database");

const Assessment = {
    async create(assessmentData) {
        const connection = await pool.getConnection();
        try {
            const {
                assessment_code,
                business_name,
                product_name,
                assessment_date,
                analyst_id,
            } = assessmentData;

            const [result] = await connection.execute(
                "INSERT INTO assessments (assessment_code, business_name, product_name, assessment_date, analyst_id) VALUES (?, ?, ?, ?, ?)",
                [
                    assessment_code,
                    business_name,
                    product_name,
                    assessment_date,
                    analyst_id,
                ],
            );

            return result.insertId;
        } finally {
            connection.release();
        }
    },

    async getById(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                "SELECT * FROM assessments WHERE id = ?",
                [id],
            );
            return rows[0];
        } finally {
            connection.release();
        }
    },

    async getAll(filters = {}) {
        const connection = await pool.getConnection();
        try {
            let query = "SELECT * FROM assessments WHERE 1=1";
            const params = [];

            if (filters.analyst_id) {
                query += " AND analyst_id = ?";
                params.push(filters.analyst_id);
            }

            if (filters.status) {
                query += " AND status = ?";
                params.push(filters.status);
            }

            if (filters.risk_zone) {
                query += " AND risk_zone = ?";
                params.push(filters.risk_zone);
            }

            query += " ORDER BY created_at DESC";

            const [rows] = await connection.execute(query, params);
            return rows;
        } finally {
            connection.release();
        }
    },

    async update(id, updateData) {
        const connection = await pool.getConnection();
        try {
            const fields = Object.keys(updateData)
                .map((key) => `${key} = ?`)
                .join(", ");
            const values = Object.values(updateData);

            await connection.execute(
                `UPDATE assessments SET ${fields} WHERE id = ?`,
                [...values, id],
            );

            return true;
        } finally {
            connection.release();
        }
    },

    async delete(id) {
        const connection = await pool.getConnection();
        try {
            await connection.execute("DELETE FROM assessments WHERE id = ?", [
                id,
            ]);
            return true;
        } finally {
            connection.release();
        }
    },
};

module.exports = Assessment;

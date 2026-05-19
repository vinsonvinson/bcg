const pool = require('../config/database');

const User = {
  async create(userData) {
    const connection = await pool.getConnection();
    try {
      const { username, password, email, full_name, role } = userData;
      const [result] = await connection.execute(
        'INSERT INTO users (username, password, email, full_name, role) VALUES (?, ?, ?, ?, ?)',
        [username, password, email, full_name, role || 'analyst']
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  },

  async getByUsername(username) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE username = ? AND is_active = 1',
        [username]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  },

  async getById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT id, username, email, full_name, role FROM users WHERE id = ? AND is_active = 1',
        [id]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  },

  async getAll() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT id, username, email, full_name, role, is_active FROM users WHERE is_active = 1'
      );
      return rows;
    } finally {
      connection.release();
    }
  }
};

module.exports = User;

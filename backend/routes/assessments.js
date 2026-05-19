const express = require('express');
const router = express.Router();
const AssessmentController = require('../controllers/assessmentController');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Analyst routes
router.post('/', verifyToken, verifyRole(['analyst', 'admin']), AssessmentController.createAssessment);
router.get('/', verifyToken, AssessmentController.getAllAssessments);
router.get('/:id', verifyToken, AssessmentController.getAssessment);
router.post('/:id/scores', verifyToken, verifyRole(['analyst', 'admin']), AssessmentController.submitScores);
router.get('/:id/export', verifyToken, AssessmentController.exportToExcel);

// Admin routes
router.get('/admin/all', verifyToken, verifyRole(['admin']), AssessmentController.getAdminAssessments);

module.exports = router;

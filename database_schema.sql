-- Simplified Database Schema for BCG Credit Scoring System
-- Based on 5C Method with 22 indicators and minimal relational complexity

CREATE DATABASE IF NOT EXISTS bcg_scoring;
USE bcg_scoring;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  role ENUM('admin', 'analyst') DEFAULT 'analyst',
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (username),
  INDEX (email)
);

CREATE TABLE assessments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assessment_code VARCHAR(50) UNIQUE NOT NULL,
  business_name VARCHAR(100) NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  assessment_date DATE NOT NULL,
  analyst_id INT NOT NULL,
  total_score DECIMAL(5,2),
  risk_zone VARCHAR(50),
  status ENUM('draft', 'Risiko_Diterima', 'Risiko_Dihindari', 'Risiko_Dimitigasi', 'Risiko_Dipindahkan') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (analyst_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX (analyst_id),
  INDEX (status),
  INDEX (risk_zone)
);

CREATE TABLE character_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assessment_id INT NOT NULL UNIQUE,
  willingness_score TINYINT NOT NULL,
  integrity_score TINYINT NOT NULL,
  personal_risk_score TINYINT NOT NULL,
  social_relation_score TINYINT NOT NULL,
  average_score DECIMAL(3,2) NOT NULL,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE capacity_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assessment_id INT NOT NULL UNIQUE,
  management_skill_score TINYINT NOT NULL,
  business_experience_score TINYINT NOT NULL,
  production_capacity_score TINYINT NOT NULL,
  cost_productivity_score TINYINT NOT NULL,
  equipment_support_score TINYINT NOT NULL,
  sales_profit_score TINYINT NOT NULL,
  average_score DECIMAL(3,2) NOT NULL,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE capital_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assessment_id INT NOT NULL UNIQUE,
  capital_position_score TINYINT NOT NULL,
  debt_position_score TINYINT NOT NULL,
  personal_contribution_score TINYINT NOT NULL,
  receivable_stock_score TINYINT NOT NULL,
  average_score DECIMAL(3,2) NOT NULL,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE collateral_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assessment_id INT NOT NULL UNIQUE,
  collateral_type_score TINYINT NOT NULL,
  collateral_marketability_score TINYINT NOT NULL,
  collateral_binding_score TINYINT NOT NULL,
  ltv_ratio_score TINYINT NOT NULL,
  average_score DECIMAL(3,2) NOT NULL,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE condition_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assessment_id INT NOT NULL UNIQUE,
  market_condition_score TINYINT NOT NULL,
  material_availability_score TINYINT NOT NULL,
  distribution_support_score TINYINT NOT NULL,
  regulation_legality_score TINYINT NOT NULL,
  average_score DECIMAL(3,2) NOT NULL,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

INSERT INTO users (username, password, email, full_name, role)
VALUES ('admin', '$2a$10$maMKpQrc6Od5mXXdpk5XC.XYFATFYJQJ9X4z0Nxox4TN/N0t9CHTK', 'admin@bcg.com', 'Administrator', 'admin');

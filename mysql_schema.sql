-- MySQL schema for habits table
CREATE TABLE IF NOT EXISTS habits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  daysChecked TEXT NOT NULL,
  streak INT NOT NULL DEFAULT 0
);

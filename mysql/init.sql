CREATE DATABASE IF NOT EXISTS todoapp;

USE todoapp;

CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO todos (title, completed)
VALUES
('Learn Docker', false),
('Build CI/CD pipeline', false),
('Deploy to Kubernetes', false);

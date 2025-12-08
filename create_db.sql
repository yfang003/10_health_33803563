CREATE DATABASE IF NOT EXISTS health;
USE health;

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    firstname VARCHAR(20),
    lastname VARCHAR(20),
    email VARCHAR(50),
    hashedpassword VARCHAR(255),
)

CREATE TABLE workout(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    workout_date DATE NOT NULL;
    
)
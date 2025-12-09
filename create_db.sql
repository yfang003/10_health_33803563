CREATE DATABASE IF NOT EXISTS health;
USE health;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    firstname VARCHAR(20),
    lastname VARCHAR(20),
    email VARCHAR(50),
    hashedpassword VARCHAR(255)
);

CREATE TABLE workout (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    workout_date DATE NOT NULL,
    title VARCHAR(100) NOT NULL
    
);

CREATE TABLE exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  muscle_group VARCHAR(50)
);

-- 训练条目（某次训练中做了哪一个动作，做了几组几次等）
CREATE TABLE workout_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workout_id INT NOT NULL,
  exercise_id INT NOT NULL,
  sets INT DEFAULT 1,
  reps INT DEFAULT 0,
  weight_kg DECIMAL(5,2) DEFAULT 0,
  duration_min INT DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (workout_id) REFERENCES workout(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT
);
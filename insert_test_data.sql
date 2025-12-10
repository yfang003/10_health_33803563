# Insert data into the tables

USE health;

INSERT INTO users(username, firstname, lastname, email, hashedpassword)
VALUES (
    'gold',
    'gold',
    'gold',
    'gold@gold.ac.uk',
    '$2b$10$TRI0jxzzPx16lP234439R.tV6rElsWwLj8vsQuBWZ.f57fBuZ9SfC'
);

INSERT INTO workout (title, workout_date)
VALUES
('Leg Day Training', '2025-01-10'),
('Chest & Back Strength', '2025-01-12'),
('Cardio Endurance Day', '2025-01-15');

INSERT INTO exercises (name, muscle_group)
VALUES
('Squat', 'legs'),
('Bench Press', 'chest'),
('Deadlift', 'back'),
('Running', 'cardio'),
('Plank', 'core');

INSERT INTO workout_entries 
(workout_id, exercise_id, sets, reps, weight_kg, duration_min, notes)
VALUES
(1, 1, 4, 8, 40.0, 0, 'Deep squats'),
(1, 3, 3, 5, 50.0, 0, 'Heavy deadlifts');
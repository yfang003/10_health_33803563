# Database Structure (MySQL)

This project uses a MySQL database named health, which contains four tables designed to store user accounts, workout sessions, exercise types, and detailed workout entries.

## extension use and learn of FOREIGN KEY and REFERENCES

This database uses relational constraints to ensure data consistency:

1. FOREIGN KEY ... REFERENCES

Foreign keys link one table to another.
Examples in this project:

- workout_entries.workout_id → workouts.id

2. ON DELETE rules

- If a user is deleted → all their workouts are automatically deleted.
- If a workout is deleted → all workout entries inside it are deleted.

3. ON DELETE RESTRICT

Prevents deleting an exercise type if it is still used in workout entries. These rules help keep the database clean and prevent "orphan" records.
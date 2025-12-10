# FitTrack – Health & Fitness Web Application

FitTrack is a simple workout tracking web application built as part of the Dynamic Web Applications module.  
It allows users to register, log in, record workouts, add exercises, and review past training sessions.  
The system also displays daily weather information to help users decide between indoor and outdoor exercise.

---

##  Features

- User registration and login (with password hashing)
- Add new workouts with detailed exercise entries
- Automatically link exercises to workouts using a relational data model
- Search workouts by date range or keyword
- View full workout details, including sets, reps, weight, duration and notes
- Weather information displayed on the home page
- Access control using sessions (protected workout routes)

---

##  Technology Stack

- **Node.js**
- **Express**
- **EJS templates**
- **MySQL** (Database name: `health`)
- **express-validator** for input validation
- **express-session** for authentication state
- **bcrypt** for password hashing

---

##  Database Setup

Run the following SQL scripts **in order**:

1. `create_db.sql`

   * Creates all required tables: `users`, `workout`, `exercises`, `workout_entries`, `audit_log`.

2. `insert_test_data.sql`

   * Inserts sample data and the required default login user:

     ```
     username: gold  
     password: smiths  
     ```

Make sure your `.env` file matches the required structure:

```env
HEALTH_HOST=localhost
HEALTH_USER=health_app
HEALTH_PASSWORD=qwertyuiop
HEALTH_DATABASE=health
```

---

##  Key Routes

### Public Routes

| Route            | Description                       |
| ---------------- | --------------------------------- |
| `/`              | Home page + weather info          |
| `/about`         | Information about the application |
| `/auth/register` | User registration                 |
| `/auth/login`    | User login                        |

### Protected Workout Routes

| Route                  | Description                       |
| ---------------------- | --------------------------------- |
| `/workouts`            | List all workouts                 |
| `/workouts/addworkout` | Add a new workout                 |
| `/workouts/:id`        | View detailed workout information |
| `/workouts/search`     | Search workouts                   |

Sessions ensure only logged-in users can access workout-related pages.

---

##  Project Structure

```
/routes
  auth.js
  main.js
  workouts.js
  weather.js

/views
  index.ejs
  about.ejs
  addworkout.ejs
  workout.ejs
  workoutview.ejs
  ...

/public
  main.css

/sql
  create_db.sql
  insert_test_data.sql

index.js
README.md
```

---

##  Notes

* All input fields are validated and sanitised using `express-validator`.
* Exercises are created only when they do not already exist, preventing duplication.
* Workouts and exercise details are stored through a three-table relational database design.

---

##  Author

Coursework submission for **Dynamic Web Applications** at Goldsmiths, University of London.

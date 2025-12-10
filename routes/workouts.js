const express = require("express")
const router = express.Router()
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('../auth/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

const { check, validationResult } = require('express-validator');

router.get('/', redirectLogin, async (req, res, next) => {
  let sqlquery = `
    SELECT 
      w.*,
      GROUP_CONCAT(DISTINCT e.name SEPARATOR ', ') AS exercise_names
    FROM workout w
    LEFT JOIN workout_entries we ON w.id = we.workout_id
    LEFT JOIN exercises e ON we.exercise_id = e.id
    GROUP BY w.id
    ORDER BY w.workout_date DESC
  `;

  db.query(sqlquery, (err, result) => {
    if (err) {
      return next(err);
    }
    res.render("workout.ejs", { workout: result });
  });
});



router.get('/search', redirectLogin, function(req, res, next){
  res.render('searchworkout.ejs')
})

router.get(
  '/search-result',
  redirectLogin,
  [

    check('from').optional({ checkFalsy: true }).isISO8601(),
    check('to').optional({ checkFalsy: true }).isISO8601(),
    check('keyword').optional({ checkFalsy: true }).trim().isLength({ max: 100 })
  ],
  function (req, res, next) {
    let from = req.query.from;
    let to = req.query.to;
    let keyword = req.query.keyword ? req.query.keyword.trim() : '';

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send('Invalid search input');
    }

    if (!from && !to && !keyword) {
      return res.send('Please use at least one search condition (date range or keyword).');
    }

    let sqlquery = 'SELECT * FROM workout WHERE 1=1';
    let params = [];

    if (from) {
      sqlquery += ' AND workout_date >= ?';
      params.push(from);
    }

    if (to) {
      sqlquery += ' AND workout_date <= ?';
      params.push(to);
    }

    if (keyword) {
      sqlquery += ' AND title LIKE ?';
      params.push('%' + keyword + '%');
    }

    sqlquery += ' ORDER BY workout_date DESC';

    db.query(sqlquery, params, (err, result) => {
      if (err) {
        next(err);
      } else {
        res.render('workoutlist.ejs', {
          workouts: result,
          from: from,
          to: to,
          keyword: keyword
        });
      }
    });
  }
);

router.get('/addworkout', redirectLogin, function (req, res, next) {
    res.render('addworkout.ejs');
});

router.post(
  '/workoutadded',
  redirectLogin,
  [
    check('title').notEmpty(),
    check('workout_date').notEmpty().isISO8601(),
    check('exercise_name').notEmpty().isLength({ max: 100 }),
    check('muscle_group').optional({ checkFalsy: true }).isLength({ max: 50 }),
    check('sets').optional({ checkFalsy: true }).isInt({ min: 1 }),
    check('reps').optional({ checkFalsy: true }).isInt({ min: 0 }),
    check('weight_kg').optional({ checkFalsy: true }).isFloat({ min: 0 }),
    check('duration_min').optional({ checkFalsy: true }).isInt({ min: 0 }),
    check('notes').optional({ checkFalsy: true }).isLength({ max: 500 })
  ],
  function (req, res, next) {
    let title = req.sanitize(req.body.title);
    let workoutDate = req.sanitize(req.body.workout_date);

    let exerciseName = req.sanitize(req.body.exercise_name);
    let muscleGroup = req.sanitize(req.body.muscle_group);

    let sets = req.sanitize(req.body.sets || '1');
    let reps = req.sanitize(req.body.reps || '0');
    let weightKg = req.sanitize(req.body.weight_kg || '0');
    let durationMin = req.sanitize(req.body.duration_min || '0');
    let notes = req.sanitize(req.body.notes || '');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send('Invalid workout input');
    }

    // 先插入 workout
    let workoutSql = "INSERT INTO workout (title, workout_date) VALUES (?, ?)";
    let workoutRecord = [title, workoutDate];

    db.query(workoutSql, workoutRecord, (err, workoutResult) => {
      if (err) {
        return next(err);
      }

      let workoutId = workoutResult.insertId;

      // 然后处理 exercise：
      let findExerciseSql = "SELECT id FROM exercises WHERE name = ?";
      db.query(findExerciseSql, [exerciseName], (err, exerciseRows) => {
        if (err) {
          return next(err);
        }

        let ensureExercise = (callback) => {
          if (exerciseRows.length > 0) {
            callback(exerciseRows[0].id);
          } else {

            let insertExerciseSql =
              "INSERT INTO exercises (name, muscle_group) VALUES (?, ?)";
            db.query(
              insertExerciseSql,
              [exerciseName, muscleGroup],
              (err, insertResult) => {
                if (err) {
                  return next(err);
                }
                callback(insertResult.insertId);
              }
            );
          }
        };

        ensureExercise((exerciseId) => {

          let entrySql = `
            INSERT INTO workout_entries 
            (workout_id, exercise_id, sets, reps, weight_kg, duration_min, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          let entryRecord = [
            workoutId,
            exerciseId,
            sets,
            reps,
            weightKg,
            durationMin,
            notes
          ];

          db.query(entrySql, entryRecord, (err, entryResult) => {
            if (err) {
              return next(err);
            }

            res.send(
              "Workout added to database. Title: " +
                title +
                " Date: " +
                workoutDate +
                ' <a href="/workouts">Back to my workouts</a>'
            );
          });
        });
      });
    });
  }
);


router.get('/:id', redirectLogin, function (req, res, next) {
    let workoutId = req.params.id;

    let sqlWorkout = "SELECT * FROM workout WHERE id = ?";

    let sqlEntries = `
        SELECT 
            we.*,
            e.name AS exercise_name,
            e.muscle_group
        FROM workout_entries we
        JOIN exercises e ON we.exercise_id = e.id
        WHERE we.workout_id = ?
        ORDER BY we.id ASC
    `;

    db.query(sqlWorkout, [workoutId], (err, workoutResult) => {
        if (err) {
            return next(err);
        }

        if (workoutResult.length === 0) {
            return res.send("Workout not found");
        }

        let workout = workoutResult[0];

        db.query(sqlEntries, [workoutId], (err, entriesResult) => {
            if (err) {
                return next(err);
            }

            res.render('workoutview.ejs', {
                workout: workout,
                entries: entriesResult
            });
        });
    });
});



module.exports = router
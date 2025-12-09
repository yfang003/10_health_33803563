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

router.get('/', redirectLogin, async (req, res) => {
  const userId = req.session.userId;

  let sqlquery = "SELECT * FROM workout WHERE user_id = ? ORDER BY workout_date";
  db.query(sqlquery, [userId], (err,result) =>{
    if (err) {
      return next(err);
    }
    res.render("workout.ejs", { workout: result });
  })
  })

router.get('/addworkout', redirectLogin, function(req, res, next){
  res.render('addworkout.ejs')
})
  
router.post(
  '/workoutadded',
  redirectLogin,
  [
    check('workout_date').notEmpty(),
    check('duration_min').optional().isFloat({ min: 0 })//let duration time optional
  ],
  function(req, res, next){
    let title = req.sanitize(req.body.title);
    let workoutDate = req.sanitize(req.body.workout_date);
    let duration = req.sanitize(req.body.duration_min);
    let notes = req.sanitize(req.body.notes);

    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send('Invalid workout input');
        }
    
    let userId = req.session.userId;
    let sqlquery = 'INSERT INTO workout ('
  }
)


module.exports = router
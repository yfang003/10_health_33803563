const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('../auth/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}
const { check, validationResult } = require('express-validator');

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})


router.post('/registered', 
    [
        check('firstname').notEmpty(),
        check('lastname').notEmpty().notEmpty(),
        check('email').isEmail(), 
        check('username').isLength({ min: 5, max: 20}),
        check('password').isLength({min: 5})


    ],
    function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register', { errors: errors.array() })
    }
    else { 
        const plainPassword = req.body.password

        const safeFirstname = req.sanitize(req.body.firstname)
        const safeLastname  = req.sanitize(req.body.lastname)
        const safeUseername  = req.sanitize(req.body.username)

        bcrypt.hash(plainPassword, saltRounds, function(err, hashedpassword) {
        // Store hashed password in your database.
        if(err){
            next(err)
        }
            let sqlquery = "INSERT INTO users (username, firstname, lastname, email, hashedpassword) VALUES (?,?,?,?,?)"
            let newrecord = [
                            safeUseername, 
                            safeFirstname, 
                            safeLastname, 
                            req.body.email, 
                            hashedpassword]
            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                next(err)
                }
                else{
                    result = 'Hello '+ safeFirstname + ' '+ safeLastname +' you are now registered! We will send an email to you at ' + req.body.email 
                    + '<a href="/">Home</a>'
                    res.send(result)
                
                }
                
            })
        })
    }                                                                        
}); 

router.get('/login',function(req,res){
    res.render('login')
})

router.post('/loggedin', 
    [
        check('username').notEmpty(),
        check('password').notEmpty()
    ],
function(req, res, next){
    const username = req.body.username
    const password = req.body.password
    
    const sql = 'SELECT * FROM users WHERE username = ?'
    const auditSql = 'INSERT INTO audit_log (username, success) VALUES (?, ?)'

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
   return res.send("Username and password cannot be empty")
}

    db.query(sql,[username], function(err,rows){
        if(err){
            return next(err)
        }

         if (rows.length === 0) {
            db.query(auditSql, [username, false]);
            return res.send('User not found, please register first.');
        }

        const user = rows[0]
        const hashedPassword = user.hashedpassword

    // Compare the password supplied with the password in the database
    bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
        if (err) {
            return next(err)
        }

        db.query(auditSql, [username, result === true])
        
        if (result == true) {
            // Save user session here, when login is successful
            req.session.userId = req.body.username;
            res.send('Successful! Wlcome ' +  user.firstname + '<a href="/">Home</a>')
        }
        else {
            res.send('Wrong password, please check')
        }
    })

    })

})

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('./')
        }
    res.send('you are now logged out. <a href='+'/'+'>Home</a>');
    })
})

router.get('/audit', function(req,res,next){
    const sql = 'SELECT * FROM audit_log ORDER BY time DESC'
    db.query(sql, function(err, rows){
        if (err){
            return next(err)
        }
        res.render('audit', {logs: rows})
    })
})


module.exports = router
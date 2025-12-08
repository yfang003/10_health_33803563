const express = require("express")
const router = express.Router()
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('/auth/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}
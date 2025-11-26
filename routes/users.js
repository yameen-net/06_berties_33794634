// Create a new router
const { check, validationResult } = require('express-validator');
const express = require("express")

const bcrypt = require('bcrypt')



const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('/users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}

const router = express.Router()



router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

// List all users
router.get('/list',redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM users"; // Query database to get all the users
    
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        
        res.render("users.ejs", { availableUsers: result }); 
    });
});

router.post('/registered', 
    [   check('email').isEmail(),
        check('username').isLength({ min: 5, max: 20 }).withMessage('Username must be 5-20 chars'),
        check('password').isLength({ min: 8 }).withMessage('Password must be 8+ chars'),
        check('first').notEmpty().withMessage('First name required'),
        check('last').notEmpty().withMessage('Last name required'),
    ],
    function (req, res, next) {
        const errors = validationResult(req);
        
        
        if (!errors.isEmpty()) { 
            // passign the errors to the EJS file 
            res.render('register.ejs', { errors: errors.array() }); 
        }
        else {
           
            const saltRounds = 10;
            const plainPassword = req.body.password;

            bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
                if (err) return next(err);

                let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";
                let newrecord = [req.body.username, req.sanitize(req.body.first), req.sanitize(req.body.last), req.sanitize(req.body.email), hashedPassword];

                db.query(sqlquery, newrecord, (err, result) => {
                    if (err) return next(err);
                   
                    let resultMsg = 'Hello ' + req.sanitize(req.body.first) + ' ' + req.sanitize(req.body.last) + ' you are now registered!';
                    res.send(resultMsg);
                });
            });
        }
    }
);

// Task 4: Login Page
router.get('/login', function (req, res, next) {
    res.render('login.ejs')
});

// Task 4: Login 
router.post('/loggedin', function (req, res, next) {

    const logAudit = (username, action) => {
        let sqlAudit = "INSERT INTO login_audit (username, action) VALUES (?, ?)";
        // timestamp is added automatically by the database
        db.query(sqlAudit, [username, action], (err, result) => {
            if (err) console.error("Error logging audit:", err);
        });
    };


    // 1. Select the hashed password for the user from the database 
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?";
    
    db.query(sqlquery, [req.body.username], (err, result) => {
        if (err) {
            // handle database errors
            return next(err);
        }
        
        // check if any user was found with that username
        if (result.length === 0) {
            logAudit(req.body.username, "fail (user not found)"); // Log failure
            res.send("User not found. Please check your username.");
            return; 
        }

        // Get the hashed password from the database result
        let hashedPassword = result[0].hashedPassword;

        // 2. Compare the password supplied with the password in the database 
        bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
            if (err) {
                // Handle bcrypt errors 
                return next(err);
            }
            else if (result == true) {
                logAudit(req.body.username, "success"); // Log success
                req.session.userId = req.body.username;
                // Passwords match 
                res.send("Login successful! Welcome back, " + req.body.username);
            }
            else {
                logAudit(req.body.username, "fail (wrong password)");
                // Passwords do not match 
                res.send("Login failed. Incorrect password.");
            }
        });
    });
});

// Task 6: Audit Log Route
router.get('/audit', function(req, res, next) {
    let sqlquery = "SELECT * FROM login_audit";
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render("audit.ejs", { auditLog: result });
    });
});

// Export the router object so index.js can access it
module.exports = router

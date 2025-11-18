// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')



router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

// List all users
router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM users"; // Query database to get all the users
    
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        
        res.render("users.ejs", { availableUsers: result }); 
    });
});

router.post('/registered', function (req, res, next) {
    const saltRounds = 10
    const plainPassword = req.body.password

    // Hash the password before storing it in the database 
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err);
        }

        // Store hashed password in your database 
        let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";
        // Combine form data and the new hashed password
        let newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return next(err);
            }
            
            // Prepare the response string 
            result = 'Hello ' + req.body.first + ' ' + req.body.last + ' you are now registered! We will send an email to you at ' + req.body.email;
            
            // Append the debug info as requested in the lab
            result += ' Your password is: ' + req.body.password + ' and your hashed password is: ' + hashedPassword;
            
            res.send(result);
        });
    })
});

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

// Create a new router
const express = require("express")

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('/users/login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}


const router = express.Router()


router.get('/search', redirectLogin,function(req, res, next){
    res.render("search.ejs")
});



router.get('/search-result', function(req, res, next) {
    let searchTerm = req.query.search_text;  // get search keyword from query params
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    db.query(sqlquery, ['%' + searchTerm + '%'], (err, result) => {
        if (err) {
            next(err);
        }
        res.render('list.ejs', { availableBooks: result });  // render the result on list.ejs
    });
});


router.get('/list',redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
         res.render("list.ejs", { availableBooks: result }); // render list.ejs with the book data
        });
});

// books.js

router.post('/bookadded', function(req, res, next) {
    let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
    let newrecord = [req.body.name, req.body.price]; // Get data from the form

    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.send('This book is added to the database: Name: ' + req.body.name + ' Price: ' + req.body.price);
        }
    });
});

// books.js
router.get('/bargainbooks',redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20"; // query to find books priced less than £20
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render('list.ejs', { availableBooks: result }); // render result using the existing list.ejs
    });
});




// Export the router object so index.js can access it
module.exports = router

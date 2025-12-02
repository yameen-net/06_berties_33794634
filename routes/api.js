const express = require('express');
const router = express.Router();


router.get('/books', function (req, res, next) {

    // Query database to get all the books
    let sqlquery = "SELECT * FROM books"; 
    
    // We use this array to safely pass parameters to the SQL
    let conditions = []; 
    let values = [];

    // Search Term EXTENSTION
    if (req.query.search) {
        conditions.push("name LIKE ?");
        values.push('%' + req.query.search + '%');
    }

    // Price Range
    if (req.query.minprice) {
        conditions.push("price >= ?");
        values.push(req.query.minprice);
    }
    if (req.query.max_price) { 
        conditions.push("price <= ?");
        values.push(req.query.max_price);
    }

    // Combine conditions with "WHERE" and "AND"
    if (conditions.length > 0) {
        sqlquery += " WHERE " + conditions.join(" AND ");
    }

    //  Sort Option 
    if (req.query.sort) {
        if (req.query.sort === 'name') {
            sqlquery += " ORDER BY name ASC";
        } else if (req.query.sort === 'price') {
            sqlquery += " ORDER BY price ASC";
        }
    }

    // Execute the query
    db.query(sqlquery, values, (err, result) => {
        if (err) {
            res.json(err);
            next(err);
        } else {

            res.json(result); 
        }
    });
});

module.exports = router;
const express = require('express');
const router = express.Router(); 
const request = require('request');
const apiKey = '286a9abf4b88cedb1c28e0634cc7d64b';

router.get('/', function(req, res, next){
    res.send("Hello from weather route");
}); 


router.get('/now', function(req, res, next){
    

    let city = 'london';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`


   
    
    
            request(url, function (err, response, body) {
      if(err){
        next(err)
      } else {
    
        var weather = JSON.parse(body)
        var wmsg = 'It is '+ weather.main.temp + 
            ' degrees in '+ weather.name +
            '! <br> The humidity now is: ' + 
            weather.main.humidity;
            res.send (wmsg);
        
      }
    });
});


router.get('/search', function(req, res) {
    let city = req.query.city; // Get the city from the form input
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`; 

    request(url, function(err, response, body) {
        if(err) {
            // Error handling 
            res.render('weather', { weather: null, error: 'Error, please try again' });
        } else {
            let weather = JSON.parse(body); 
            
            // undefined check
            if(weather.main == undefined) {
                 res.render('weather', { weather: null, error: 'Error: No weather data found for that city.' });
            } else {
                
                res.render('weather', { weather: weather, error: null });
            }
        }
    });
});


module.exports = router;
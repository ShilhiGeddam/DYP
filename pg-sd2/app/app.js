// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');
// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');
// Create a route for root - /
// app.get("/", function(req, res) {
//     res.render("navbar");
// });
app.get("/login", function(req, res) {
    res.render("login");
});
app.get("/register", function(req, res) {
    res.render("register");
});
// Create a route for testing the db
app.get("/", function(req, res) {
    const brands = [
        "Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Audi",
        "Chevrolet", "Nissan", "Hyundai", "Volkswagen", "Tesla",
        "Porsche", "Mazda", "Kia", "Subaru","Jaguar"
      ];
    // Assumes a table called test_table exists in your database
    sql = 'select * from car_details';
    db.query(sql).then(results => {
        // console.log(results);
        res.render('cars', { cars: results,brands });
    });
});

// Route to display the details of a specific car
app.get("/cars/:carId", function(req, res) {
    const { carId } = req.params;
    const sql = 'SELECT * FROM car_details WHERE car_id = ?';
    console.log(sql);
    db.query(sql, [carId])
        .then(results => {
            console.log(results.length);
            if (results.length > 0) {
                res.render('car_details', { car: results[0] });
            } else {
                res.status(404).send('Car not found');
            }
        })
});

app.get("/contact", function(req, res) {
    res.render("contact");
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});
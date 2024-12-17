// Import express.js for routing and middleware
const express = require("express");

// Initialize express application
var app = express();

// Serve static files (e.g., CSS, images, JS) from the 'static' folder
app.use(express.static("static"));

// Import database functions from db.js
const db = require('./services/db');

// Set up Pug as the templating engine and define the views directory
app.set('view engine', 'pug');
app.set('views', './app/views');

// Route for login page
app.get("/login", function(req, res) {
    res.render("login");
});

// Route for registration page
app.get("/register", function(req, res) {
    res.render("register");
});

// Route for About Us page
app.get("/about", function(req, res) {
    res.render("aboutus");
});

// Route for the homepage (testing database connection and fetching car data)
app.get("/", function(req, res) {
    const brands = [
        "Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Audi",
        "Chevrolet", "Nissan", "Hyundai", "Volkswagen", "Tesla",
        "Porsche", "Mazda", "Kia", "Subaru", "Jaguar"
    ];
    // Query the car_details table in the database
    sql = 'select * from car_details';
    db.query(sql).then(results => {
        // Render the 'cars' view with car data and available brands
        res.render('cars', { cars: results, brands });
    });
});

// Route to display the details of a specific car based on carId
app.get("/cars/:carId", function(req, res) {
    const { carId } = req.params;
    const sql = 'SELECT * FROM car_details WHERE car_id = ?';
    db.query(sql, [carId])
        .then(results => {
            // Check if the car exists and render its details
            if (results.length > 0) {
                res.render('car_details', { car: results[0] });
            } else {
                res.status(404).send('Car not found');
            }
        });
});

// Route for contact page
app.get("/contact", function(req, res) {
    res.render("contact");
});


// Start the server on port 3000
app.listen(3000, function() {
    console.log(`Server running at http://127.0.0.1:3000/`);
});

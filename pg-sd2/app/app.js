// Import express.js for routing and middleware
const express = require("express");
const { User } = require("./models/user");
// Initialize express application
var app = express();


// Serve static files (e.g., CSS, images, JS) from the 'static' folder
app.use(express.static("static"));

// Import database functions from db.js
const db = require('./services/db');

// Set up Pug as the templating engine and define the views directory
app.set('view engine', 'pug');
app.set('views', './app/views');

const cookieParser = require("cookie-parser");
const session = require('express-session');
app.use(cookieParser());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const oneDay = 1000 * 60 * 60 * 24;
const sessionMiddleware = session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
});
app.use(sessionMiddleware);

// // Route for login page
// app.get("/login", function(req, res) {
//     res.render("login");
// });

// Route for registration page
app.get("/register", function(req, res) {
    res.render("register");
});

// Route for About Us page
app.get("/about", function(req, res) {
    res.render("aboutus");
});

// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Email and password are required.');
        }

        var user = new User(email);
        const uId = await user.getIdFromEmail();
        if (!uId) {
            return res.status(401).send('Invalid email');
        }

        const match = await user.authenticate(password);
        if (!match) {
            return res.status(401).send('Invalid password');
        }

        req.session.uid = uId;
        req.session.loggedIn = true;
        console.log(req.session.id);
        res.redirect('/cars');
    } catch (err) {
        console.error(`Error while authenticating user:`, err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/logout', function (req, res) {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (err) {
        console.error("Error logging out:", err);
        res.status(500).send('Internal Server Error');
    }
});

// Route for the homepage (testing database connection and fetching car data)
app.get("/cars", function(req, res) {
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

app.get("/login", function (req, res) {
    try {
        if (req.session.uid) {
            res.redirect('/');
        } else {
            res.render('login');
        }
        res.end();
    } catch (err) {
        console.error("Error accessing root route:", err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/set-password', async function (req, res) {
    const { email, password, contactNumber, address } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    try {
        const user = new User(email, contactNumber, address);

        // Check if the user already exists
        const uId = await user.getIdFromEmail();
        if (uId) {
            // If a valid, existing user is found, update the password
            await user.setUserPassword(password);
            console.log(`Password updated for user ID: ${uId}`);
            return res.status(200).send('Password set successfully.');
        } else {
            // If no existing user is found, add a new one
            await user.addUser(password,contactNumber,address);
            console.log(`New user created with email: ${email}`);
            return res.status(201).send('New user created successfully.');
        }
    } catch (err) {
        console.error(`Error while setting password:`, err.message);
        res.status(500).send('Internal Server Error');
    }
});

// Route for contact page
app.get("/contact", function(req, res) {
    res.render("contact");
});

app.post('/contactus', async (req, res) => {
    const { firstName, lastName, phoneNumber, email, message } = req.body;
    const sql = 'INSERT INTO ContactUs (firstName, lastName, phoneNumber, email, message) VALUES (?, ?, ?, ?, ?)';

    try {
        db.query(sql, [firstName, lastName, phoneNumber, email, message], (err, result) => {
            if (err) {
                return res.redirect('contact', {status: 'error', message: 'Failed to insert into ContactUs table' });
            }
            res.render('contact',{ status: 'success', message: 'Contact details inserted successfully' });
        });
    } catch (err) {
        res.render('contact',{ status: 'error', message: 'Failed to insert into ContactUs table' });
    }
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




// Start the server on port 3000
app.listen(3000, function() {
    console.log(`Server running at http://127.0.0.1:3000/`);
});

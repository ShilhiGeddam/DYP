const express = require("express");
const { User } = require("./models/user");
const app = express();

app.use(express.static("static"));
const db = require('./services/db');
app.set('view engine', 'pug');
app.set('views', './app/views');

const cookieParser = require("cookie-parser");
const session = require('express-session');
const bodyParser = require('body-parser');
const oneDay = 1000 * 60 * 60 * 24;
const sessionMiddleware = session({
    secret: "driveyourpassion",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
});
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(sessionMiddleware);



app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/about", (req, res) => {
    res.render("aboutus");
});

app.post('/authenticate', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Email and password are required.');
        }

        const user = new User(email);
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
        res.redirect('/cars');
    } catch (err) {
        console.error(`Error while authenticating user:`, err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/logout', (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (err) {
        console.error("Error logging out:", err);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/cars", (req, res) => {
    const brands = [
        "Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Audi",
        "Chevrolet", "Nissan", "Hyundai", "Volkswagen", "Tesla",
        "Porsche", "Mazda", "Kia", "Subaru", "Jaguar"
    ];
    const sql = 'SELECT * FROM car_details';
    db.query(sql).then(results => {
        res.render('cars', { cars: results, brands });
    });
});

app.get("/login", (req, res) => {
    try {
        if (req.session.uid) {
            res.redirect('/');
        } else {
            res.render('login');
        }
    } catch (err) {
        console.error("Error accessing root route:", err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/set-password', async (req, res) => {
    const { email, password, contactNumber, address } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    try {
        const user = new User(email, contactNumber, address);

        const uId = await user.getIdFromEmail();
        if (uId) {
            await user.setUserPassword(password);
            console.log(`Password updated for user ID: ${uId}`);
            return res.status(200).send('Password set successfully.');
        } else {
            await user.addUser(password, contactNumber, address);
            console.log(`New user created with email: ${email}`);
            return res.status(201).send('New user created successfully.');
        }
    } catch (err) {
        console.error(`Error while setting password:`, err.message);
        res.status(500).send('Internal Server Error');
    }
});

// Route for rendering the contact page
app.get('/contact', function (req, res) {
    const { error, success } = req.query; // Get error or success messages from query params
    res.render('contact', { error, success });
});

// Route for handling contact form submissions
app.post('/contactus', async function (req, res) {
    const { firstName, lastName, phoneNumber, email, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !phoneNumber || !email || !message) {
        return res.redirect('/contact?error=All fields are required.');
    }

    const sql = 'INSERT INTO ContactUs (firstName, lastName, phoneNumber, email, message) VALUES (?, ?, ?, ?, ?)';
    const values = [firstName, lastName, phoneNumber, email, message];

    try {
        await db.query(sql, values);
        res.redirect('/contact?success=Your message has been received. We will get back to you soon.');
    } catch (error) {
        console.error('Error inserting contact details:', error.message);
        res.redirect('/contact?error=Internal server error, please try again later.');
    }
});



app.get("/cars/:carId", (req, res) => {
    const { carId } = req.params;
    const sql = 'SELECT * FROM car_details WHERE car_id = ?';
    db.query(sql, [carId])
        .then(results => {
            if (results.length > 0) {
                res.render('car_details', { car: results[0] });
            } else {
                res.status(404).send('Car not found');
            }
        });
});

app.listen(3000, () => {
    console.log(`Server running at http://127.0.0.1:3000/`);
});
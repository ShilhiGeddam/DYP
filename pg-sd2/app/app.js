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
        res.redirect('/');
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

app.get("/", (req, res) => {
    const brands = [
        "Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Audi",
        "Chevrolet", "Nissan", "Hyundai", "Volkswagen", "Tesla",
        "Porsche", "Mazda", "Kia", "Subaru", "Jaguar"
    ];
    
    // SQL query to get car details and the average rating for each car
    const sql = `
        SELECT car_details.*, 
               IFNULL(AVG(reviews.rating), 0) AS avgRating 
        FROM car_details
        LEFT JOIN reviews ON car_details.car_id = reviews.product_id
        GROUP BY car_details.car_id
    `;

    db.query(sql)
        .then(results => {
            res.render('cars', { cars: results, brands });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Server Error');
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

    // Query to get car details
    const carSql = 'SELECT * FROM car_details WHERE car_id = ?';
    // Query to get reviews for the car
    const reviewsSql = 'SELECT * FROM reviews WHERE product_id = ? ORDER BY review_date DESC';  
    // Query to calculate the average rating for the car
    const avgRatingSql = 'SELECT AVG(rating) as avgRating FROM reviews WHERE product_id = ?';

    // Query the car details, reviews, and average rating in parallel using Promise.all
    Promise.all([
        db.query(carSql, [carId]),
        db.query(reviewsSql, [carId]),
        db.query(avgRatingSql, [carId])
    ])
    .then(([carResults, reviewResults, avgRatingResults]) => {
        if (carResults.length > 0) {
            const car = carResults[0];
            const reviews = reviewResults;
            const avgRating = avgRatingResults[0].avgRating || 0;  // If no reviews, set avgRating to 0

            // Pass the car, reviews, and average rating to the template
            res.render('car_details', { car, reviews, avgRating });
        } else {
            res.status(404).send('Car not found');
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Server Error');
    });
});

app.get("/favourites", async (req, res) => {
    try {
        const userId = req.session.uid;
        if (!userId) {
            return res.status(401).send('User not logged in.');
        }

        const sql = 'SELECT p.* FROM favourites f JOIN car_details p ON f.product_id = p.car_id WHERE f.customer_id = ?';
        const favourites = await db.query(sql, [userId]);

        if (favourites.length > 0) {
            res.render('favourites_list', { favourites });
        } else {
            res.render('favourites_list', { message: 'You have no favourite products yet.' });
        }
    } catch (err) {
        console.error('Error retrieving favourites:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.post("/favourites", async (req, res) => {
    console.log(req.body);
    const { product_id } = req.body;

    if (!product_id) {
        return res.status(400).send('Product ID is required.');
    }

    try {
        const userId = req.session.uid;
        if (!userId) {
            return res.status(401).send('User not logged in.');
        }

        const sql = 'INSERT INTO favourites (customer_id, product_id) VALUES (?, ?)';
        const values = [userId, product_id];

        await db.query(sql, values);

        res.redirect(`/cars/${product_id}`);
    } catch (err) {
        console.error('Error adding to favourites:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

// Route to remove a product from favourites
app.post("/remove-favourite", async (req, res) => {
    try {
        const userId = req.session.uid;
        const { product_id } = req.body;

        // Check if user is logged in
        if (!userId) {
            return res.status(401).send('User not logged in.');
        }

        // Validate product_id
        if (!product_id) {
            return res.status(400).send('Product ID is required.');
        }

        // Delete from favourites table
        const sql = 'DELETE FROM favourites WHERE customer_id = ? AND product_id = ?';
        const values = [userId, product_id];

        const result = await db.query(sql, values);

        // Check if the delete operation was successful
        if (result.affectedRows > 0) {
            // Redirect back to favourites page
            res.redirect('/favourites');
        } else {
            res.status(404).send('Favourite not found.');
        }
    } catch (err) {
        console.error('Error removing from favourites:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/submit-review', async (req, res) => {
    const { product_id, review_text, rating } = req.body;
    console.log(req.body)
    const userId = req.session.uid;

    if (!userId) {
        return res.status(401).send('User not logged in.');
    }

    if (!review_text || !rating || rating < 1 || rating > 5) {
        return res.status(400).send('Invalid review or rating.');
    }

    try {
        const sql = `
            INSERT INTO reviews (product_id, customer_id, rating, review_text)
            VALUES (?, ?, ?, ?)
        `;
        const values = [product_id, userId, rating, review_text];

        const result = await db.query(sql, values);

        if (result.affectedRows > 0) {
            res.status(200).send('Review submitted successfully!');
        } else {
            res.status(500).send('Failed to submit the review.');
        }
    } catch (err) {
        console.error('Error submitting review:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/compare', (req, res) => {
    const selectedCarIds = [req.query.car1, req.query.car2];
    
    // Get all car models for dropdown
    const sqlAllCars = 'SELECT car_id, model_name, image_location, manufacturer, year, price, transmission, seater FROM car_details';
    
    db.query(sqlAllCars)
        .then(allCars => {
            const selectedCars = allCars.filter(car => selectedCarIds.includes(String(car.car_id)));
            
            // Get the average ratings for the selected cars
            const avgRatingSql = 'SELECT AVG(rating) as avgRating FROM reviews WHERE product_id = ?';
            const ratingPromises = selectedCars.map(car => {
                return db.query(avgRatingSql, [car.car_id])
                    .then(ratingResults => {
                        car.avgRating = ratingResults[0].avgRating || 0; // Set default rating if no reviews
                        return car;
                    });
            });

            Promise.all(ratingPromises)
                .then(updatedCars => {
                    // Render the compare page with the selected cars and all available cars
                    res.render('compare', { cars: allCars, selectedCars: updatedCars });
                })
                .catch(err => {
                    console.error('Error fetching ratings:', err);
                    res.status(500).send('Error fetching ratings');
                });
        })
        .catch(err => {
            console.error('Error fetching car details:', err);
            res.status(500).send('Error fetching car details');
        });
});






app.listen(3000, () => {
    console.log(`Server running at http://127.0.0.1:3000/`);
});
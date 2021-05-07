require('dotenv').config();

const express = require('express');
const fs = require('fs');
// const multer = require("multer");
const https = require('https');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const emailHandler = require('./emailHandler');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {json} = require('body-parser');
const JWT_EXPIRATION = '6h';
const fileUpload = require('express-fileupload');
const exphbs = require('express-handlebars');

const app = express();
const port = 8080;

app.use(fileUpload());
app.use(express.static('upload'));

// Static Files
app.use(express.static('public'));


// Templating engine
app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'hbs');


//const upload = multer({
//    dest: process.env.DEST,
//    limits: {fileSize: 10000000}
//});


//----------Will need to comment these out to run locally----------
const cert = fs.readFileSync(process.env.CERT);
const ca = fs.readFileSync(process.env.CA);
const key = fs.readFileSync(process.env.KEY);
const httpsOptions = {cert, ca, key};

const httpsServer = https.createServer(httpsOptions, app);
//-----------------------------------------------------------------
let refreshTokens = [];

app.use(cors({
    origin: 'https://farmsignal.net',
    credentials: true
}));

app.use(bodyParser.urlencoded({extended: true}));


// mysql connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    try {
        if (err) {
            throw err;
        }
        console.log("Connected!");
    } catch (error) {
        console.log(error);
    }
});

function isValid(input) {
    return (
        (input !== undefined) &&
        (input !== '') &&
        (input !== null)
    );
}

function formatDate(dateString) {
    if (dateString !== undefined && dateString !== null && dateString !== '') {
        const nums = JSON.stringify(dateString).split(/\D/);
        if (nums.length >= 6) {
            return nums[2] + "/" + nums[3] + "/" + nums[1] + " " + nums[4] + ":" + nums[5];
        }
    }
    return dateString;
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_ACCESS_TOKEN, {expiresIn: JWT_EXPIRATION});
}

// middleware to check JWT authorization
function authJwt(req, res, next) {
    // grab authorization headers
    const authHeader = req.headers['authorization'];

    // if authHeader exists
    if (!authHeader) return res.status(401).send();

    // split at 'Bearer' then at ' ' and return the item at index 1 in array, else return null
    let splitted = authHeader.split('Bearer');
    splitted = splitted[1] && splitted[1].split(' ');
    const token = splitted && (splitted[1] ? splitted[1] : splitted[0]);

    // if token is undefined or null, return with a 401 error
    if (!token) return res.status(401).send();

    // verifying token validity
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (error, user) => {
        // if token is invalid return a 403
        if (error) return res.status(403).send({error});

        // if token is valid, move on to next callback
        next();
    });
}

//------------------ -----------Post --/login and /register routes -------------------------------------------------

//-----------------------post request from user to check and see if the user has the right user name and password---------------
app.route('/api/login')
    .post((req, res) => {
        const sql = `SELECT * FROM Account_Info WHERE user_name = '${req.body.username}'`;
        db.query(sql, (err, foundUser) => {
                if (err) {
                    console.log(err.sqlMessage);
                    res.status(400).send({error: "SQL Query Error"});
                    return;
                }

                if (foundUser.length <= 0) {
                    console.log("Wrong username " + req.body.username);
                    res.status(400).send({error: "Wrong username please try again."});
                    return;
                }

                if (!req.body.password || !bcrypt.compareSync(req.body.password, foundUser[0].password_hash)) {
                    console.log("Wrong password " + req.body.username);
                    res.status(400).send({error: "Wrong password please try again."});
                    return;
                }

                const token = generateAccessToken({user_name: req.body.username});
                const refreshToken = jwt.sign({user_name: req.body.username}, process.env.JWT_ACCESS_TOKEN, {expiresIn: '7d'});
                refreshTokens.push(refreshToken);
                const message = 'Successfully logged in';
                console.log(message + " " + req.body.username);
                res.status(200).send({UserID: foundUser[0].user_id, token, refreshToken})
            }
        );
    });

//-----------------------Post request route to refresh access token------------------------

app.route('/api/token')
    .post((req, res) => {
        const refreshToken = req.body.refreshToken;
        if (refreshToken == null) return res.sendStatus(401);
        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.JWT_ACCESS_TOKEN, (err, user) => {
            if (err) return res.sendStatus(403);
            const accessToken = generateAccessToken({user_name: user.user_name})
            return res.json({accessToken: accessToken})
        });
    });

//-------------------------Delete request route to log out---------------------------------

app.route('/api/logout')
    .delete((req, res) => {
        refreshTokens = refreshTokens.filter(token => token !== req.body.refreshToken);
        return res.sendStatus(204);
    });

//------------- Post request route to register new users. new entry in entered in to table ---------------
app.route('/api/register')
    .post((req, res) => {
        if (!isValid(req.body.email) || !isValid(req.body.username) || !isValid(req.body.password)) {
            console.log(req.body);
            res.status(400).send({error: "Missing Fields."});
            return;
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);

        const user = {
            email_address: req.body.email,
            user_name: req.body.username,
            password_hash: hashedPassword,
        };

        const sql = 'INSERT INTO Account_Info SET ?';
        db.query(sql, user, (err, result) => {
            if (!err) {
                const token = generateAccessToken(user);
                const refreshToken = jwt.sign(user, process.env.JWT_ACCESS_TOKEN, {expiresIn: '7d'});
                refreshTokens.push(refreshToken);
                const message = 'Successfully added new user into database!';
                console.log(message + " " + user.toString());
                res.status(200).send({UserID: result.insertId, token, refreshToken});
            } else {
                console.log("Error adding new user: " + err.sqlMessage);
                res.status(400).send({error: err.sqlMessage});
            }
        });
    });

//------------- Post request route to reset password ---------------
app.route('/api/passwordreset')
    .post(function (req, res) {
        if (!isValid(req.body.username)) {
            console.log(req.body);
            res.status(400).send({error: "Missing Username."});
            return;
        }

        const sql = `SELECT * FROM Account_Info WHERE user_name = '${req.body.username}'`;
        db.query(sql, (err, foundUser) => {
            if (err) {
                console.log(err.sqlMessage);
                res.status(400).send({error: "SQL Query Error"});
                return;
            }

            if (foundUser.length <= 0) {
                console.log("Wrong username " + req.body.username);
                res.status(400).send({error: "Wrong username please try again."});
                return;
            }

            const secret = foundUser[0].password_hash + '-' + foundUser[0].registration_date;

            const payload = {
                id: foundUser[0].user_id,
                username: foundUser[0].user_name
            };
            const token = jwt.sign(payload, secret, {expiresIn: '1h'});
            const resetLink = 'https://farmsignal.net/resetpassword/' + payload.id + '/' + token;
            console.log(resetLink);
            emailHandler.sendPasswordEmail(foundUser[0].email_address, resetLink);
            res.status(200).send({output: "Sent Password Reset Email!"});
        });
    });

app.route('/api/resetpassword/:id/:token')
    .post(function (req, res) {
        const sql = `SELECT * FROM Account_Info WHERE user_id = '${req.params.id}'`;
        db.query(sql, (err, foundUser) => {
            if (err) {
                console.log(err.sqlMessage);
                res.status(400).send({error: "SQL Query Error"});
                return;
            }

            if (foundUser.length <= 0) {
                console.log("Token user not found " + req.params.id);
                res.status(400).send({error: "Error."});
                return;
            }

            const secret = foundUser[0].password_hash + '-' + foundUser[0].registration_date;
            jwt.verify(req.params.token, secret, (error, decoded) => {
                // if token is invalid return a 403
                if (error) return res.status(403).send({error});

                console.log("Reset password token verified!");
                res.status(200).send(decoded);
            });
        });
    });

app.route('/api/resetpassword/')
    .post(function (req, res) {
        if (!isValid(req.body.password)) {
            res.status(400).send({error: "Bad Password."});
            return;
        }

        const sql = `SELECT * FROM Account_Info WHERE user_id = '${req.body.id}'`;
        db.query(sql, (err, foundUser) => {
            if (err) {
                console.log(err.sqlMessage);
                res.status(400).send({error: "SQL Query Error"});
                return;
            }

            if (foundUser.length <= 0) {
                console.log("Reset Pass user not found " + req.body.id);
                res.status(400).send({error: "Error."});
                return;
            }

            const secret = foundUser[0].password_hash + '-' + foundUser[0].registration_date;
            jwt.verify(req.body.token, secret, (error, decoded) => {
                // if token is invalid return a 403
                if (error) return res.status(403).send({error});

                const hashedPassword = bcrypt.hashSync(req.body.password, 10);
                const user = {
                    password_hash: hashedPassword
                };

                const sql = `UPDATE Account_Info SET ? WHERE user_id = ${req.body.id}`;
                db.query(sql, user, (err, userUpdate) => {
                    if (err) {
                        console.log("Reset Pass Error: " + err.sqlMessage);
                        res.status(400).send({error: err.sqlMessage});
                        return;
                    }
                    console.log("Password reset!");
                    res.redirect(301, 'https://farmsignal.net/login');
                });
            });
        });
    });

//------------- Post request route to upload images ---------------
// app.route('/api/upload/').post(upload.single("image"),
//     (req, res) => {

//     }
// );

//------------- Post request to send notification ---------------
app.route('/api/sendnotification')
    .post(authJwt, (req, res) => {
        const sql = `SELECT user_id, notifications FROM Plant_Info WHERE plant_id = ${req.body.plant_id}`;
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err.sqlMessage);
                res.status(400).send({error: "SQL Query Error"});
                return;
            }

            if (result.length <= 0) {
                console.log("Plant not found " + req.body.plant_id);
                res.status(400).send({error: "Plant not found."});
                return;
            }

            if (result[0].notifications === 0) {
                console.log("Notifications not enabled for plant " + req.body.plant_id);
                res.status(400).send({error: "Notifications not enabled."});
                return;
            }

            const sql2 = `SELECT * FROM Account_Info WHERE user_id = '${result[0].user_id}'`;
            db.query(sql2, (err, foundUser) => {
                if (err) {
                    console.log(err.sqlMessage);
                    res.status(400).send({error: "SQL Query Error"});
                    return;
                }

                if (foundUser.length <= 0) {
                    console.log("User not found " + result[0].user_id);
                    res.status(400).send({error: "User not found."});
                    return;
                }

                emailHandler.sendNotificationEmail(foundUser[0].email_address, req.body.text);
                res.status(200).send({output: "Sent Notification Email!"});
            });
        });
    });

//**************** */ RESTful API Start****************************************

//*****************/  We are staring with the /users path**********************

//Gets all users
app.route('/api/users')
    .get(authJwt, (req, res) => {
        const sql = 'SELECT * FROM Account_Info';
        db.query(sql, (err, result) => {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(400).send({error: err.sqlMessage})
            }
        });
    });


//  Retrives a specific user account information
app.route('/api/users/:user')
    .get(authJwt, (req, res) => {
        const sql = `SELECT user_id, email_address, user_name, registration_date FROM Account_Info WHERE user_id = ${req.params.user}`;
        db.query(sql, (err, foundUser) => {
            if (!err) {
                console.log("Get user: " + JSON.stringify(foundUser));
                res.status(200).send(foundUser);
            } else {
                console.log("Get user Error: " + err.sqlMessage);
                res.status(400).send({error: err.sqlMessage});
            }
        });
    })

    //Updates the information for a specific user
    .put(authJwt, (req, res) => {
        const user = {};

        if (isValid(req.body.email)) {
            user.email_address = req.body.email;
        }

        if (isValid(req.body.username)) {
            user.user_name = req.body.username;
        }

        if (isValid(req.body.password)) {
            user.password_hash = bcrypt.hashSync(req.body.password, 10);
        }

        const userObjectIsEmpty = Object.entries(user).length === 0;
        if (userObjectIsEmpty) {
            console.log('User object is empty');
            return res.status(400).json({response: 'Error: Nothing to update.'});
        }

        const sql = `UPDATE Account_Info SET ? WHERE user_id = ${req.params.user}`;
        db.query(sql, user, (err, userUpdate) => {
            if (!err) {
                console.log("Put user: " + user + "Response: " + JSON.stringify(userUpdate));
                res.status(200).send({output: 'success'});
            } else {
                console.log("Put user Error: " + err.sqlMessage);
                res.status(400).send({error: err.sqlMessage});
            }
        });
    })

    //Deletes a specific user along with all of its plants, data readings for all of the users plants, and all images that correspond to each plant.
    .delete(authJwt, (req, res) => {
        const sql1 = `DELETE FROM Plant_Data WHERE user_id = ${req.params.user}`;
        db.query(sql1, (err, result1) => {
            if (!err) {
                const sql2 = `DELETE FROM Plant_Info WHERE user_id = ${req.params.user}`;
                db.query(sql2, (err, result2) => {
                    if (!err) {
                        const sql3 = `DELETE FROM Account_Info WHERE user_id = ${req.params.user}`;
                        db.query(sql3, (err, result3) => {
                            if (!err) {
                                const sql4 = `DELETE FROM plant_images WHERE user_id = ${req.params.user}`;
                                db.query(sql4, (err, result4) => {
                                    if(!err){
                                        console.log([result4, result3, result2, result1]);
                                        res.status(200).send({output: 'success'})
                                    }
                                    else{
                                        res.status(400).send(err);
                                    }
                                });
                                
                            } else {
                                res.status(400).send(err);
                            }
                        })
                    } else {
                        res.status(400).send(err);
                    }
                });
            } else {
                res.status(400).send(err);
            }
        });
    });


//***************** /plants path**********************
//Retrives all the plants of a specific user
app.route('/api/users/:user/plants')
    .get(authJwt, (req, res) => {
        const sql = `SELECT  a.user_id, p.plant_id, plant_name, plant_species,plant_img1, notifications
        FROM Account_Info a
        LEFT JOIN Plant_Info p
        ON a.user_id = p.user_id 
        WHERE a.user_id = ${req.params.user}`;
        db.query(sql, (err, plants) => {
            if (!err) {
                console.log("Plants get: " + JSON.stringify(plants));
                res.status(200).send(plants);
            } else {
                console.log("Error: " + err.sqlMessage);
                res.status(400).send({error: err.sqlMessage});
            }
        });
    })

    //Inserts a new plant for as specific user
    .post(authJwt, (req, res) => {
        if (!req.body.plant_name) {
            console.log(req.body);
            res.status(400).send({error: "Missing Fields."});
            return;
        }

        const plant = {
            plant_name: req.body.plant_name,
            user_id: req.params.user
        };

        if (isValid(req.body.plant_species)) {
            plant.plant_species = req.body.plant_species;
        }

        if (isValid(req.body.notifications)) {
            plant.notifications = req.body.notifications;
        }

        if (isValid(req.body.water_min)) {
            plant.water_min = req.body.water_min;
        }

        if (isValid(req.body.water_max)) {
            plant.water_max = req.body.water_max;
        }

        const sql = 'INSERT INTO Plant_Info SET ?';
        db.query(sql, plant, (err, plant) => {
            if (!err) {
                const imageInfo = {
                    user_id: req.params.user,
                    plant_id: plant.insertId
                };
                var sqlImage = "Insert INTO plant_images SET ?";
                db.query(sqlImage, imageInfo, (err, image) => {
                    if (!err) {
                        console.log("Successfully inserted image placeholder for user: " + req.params.user + " and for plant:  " + plant.insertId);
                        res.status(200).send({plantId: plant.insertId, imageId: image.insertId})
                    } else {
                        console.log("Error: " + err.sqlMessage);
                        res.status(400).send({error: err.sqlMessage});
                    }
                });
            } else {
                console.log("Error: " + err.sqlMessage);
                res.status(400).send({error: err.sqlMessage});
            }
        });
    });

//Gets data for a specific user and specific plant
app.route('/api/users/:user/plants/:plant')
    .get(authJwt, (req, res) => {
        const sql = `SELECT  a.user_id, p.plant_id, plant_name, plant_species,plant_img1, notifications, water_min, water_max
             FROM Account_Info a
             LEFT JOIN Plant_Info p
                  ON a.user_id = p.user_id 
                  WHERE a.user_id = ${req.params.user} AND p.plant_id = ${req.params.plant}`;
        db.query(sql, (err, result) => {
            if (!err) {
                console.log(result);
                res.status(200).send(result)
            } else {
                res.status(400).send({error: err.sqlMessage})
            }
        });
    })

    //updates a specific plant for a specific user.
    .put(authJwt, (req, res) => {
        const plant = {
            user_id: req.params.user,
            plant_id: req.params.plant
        };

        if (isValid(req.body.plant_name)) {
            plant.plant_name = req.body.plant_name;
        }

        if (isValid(req.body.plant_species)) {
            plant.plant_species = req.body.plant_species;
        }

        if (isValid(req.body.notifications)) {
            plant.notifications = req.body.notifications;
        }

        if (isValid(req.body.water_min)) {
            plant.water_min = req.body.water_min;
        }

        if (isValid(req.body.water_max)) {
            plant.water_max = req.body.water_max;
        }

        const plantObjectIsUnmodified = Object.entries(plant).length === 2;
        if (plantObjectIsUnmodified) {
            return res.status(400).send({error: "Missing Fields."});
        }

        const sql = `UPDATE Plant_Info SET ? WHERE plant_id = ${req.params.plant}`;
        db.query(sql, plant, (err, plantResult) => {
            if (!err) {
                console.log('Successfully executed PUT');
                console.log("Put plant: " + plant + " Plant Update result: " + JSON.stringify(plantResult));
                res.status(200).send({output: 'success'});
            } else {
                console.log("Put plant Error: " + err.sqlMessage);
                res.status(400).send({error: err.sqlMessage});
            }
        });
    })

    //Deletes a plant from a specific user,deletes the plants readings, and deletes the image of the plant.
    .delete(authJwt,(req, res) => {
        const sql1 = `DELETE FROM Plant_Data WHERE Plant_id = ${req.params.plant}`;
        db.query(sql1, (err, result1) => {
            if (!err) {
                const sql2 = `DELETE FROM Plant_Info WHERE Plant_id = ${req.params.plant}`;
                db.query(sql2, (err, result2) => {
                    if (!err) {
                        const sql3 =  `DELETE FROM plant_images WHERE Plant_id = ${req.params.plant}`;
                        db.query(sql3,(err, result3) =>{
                            if(!err){
                                console.log("Deleted summary; " + JSON.stringify([result3, result2, result1]));
                                res.status(200).send({output: 'success'})
                            }else {
                                res.status(400).send({error: err.sqlMessage});
                            }
                        });
                    } 
                    else {
                        res.status(400).send({error: err.sqlMessage});
                    }
                });
            } 
            else {
                res.status(400).send({error: err.sqlMessage});
            }
        });
    });


//***************** /readings path**********************

//Gets all the readings from a specific plant from a specific user
app.route('/api/users/:user/plants/:plant/readings')
    .get(authJwt, (req, res) => {
        console.log(req.params.plant);
        const sql = `SELECT * FROM Plant_Data WHERE plant_id = ${req.params.plant}`;
        db.query(sql, (err, result) => {
            if (!err) {
                result.forEach((plant) => {
                    plant.date_data = formatDate(plant.date_data);
                    plant.last_watered = formatDate(plant.last_watered);
                    plant.last_calibrated = formatDate(plant.last_calibrated);
                });
                console.log("Get reading: " + JSON.stringify(result));
                res.status(200).json(result);
            } else {
                console.log("Get reading Error: " + err.sqlMessage);
                res.status(400).send({error: err.sqlMessage})
            }
        })
    })

    //Inserts a reading for a user plant. This data will probably be coming from RaspberyPI
    .post(authJwt, (req, res) => {
        if (!isValid(req.body.raw_soil_capacitance) || !isValid(req.body.temperature_data) || !isValid(req.body.humidity_data)
            || !isValid(req.body.moisture_percent)) {
            console.log(req.body);
            res.status(400).send({error: "Missing Fields."});
            return;
        }


        const plantInfo = {
            raw_soil_capacitance: req.body.raw_soil_capacitance,
            temperature_data: req.body.temperature_data,
            humidity_data: req.body.humidity_data,
            plant_id: req.params.plant,
            user_id: req.params.user,
            moisture_percent: req.body.moisture_percent
        };

        if (isValid(req.body.last_watered)) {
            plantInfo.last_watered = req.body.last_watered;
        }

        if (isValid(req.body.last_calibrated)) {
            plantInfo.last_calibrated = req.body.last_calibrated;
        }

        const sql = `INSERT INTO Plant_Data
                     SET ?`;
        db.query(sql, plantInfo, (err, result) => {
            if (!err) {
                console.log("Post reading: " + req.body + " Post Readings summary: " + JSON.stringify(result));
                res.status(200).send({output: 'success'});
            } else {
                console.log("Post reading Error: " + err.sqlMessage);
                res.status(400).send({error: err.sqlMessage});
            }
        });
    })

    //Deletes all the data readings from a specific plant.
    .delete(authJwt, (req, res) => {
        const sql = `DELETE FROM Plant_Data WHERE Plant_id = ${req.params.plant}`;
        db.query(sql, (err, result) => {
            if (!err) {
                console.log("Deleted readings summary: " + JSON.stringify(result));
                res.status(200).send({output: 'success'});
            } else {
                console.log("Error deleting reading: " + err.sqlMessage);
                res.status(400).send({error: err.sqlMessage});
            }
        });
    });


// To Upload pictures testing

app.route('/api/users/:user/plants/:plant/upload')
    .get(authJwt,(req, res) => {
        db.query(`SELECT * FROM plant_images WHERE user_id = ${req.params.user} AND plant_id = ${req.params.plant}`, (err, rows) => {
            console.log(JSON.parse(JSON.stringify(rows)));

            if (!err) {
                res.render('index.hbs', {rows});
            } else {
                res.status(400).send(err.sqlMessage)
            }
        });
    })
    .post(authJwt,(req, res) => {
        if (!isValid(req.files)) {
            return res.status(400).send('No files were uploaded.');
        }
        // name of the input is sampleFile
        const sampleFile = req.files.sampleFile;
        const uploadPath = __dirname + '/public/upload/' + sampleFile.name;
        // This section will move file image into the server folder.
        sampleFile.mv(uploadPath, function (err) {
            if (err) return res.status(500).send(err);
            
            const img = {
                plant_img: sampleFile.name,
                user_id: req.params.user,
                plant_id: req.params.plant
            }
            console.log(img);
            // This section will remove the old file from the server
            const getImageInfo = `SELECT * FROM plant_images WHERE user_id = ${req.params.user} AND plant_id = ${req.params.plant}` 
            db.query(getImageInfo , (err, rows) =>{
                if(!err){
                    console.log("This is what is returned from put request"  + rows);
                    const imagePath = __dirname + '/public/upload/' + rows[0].plant_img;
                    console.log(imagePath);
                    fs.unlink(imagePath, (err) => {
                        if(!err){
                            console.log("Image was removed successfully-Post");
                        } else{
                            console.log("NO Image was found! This is the error: " + err);
                        }
                    });
                }
            });

            // This section will update the relative address of image into the database
            const sql = `UPDATE plant_images SET ? WHERE user_id = ${req.params.user}  AND plant_id = ${req.params.plant}`
            db.query(sql, img, (err, rows) => {
                if (!err) {
                    console.log(rows)
                    console.log("Image was inserted to row: " + rows.insertId);
                    console.log("Relative address was updated to the database");
                    
                } else {
                    res.status(400).send(err.sqlMessage);
                }
            });

        });
        const imgName = req.files.sampleFile.name;
        const copyTabelSQL = `UPDATE Plant_Info SET plant_img1 = ? WHERE user_id= ${req.params.user}  AND plant_id = ${req.params.plant}`
        db.query(copyTabelSQL, imgName, (err, rows) => {
            if (!err) {
                console.log(rows);
                console.log("Updated plant image field in plant Images-Post");
                res.redirect('/api/users/' + req.params.user + '/plants/' + req.params.plant + '/upload')
            } else {
                console.log("I am getting to this error");
                res.status(400).send(err.sqlMessage);
            }
        });
    })
    .delete(authJwt,(req, res) => {
        const getImageInfo = `SELECT * FROM plant_images WHERE user_id = ${req.params.user} AND plant_id = ${req.params.plant}` 
        db.query(getImageInfo , (err, rows) =>{
            if(!err){
                console.log("This is what is returned from put request"  + rows);
                const imagePath = __dirname + '/public/upload/' + rows[0].plant_img;
                console.log(imagePath);
                fs.unlink(imagePath, (err) => {
                    if(!err){
                        console.log("Image was removed successfully-Delete");
                    } else{
                        console.log("NO Image was found! This is the error: " + err);
                    }
                });
            }
        });
        // This will resert the value of image name in the Plant Image table to NULL 
        const updateSql = `UPDATE plant_images SET plant_img = NULL WHERE user_id = ${req.params.user}  AND plant_id = ${req.params.plant}`
        db.query(updateSql, (err, rows) => {
            if (!err) {
                console.log(rows);
                console.log("Table plant_images has been updated- Delete");
            } else {
                res.status(400).send(err.sqlMessage);
            }
        });
        const nullValue = null
        const copyTabelSQL = `UPDATE Plant_Info SET plant_img1 = NULL WHERE user_id = ${req.params.user}  AND plant_id = ${req.params.plant}`
        db.query(copyTabelSQL,nullValue, (err, rows) => {
            if (!err) {
                console.log(rows);
                console.log("Updated plant image field in plant Images-Delete");
                res.redirect('/api/users/' + req.params.user + '/plants/' + req.params.plant + '/upload')
            } else {
                res.status(400).send(err.sqlMessage);
            }
        });


    });


// Comment this out and uncomment app.listen to run locally
httpsServer.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// app.listen(port, () => {
//     console.log(`Server started on port ${port}`);
// });

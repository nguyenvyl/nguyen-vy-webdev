var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require("bcrypt-nodejs");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var unirest = require('unirest');


module.exports = function(app, UserModel, TrailModel) {
    console.log("Hello from user.service.server.js");
    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID,
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL  : process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'email', 'first_name', 'last_name']
    };

    app.use(session({
        secret: 'this is the secret',
        resave: true,
        saveUninitialized: true
    }));


    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use('LocalStrategy', new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        UserModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function localStrategy(username, password, done) {
        UserModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user.username === username && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'User not found!'});
                    }
                },
                function(err) {if (err) { return done(err); }
                }
            );
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        UserModel
            .findUserByFacebookId(profile.id)
            .then(function(user){
                if(user != null){
                    return done(null, user);
                }
                else{ //create a new user in db
                    var newUser={
                        username: profile.emails[0].value.split('@')[0],
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        facebook: {
                            id: profile.id,
                            token: token
                        },
                        picture: 'http://graph.facebook.com/' + profile.id + '/picture?width=400'
                    };
                    UserModel
                        .createUser(newUser)
                        .then(function(user){
                            if(user){
                                return done(null, user);
                            }
                            else{
                                return done(null, false);
                            }
                        })
                    }
                },
                function(err){
                    if(err){
                        return done(err);
                    }
                });
    }

    function findUser(req, res){
        var query = req.query;
        if(query.password && query.username){
            findUserByCredentials(req, res);
        }
        else if(query.username){
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res){
        var username = req.query.username;
        UserModel
            .findUserByUsername(username)
            .then(
                function(response){
                    console.log(response);
                    res.json(response);
                },
                function(err){
                    res.send(err);
                }
            );
    }

    function findUserByCredentials(req, res){
        var user_credentials = req.query;
        UserModel
            .findUserByCredentials(user_credentials)
            .then(function(user){
                res.json(user);
            });
    }

    function findUserById(req, res){
        var userId = req.params.uid;
        UserModel
            .findUserById(userId)
            .then(
                function(response){
                    res.json(response);
                },
                function(err){
                    res.send(err);
                }
            );
    }

    function createUser(req, res){
        console.log("Time to create a user! --user.service.server");
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);

        UserModel
            .findUserByUsername(user.username)
            .then(function(retVal) {
                if (retVal != null) { //user already reg
                    res.send('User exists');
                } else {
                    UserModel
                        .createUser(user)
                        .then(function (retVal) {
                                if (retVal != null) {
                                    console.log("Hello, our user was created!");
                                    res.send(retVal);
                                }
                            },
                            function (err) {
                                res.sendStatus(400).send(err);
                            });
                }
            });

    }

    function updateUser(req, res) {
        var update = req.body;
        var uid = req.params.uid;
        UserModel
            .updateUser(uid, update)
            .then(function (retVal) {
                if (retVal != null) {
                    res.send(retVal);
                }
            },
            function(err){
                res.sendStatus(400).send(err);
            });
    }

    function deleteUser(req, res){
        var uid = req.params.uid;
        UserModel
            .deleteUser(uid)
            .then(function (retVal) {
                if (retVal != null) {
                    res.send(retVal);
                }
            },
            function(err){
                res.sendStatus(400).send(err);
            });

   }

    function login(req, res) {
        var user = req.user;
        if (user != null){
            delete user.password;
            res.json(user);
        }
        else{
            res.sendStatus(404);
        }
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function register (req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        UserModel
            .createUser(user)
            .then(
                function(user){
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                }
            );
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    // Takes the user's list of trail IDs and returns a list of the full trail objects.
    function getTrailList(req, res) {
        var user = req.body;
        UserModel
            .getTrailList(user)
            .then(
                function(retVal){
                   // console.log(retVal);
                   res.send(retVal);
                }
            );
    }

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    function uploadImage(req, res) {
        var user = JSON.parse(req.body.user);
        var myFile = req.file;
        if(!myFile){
            res.redirect("/#/user/"+ user._id);
            return;
        }

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        var extension = originalname.split('.').pop();
        var relPath = "/../../uploads/" + filename;
        var uid = user._id;
        user.picture = relPath;
        UserModel
            .updateUser(uid, user)
            .then(function (retVal) {
                    if (retVal != null) {
                        // res.send(retVal);
                        res.redirect("/#/user/"+ user._id);
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });

    }

    app.post("/api/upload", upload.single('myFile'), uploadImage);
    app.put('/api/getTrailList', getTrailList);
    app.get ('/api/loggedin', loggedin);
    app.get('/api/user', findUser);
    app.get('/api/user/:uid/', findUserById);
    app.post('/api/user/', createUser);
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', deleteUser);


    app.post('/api/logout', logout);
    app.post('api/register', register);
    app.post('/api/login', passport.authenticate('LocalStrategy'), login);
    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // This configuration allows for custom redirecting upon facebook callback.
    app.get('/auth/facebook/callback',function(req, res, next) {
        passport.authenticate('facebook', function (err, user, info) {
            // This is the default destination upon successful login.
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/#/login');
            }
            var redirectUrl = '/#/user/' + user._id;
            // If we have previously stored a redirectUrl, use that,
            // otherwise, use the default.
            if (req.session.redirectUrl) {
                redirectUrl = req.session.redirectUrl;
                req.session.redirectUrl = null;
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
            });
            res.redirect(redirectUrl);
        })(req, res, next);
    });


};
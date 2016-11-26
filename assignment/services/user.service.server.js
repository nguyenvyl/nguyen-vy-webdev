// var _ = require('lodash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
//var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var bcrypt = require("bcrypt-nodejs");
var cookieParser = require('cookie-parser');
var session = require('express-session');


module.exports = function(app, UserModel) {

    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID,
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL  : process.env.FACEBOOK_CALLBACK_URL,
        // enableProof: true
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
        // console.log("Hello from serialize user");
        done(null, user);
    }

    function deserializeUser(user, done) {
        // console.log("Hello from deserialize user");
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
        console.log("Hello from local Strategy");
        console.log(username + " " + password);
        UserModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user.username === username && bcrypt.compareSync(password, user.password)) {
                        // console.log("User found!");
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
        // console.log("Your accessToken is :"+ token);
        // console.log("Your refreshToken is :"+refreshToken );
        // console.log("User Service - Facebook Strategy");
        // console.log(profile);
        UserModel
            .findUserByFacebookId(profile.id)
            .then(function(user){
                if(user != null){
                    console.log("Facebook user found!");
                    return done(null, user);
                }
                else{ //create a new user in db
                    console.log("Facebook user not found. Let's make a new Facebook user");
                    // console.log(profile);
                    var newUser={
                        username: profile.username,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0],
                        facebook: {
                            id: profile.id,
                            token: token
                        }
                    };
                    console.log("Here's the new user:");
                    console.log(newUser);
                    UserModel
                        .createUser(newUser)
                        .then(function(user){
                            if(user){
                                console.log("New Facebook user created");
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
    // Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
//     passport.use(new GoogleStrategy({
//             clientID: GOOGLE_CLIENT_ID,
//             clientSecret: GOOGLE_CLIENT_SECRET,
//             callbackURL: "http://localhost:3000/auth/google/callback"
//         },
//         function(accessToken, refreshToken, profile, done) {
//             UserModel
//                 .findUserByUsername(profile.username)
//                 .then(function(user){
//                         if(user){
//                             return done(null, user);
//                         }else{ //create a new user in db
//                             var email = profile.emails[0].value;
//                             var newUser={
//                                 username: emails.split("@")[0],
//                                 firstName: profile.name.givenName,
//                                 lastName: profile.name.familyName,
//                                 google: {
//                                     id: profile.id,
//                                     token: accessToken
//                                 }
//                             };
//                             return UserModel.createUser(newUser);
//                         }
//                     },
//                     function(err){
//
//                     });
//         }
//     ));


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
        console.log("Hello from login - user.service.server");
        var user = req.user;
        console.log("Here's the user: ");
        console.log(user);
        if (user != null){
            delete user.password;
            res.json(user);
        }
        else{
            res.sendStatus(404);
        }
    }

    function logout(req, res) {
        // console.log("Hello from logout");
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

    app.get ('/api/loggedin', loggedin);
    app.get('/api/user', findUser);
    app.get('/api/user/:uid/', findUserById);
    app.post('/api/user/', createUser);
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', deleteUser);
    app.post('/api/login', passport.authenticate('LocalStrategy'), login);

    app.post('/api/logout', logout);
    app.post('api/register', register);

    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // app.get('/auth/facebook/callback',
    //     passport.authenticate('facebook', {
    //         successRedirect: '/#/user/:uid',
    //         failureRedirect: '/#/login'
    //     }));

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
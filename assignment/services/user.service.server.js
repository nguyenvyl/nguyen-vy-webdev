var _ = require('lodash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require("bcrypt-nodejs");

module.exports = function(app, UserModel) {

    passport.serializeUser(serializeUser);
    function serializeUser(user, done) {
        done(null, user);
    }

    passport.deserializeUser(deserializeUser);
    function deserializeUser(user, done) {
        developerModel
            .findDeveloperById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    passport.use(new LocalStrategy(localStrategy));
    function localStrategy(username, password, done) {
        userModel
            .findUserByCredentials(username, password)
            .then(
                function(user) {
                    if(user.username === username && user.password === password) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function findUser(req, res){
        var query = req.query;
        console.log(query);
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
                    console.log(response);
                    res.json(response);
                },
                function(err){
                    console.log(error);
                    res.send(err);
                }
            );
    }

    function createUser(req, res){
        var user = req.body;
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

        //console.log(WebsiteService);

        // WebsiteModel
        //     .findAllWebsitesForUser(uid)
        //     .then(function(websites){
        //         for(w in websites){
        //             WebsiteModel
        //                 .deleteWebsite(websites[w]._id)
        //                 .then(function(retVal){
        //                     console.log("Website deleted: " + websites[w].name);
        //                 },
        //                 function(err){
        //                     console.log("We had some trouble deleting the user's websites");
        //                     });
        //
        //         }
        //     })
        // var websites = WebsiteService.findAllWebsitesForUser(uid);
        // console.log("Websites for this user are:");
        // console.log(websites);
        // for(w in websites){
        //     WebsiteService.deleteWebsite(websites[w]._id);
        // }
        // console.log("After deletion, websites for this user are: ");
        // console.log(WebsiteService.findAllWebsitesForUser(uid));

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
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function register (req, res) {
        var user = req.body;
        userModel
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



    app.get('/api/user', findUser);
    app.get('/api/user/:uid/', findUserById);
    app.post('/api/user/', createUser);
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', deleteUser);
    app.post('/api/login', passport.authenticate('wam'), login);
    app.post('/api/logout', logout);
    app.post('api/register', register);
};
var _ = require('lodash');

module.exports = function(app, UserModel) {
    console.log("Hi! This is your friendly neighborhood user service!");

    console.log("Here's our UserModel: ");
    console.log(UserModel);

    // var users = [
    //     {
    //         _id: 123,
    //         username: "alice",
    //         password: "alice",
    //         firstName: "Alice",
    //         lastName: "Wonder",
    //         email: "alice@wonder.com"
    //     },
    //     {
    //         _id: 234,
    //         username: "bob",
    //         password: "bob",
    //         firstName: "Bob",
    //         lastName: "Marley",
    //         email: "bob@marley.com"},
    //     {
    //         _id: 345,
    //         username: "charly",
    //         password: "charly",
    //         firstName: "Charly",
    //         lastName: "Garcia",
    //         email: "charly@garcia.com"
    //     },
    //     {
    //         _id: 456,
    //         username: "jannunzi",
    //         password: "jannunzi",
    //         firstName: "Jose",
    //         lastName: "Annunzi",
    //         email: "youtube@prof.com"
    //     }
    // ];

    function findUser(req, res){
        console.log("Time to find a user! --user.service.server.js");
        var params = req.params;
        var query = req.query;
        if(query.password && query.username){
            findUserByCredentials(req, res);
        }
        else if(query.username){
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res){
        console.log("Find user by username -- server");
        var username = req.query.username;
        //var user = UserModel.findUserById(useId);
        UserModel
            .findUserByUsername(username)
            .then(
                function(response){
                    res.json(response);
                },
                function(err){
                    res.send(err);
                }
            );
        //
        // var username = req.query.username;
        //
        // var user = _.find(users, function(user) {
        //    return user.username === username;
        // });
        // console.log("Here's the user we found: ");
        // console.log(user);
        //
        // res.send(user || '0');
    }

    function findUserByCredentials(req, res){
        console.log("Find user by credentials -- server");
        var user_credentials = req.body;

        UserModel
            .findUserByCredentials(user_credentials)
            .then(function(user){
                res.json(user);
            });

        // var username = req.query.username;
        // var password = req.query.password;
        // console.log("We're searching for username " + username + ", password " + password);
        // var user = _.find(users, function (user) {
        //     return user.username === username && user.password === password;
        // });
        // console.log("Here's the user we found: ");
        // console.log(user);
        //
        // res.send(user || '0');
    }

    function findUserById(req, res){
        console.log("Find user by id -- server");
        // var userId = parseInt(req.params.uid);
        //
        // var user = _.find(users, function(user){
        //     return user._id === userId;
        // });
        // console.log(user);
        // res.send(user || '0');

        var useId = req.params.uid;
        //var user = UserModel.findUserById(useId);
        UserModel
            .findUserById(useId)
            .then(
                function(response){
                    res.json(response);
                },
                function(err){
                    res.send(err);
                }
            );

        //res.send(user);
    }

    function createUser(req, res){
        console.log("Create user -- server");
        //
        // var user = req.body;
        // console.log("Hi from user service - server! Here's your new user: ");
        //
        // user._id = (new Date()).getTime();
        // console.log(user);
        // users.push(user);
        // res.send(user);

        var user = req.body;
        UserModel
            .findUserByUsername(user.username)
            .then(function(retVal) {
                if (retVal != null) { //user already reg
                    res.sendStatus(400).send("User already created!");
                } else {
                    UserModel
                        .createUser(user)
                        .then(function (retVal) {
                                if (retVal != null) {
                                    res.sendStatus(200);
                                }
                            },
                            function (err) {
                                res.sendStatus(400).send(err); //res.sendStatus(400).send(err);
                            });
                }
            });

    }

    function updateUser(req, res){
        var newUser = req.body;
        var uid = parseInt(req.params.uid);
        for(var u in users) {
            if(users[u]._id === uid) {
                users[u] = newUser;
            }
        }
        res.sendStatus(200);
    }

    function deleteUser(req, res){
        // console.log("Hello from deleteUser - server");
        var uid = parseInt(req.params.uid);
        // console.log("We're trying to delete user with ID " + uid);

        for(var u in users) {
            // console.log("Checking user " + users[u]._id);
            if(users[u]._id === uid) {
                // console.log("We found em!");
                users.splice(u, 1);
                // console.log(users);
            }
        }
        res.sendStatus(200);
    }

    app.get('/api/user', findUser);
    app.get('/api/user/:uid/', findUserById);
    app.post('/api/user/', createUser);
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', deleteUser);

};
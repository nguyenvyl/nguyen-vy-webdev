var _ = require('lodash');

module.exports = function(app, UserModel) {
    console.log("Hi! This is your friendly neighborhood user service!");

    function findUser(req, res){
        console.log("Time to find a user! --user.service.server.js");
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
        console.log("Find user by username -- server");
        var username = req.query.username;
        UserModel
            .findUserByUsername(username)
            .then(
                function(response){
                    console.log("We found the user!");
                    console.log(response);
                    res.json(response);
                },
                function(err){
                    console.log("Server error :(")
                    res.send(err);
                }
            );
    }

    function findUserByCredentials(req, res){
        console.log("Find user by credentials -- server");

        var user_credentials = req.query;

        UserModel
            .findUserByCredentials(user_credentials)
            .then(function(user){
                res.json(user);
            });
    }

    function findUserById(req, res){
        console.log("Find user by id -- server");

        var useId = req.params.uid;
        console.log("We're searcing for this id: ");
        console.log(useId);

        UserModel
            .findUserById(useId)
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
        console.log("Create user -- server");
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
                                    console.log("User successfully created.");
                                    console.log(retVal);
                                    res.send(retVal);
                                }
                            },
                            function (err) {
                                console.log("Your server ran into an error!");
                                res.sendStatus(400).send(err); //res.sendStatus(400).send(err);
                            });
                }
            });

    }

    function updateUser(req, res) {
        console.log("updateUser - user.service.server.js");
        var update = req.body;
        var uid = req.params.uid;
        console.log("Here's the update we're trying to push: ");
        console.log(update);

        UserModel
            .updateUser(uid, update)
            .then(function (retVal) {
                if (retVal != null) {
                    console.log("User successfully updated!");
                    console.log(retVal);
                    res.send(retVal);
                }
            },
            function(err){
               console.log("Server error!");
                res.sendStatus(400).send(err);
            });
    }

    function deleteUser(req, res){
        console.log("deleteUser - user.service.server.js");
        var uid = req.params.uid;
        UserModel
            .deleteUser(uid)
            .then(function (retVal) {
                if (retVal != null) {
                    console.log("User successfully deleted!");
                    console.log(retVal);
                    res.send(retVal);
                }
            },
            function(err){
               console.log("Server error!");
                res.sendStatus(400).send(err);
            });

   }

    app.get('/api/user', findUser);
    app.get('/api/user/:uid/', findUserById);
    app.post('/api/user/', createUser);
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', deleteUser);

};
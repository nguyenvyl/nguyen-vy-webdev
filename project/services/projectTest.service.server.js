var _ = require('lodash');

module.exports = function(app) {
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

    app.get('/api/user', findUser);
    app.get('/api/user/:uid/', findUserById);
    app.post('/api/user/', createUser);
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', deleteUser);

};

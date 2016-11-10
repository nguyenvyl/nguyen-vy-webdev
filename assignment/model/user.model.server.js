//"use strict"
//var users = require("./user.mock.json");
//var guid = require("guid");

var q = require("q");

module.exports=function(mongoose, db){

    var userSchema = require("./user.schema.server.js")(mongoose);
    var userModel = mongoose.model("userModel", userSchema);

    //var userModel = require("./user.schema.server.js")(mongoose);

    var api;


    //CRUD
    //user sample: "_id": "123", "username": "alice",    "password": "alice",    "firstName": "Alice",  "lastName": "Wonder"
    //function createUser(user)
     // {
     // var newUser = {
     // _id: Guid.create(),
     // username : user.username,
     // password : user.password,
     // firstName : user.firstName,
     // lastName : user.lastName
     // };
     // users.push(newUser);
     // return newUser;
     // }

    //insert user into mongodb using q
    function createUser (user) {
        var deferred = q.defer();
        userModel.create(user, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function findAllUsers()
    {
        //return users;
        var deferred = q.defer();

        userModel.find(function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function findUserById(id)
    {
        /* var user = null;
         for (var i = 0; i < users.length; i++) {
         if (users[i]._id == id) {
         user = users[i];
         break;
         }
         }
         return user;*/
        //return users;
        var deferred = q.defer();

        userModel.findById(id, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function updateUserById(id, user)
    {
        /*var user = null;
         for (var i = 0; i < users.length; i++) {
         if (users[i]._id == id) {
         console.log("found this id");
         users[i] = {
         _id: id,
         username: user.username,
         password: user.password,
         firstName : user.firstName,
         lastName : user.lastName,
         };
         user = users[i];
         break;
         }
         }
         return user;*/

        var deferred = q.defer();

        userModel.update({_id: id},{$set: user}, function(err, retVal){
        if (err) {
            deferred.reject(err);
        }
        else{
            deferred.resolve(retVal);
        }
    });
        return deferred.promise;

    }

    function deleteUserById(id)
    {
        /*for (var i = 0; i < users.length; i++) {
         if (users[i]._id == id) {
         users.splice(i, 1);
         }
         }
         return users;*/


        var deferred = q.defer();

        userModel.remove({_id: id}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;    }

    function findUserByUsername(username)
    {
        /*var user = null;
         for (var i = 0; i < users.length; i++) {
         if (users[i].username == username) {
         user = users[i];
         break;
         }
         }
         return user;*/

        var deferred = q.defer();

        userModel.findOne({username: username}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function findUserByCredentials(credentials)
    {
        /*var user = null;
         for (var i = 0; i < users.length; i++) {
         if (users[i].username == credentials.username && users[i].password == credentials.password) {
         user = users[i];
         }
         }
         return user;*/
        var deferred = q.defer();

        userModel.findOne(
            {
                username: credentials.username,
                password: credentials.password
            }, function(err, retVal){
                if (err) {
                    deferred.reject(err);
                }
                else{
                    deferred.resolve(retVal);
                }
            });
        return deferred.promise;
    }

    api = {
        createUser: createUser,
        findAllUsers: findAllUsers,
        findUserById: findUserById,
        updateUserById: updateUserById,
        deleteUserById: deleteUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials
    };
    return api;
}
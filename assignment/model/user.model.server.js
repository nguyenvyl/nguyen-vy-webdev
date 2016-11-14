//"use strict"
//var users = require("./user.mock.json");
//var guid = require("guid");

var q = require("q");

module.exports=function(mongoose, db){

    var userSchema = require("./user.schema.server.js")(mongoose);
    var userModel = mongoose.model("userModel", userSchema);
    var api;

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

    function findUserById(id) {
        var deferred = q.defer();

        userModel.findById(id, function(err, retVal){
            if (err) {
                console.log("User not found!");
                deferred.reject(err);
            }
            else{
                console.log("User found!");
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function updateUser(id, user)
    {
        var deferred = q.defer();

        userModel.update({_id: id},{$set: user}, function(err, retVal){
        if (err) {
            console.log("User not able to be updated!");
            deferred.reject(err);
        }
        else{
            console.log("User updated!");
            deferred.resolve(retVal);
        }
    });
        console.log(deferred.promise);
        return deferred.promise;
    }

    function deleteUser(id){
        var deferred = q.defer();

        userModel.remove({_id: id}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function findUserByUsername(username)
    {
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

    function findUserByCredentials(credentials) {
        var deferred = q.defer();

        userModel.findOne(
            {
                username: credentials.username,
                password: credentials.password
            }, function(err, retVal){
                if (err) {
                    console.log("Whoops we done had an error");
                    deferred.reject(err);
                }
                else{
                    console.log(retVal);
                    deferred.resolve(retVal);
                }
            });
        return deferred.promise;
    }

    api = {
        createUser: createUser,
        findAllUsers: findAllUsers,
        findUserById: findUserById,
        updateUser: updateUser,
        deleteUser: deleteUser,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials
    };
    return api;
}
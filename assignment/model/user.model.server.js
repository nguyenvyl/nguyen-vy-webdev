"use strict";

var q = require("q");

// var require("./website.model.server.js")();

module.exports=function(mongoose, db, UserMongooseModel, WebsiteModel){

    var api;

    //insert user into mongodb using q
    function createUser(user){
        console.log("Hello from createUser - user.model");
        console.log("We want to make this user:");
        console.log(user);
        var deferred = q.defer();
        UserMongooseModel.create(user, function(err, retVal){
            console.log("We got this response:");
            console.log(retVal);
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
                console.log(retVal);
            }
        });
        return deferred.promise;
    }

    function findAllUsers(){
        var deferred = q.defer();
        UserMongooseModel.find(function(err, retVal){
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
        UserMongooseModel.findById(id, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function updateUser(id, user)
    {
        var deferred = q.defer();
        UserMongooseModel.update({_id: id},{$set: user}, function(err, retVal){
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

    function deleteUser(id) {

        // Delete all the user's websites.
        WebsiteModel
            .findAllWebsitesForUser(id)
            .then(function (websites) {
                console.log(websites);
                if (websites != null) {
                    var w;
                    for (w in websites) {
                        WebsiteModel.deleteWebsite(websites[w]._id);
                    }
                }
            });

        // Delete the user.
        var deferred = q.defer();
        UserMongooseModel.remove({_id: id}, function (err, retVal) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }


    function findUserByUsername(username){
        // console.log("Hello from find user by username");
        var deferred = q.defer();
        UserMongooseModel.findOne({username: username}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                // console.log(retVal);
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function findUserByCredentials(username, password) {
        console.log("Hello from find user by credentials");
        var deferred = q.defer();
        UserMongooseModel.findOne(
            {
                username: username,
                password: password
            }, function(err, retVal){
                if (err) {
                    console.log("Error finding user in the database");
                    deferred.reject(err);
                }
                else{
                    console.log("User found!");
                    deferred.resolve(retVal);
                    console.log(retVal);
                }
            });
        return deferred.promise;
    }

    function findUserByFacebookId(facebookId) {
        console.log("Hello from findUserByFacebookId - User.model.server.js");
        var deferred = q.defer();
        UserMongooseModel.findOne({'facebook.id': facebookId},
            function(err, retVal){
                if(err){
                    deferred.reject(err);
                }
                else{
                    console.log("Here's the Facebook user we found in our database:");
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
        findUserByCredentials: findUserByCredentials,
        findUserByFacebookId: findUserByFacebookId
    };
    return api;
};
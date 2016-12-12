"use strict";

var q = require("q");


module.exports=function(mongoose, db, UserMongooseModel, TrailMongooseModel){
    var api;
    //insert user into mongodb using q
    function createUser(user){
        var deferred = q.defer();
        UserMongooseModel.create(user, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
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
            deferred.resolve(retVal);
        }
    });
        console.log(deferred.promise);
        return deferred.promise;
    }

    function deleteUser(id) {
        var deferred = q.defer();
        UserMongooseModel
            .findById(id)
            .populate('trails')
            .exec (function(err, user){
                if(err){
                    deferred.reject(err);
                }
                else{
                    var stringtrails = JSON.stringify(user.trails);
                    var trails = JSON.parse(stringtrails);
                    var t;
                    // For every trail
                    for(t in trails){
                        var u;
                        // Check the trail's list of users for our user
                        for(u = 1; u < trails[t].users.length; u++){
                            if(trails[t].users[u] == user._id){
                                // Delete the user from that trail
                                trails[t].users.splice(u, 1);
                                break;
                            }
                        }
                        if(trails[t].users.length == 0){
                            TrailMongooseModel
                                .remove({_id: trails[t]._id}, function (err, retVal) {
                                    if (err) {
                                        deferred.reject(err);
                                    }
                                    else {
                                    }
                                });
                        }
                        else{
                            TrailMongooseModel
                                .update({_id: trails[t]._id},{$set: trails[t]}, function(err, retVal){
                                if (err) {
                                    deferred.reject(err);
                                }
                                else{
                                }
                                });
                        }
                    }
                }
            });

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
        var deferred = q.defer();
        UserMongooseModel.findOne({username: username}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function findUserByCredentials(username, password) {
        var deferred = q.defer();
        UserMongooseModel.findOne(
            {
                username: username,
                password: password
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

    function findUserByFacebookId(facebookId) {
        var deferred = q.defer();
        UserMongooseModel.findOne({'facebook.id': facebookId},
            function(err, retVal){
                if(err){
                    deferred.reject(err);
                }
                else{
                    deferred.resolve(retVal);
                }
        });
        return deferred.promise;
    }

    function getTrailList(user){
        var deferred = q.defer();
        UserMongooseModel
            .findById(user._id)
            .populate('trails')
            .exec (function(err, retVal){
                if(err){
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
        updateUser: updateUser,
        deleteUser: deleteUser,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        findUserByFacebookId: findUserByFacebookId,
        getTrailList: getTrailList
    };
    return api;
};
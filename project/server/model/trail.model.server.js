"use strict";

var q = require("q");

module.exports=function(mongoose, db, TrailMongooseModel, UserMongooseModel){
    console.log("Hello from trail.model.server.js");
    var api;

    //insert trail into mongodb using q
    function createTrail(trail){
        var deferred = q.defer();
        TrailMongooseModel.create(trail, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function findTrailByUniqueId(uniqueId){
        var deferred = q.defer();
        TrailMongooseModel.findOne({unique_id: uniqueId}, function(err, retVal){
            if(err){
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    // function findAllUsers(){
    //     var deferred = q.defer();
    //     UserMongooseModel.find(function(err, retVal){
    //         if (err) {
    //             deferred.reject(err);
    //         }
    //         else{
    //             deferred.resolve(retVal);
    //         }
    //     });
    //     return deferred.promise;
    // }

    function findTrailById(id) {
        var deferred = q.defer();
        TrailMongooseModel.findById(id, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function updateTrail(id, trail){
        var deferred = q.defer();
        TrailMongooseModel.update({_id: id},{$set: trail}, function(err, retVal){
        if (err) {
            deferred.reject(err);
        }
        else{
            deferred.resolve(retVal);
        }
    });
        return deferred.promise;
    }

    function deleteTrail(id) {
        // Delete the trail
        var deferred = q.defer();
        TrailMongooseModel.remove({_id: id}, function (err, retVal) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function getUserList(trail){
        var deferred = q.defer();
        TrailMongooseModel
            .findOne({unique_id: trail.unique_id})
            .populate('users')
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
        createTrail: createTrail,
        findTrailById: findTrailById,
        deleteTrail: deleteTrail,
        findTrailByUniqueId: findTrailByUniqueId,
        updateTrail: updateTrail,
        getUserList: getUserList
    };
    return api;
};
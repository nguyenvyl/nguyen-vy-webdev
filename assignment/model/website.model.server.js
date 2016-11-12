"use strict"

var q = require("q");

module.exports=function(mongoose, db){
    //connect to mongo db
    var websiteSchema = require("./website.schema.server.js")(mongoose);
    var websiteModel = mongoose.model("Website", websiteSchema);
    var api;

    function findWebsiteById (websiteId){
        console.log("This is findwebsitebyId - website.model.server.js");
        var deferred = q.defer();
        websiteModel.findById(websiteId, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        console.log("The model found this website: ");
        console.log(deferred.promise);
        return deferred.promise;

    }

    function createWebsite(userId, website){
        console.log("Hello from createWebsite - website.model.server.js");
        website._user = userId;

        //websites.push(website); -- reference user
        var deferred = q.defer();

        websiteModel.create(website, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function findAllWebsitesForUser(uid){

        var deferred = q.defer();

        websiteModel.find({_user: uid}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }


    function updateWebsite(wid, website){
        var deferred = q.defer();

        websiteModel.update({_id: wid}, {$set: website}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function deleteWebsite(websiteId){
        var deferred = q.defer();

        websiteModel.remove({_id: websiteId}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    api ={
        createWebsite: createWebsite,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite
    };
    return api;
}
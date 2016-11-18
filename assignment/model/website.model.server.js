"use strict";

var q = require("q");

module.exports=function(mongoose, db, WebsiteMongooseModel, PageModel, UserMongooseModel){

    var api;

    function findWebsiteById (websiteId){
        var deferred = q.defer();
        WebsiteMongooseModel.findById(websiteId, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function createWebsite(userId, website){
        website._user = userId;


        var deferred = q.defer();
        WebsiteMongooseModel.create(website, function(err, newWebsite){
            if (err) {
                deferred.reject(err);
            }
            else{
                UserMongooseModel.findById(userId, function(err, user){
                    if(err){
                        deferred.reject("The user you're trying to make a website for doesn't exist!");
                        deleteWebsite(newWebsite._id);
                    }
                    else{
                        console.log("Website ID: " + newWebsite._id);
                        user._websites.push(newWebsite._id);
                        user.save();
                        deferred.resolve(newWebsite);
                    }
                });
            }
        });
        return deferred.promise;
    }

    function findAllWebsitesForUser(uid){
        var deferred = q.defer();
        WebsiteMongooseModel.find({_user: uid}, function(err, retVal){
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

        WebsiteMongooseModel.update({_id: wid}, {$set: website}, function(err, retVal){
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

        // Delete all of the website's pages
        PageModel
            .findAllPagesForWebsite(websiteId)
            .then(function(pages){
                if(pages != null){
                    var p;
                    for(p in pages){
                        PageModel.deletePage(pages[p]._id);
                    }
            }
        });

        // Delete the website.
        WebsiteMongooseModel.remove({_id: websiteId}, function(err, retVal){
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
};
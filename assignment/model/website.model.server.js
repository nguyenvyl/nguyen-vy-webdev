"use strict"
var websites = require("./websites.mock.json");
var q = require("q");

module.exports=function(){
    //connect to mongo db
    var websiteSchema = require("./websites.schema.server.js")(mongoose);
    var websiteModel = mongoose.model("Website", websiteSchema);


    var api ={
        createWebsiteForUser: createWebsiteForUser,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite
    };

    return api;


    /*Function Signature
     createWebsiteForUser(userId, website)
     */

    function findWebsiteById (webId){
        /*for(var i=0; i<websites.length; i++){
         if(websites[i]._id == webId){
         return websites[i];
         }
         }
         return null;*/

        var deferred = q.defer();

        websiteModel.findById(webId, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;

    }

    function createWebsiteForUser(userId, website){
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
        /*var u_websites = [];
         for(var w in websites){
         if(websites[w].developerId == uid){
         u_websites.push(websites[w]);
         }
         }
         return u_websites;*/
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
        /* for(var w in websites){
         if(websites[w]._id == wid){
         websites[w].name = website.name;
         websites[w].description = website.description;
         break;
         }
         }*/

        var deferred = q.defer();

        websiteModel.update({_id: wid}, {$set: webiste}, function(err, retVal){
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

        websiteModel.remove(websiteId, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }
}
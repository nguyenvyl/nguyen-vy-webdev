
"use strict";

var q = require("q");

module.exports=function(mongoose, db, PageMongooseModel, WidgetModel, WebsiteMongooseModel) {

    var api;

    function createPage(websiteId, page){
        page._website = websiteId;

        var websiteDeferred = q.defer();
        WebsiteMongooseModel.findById(websiteId, function(err, website){
            if(err){
                websiteDeferred.reject("The website you're trying to make a page for doesn't exist!");
                return websiteDeferred.promise;
            }
            else{
                website._pages.push(page._id);
                website.save();
            }
        });
        
        var deferred = q.defer();

        PageMongooseModel.create(page, function(err, retVal){
            if (err) {
                console.log("page model - create page ran into an error");
                console.log(err);
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function findpageById(pageId){
        var deferred = q.defer();
        PageMongooseModel.findById(pageId, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }
    
    
    function findAllPagesForWebsite(websiteId){
        var deferred = q.defer();

        PageMongooseModel.find({_website: websiteId}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });

        return deferred.promise;

    }

    function updatePage(pageId, page){

        var deferred = q.defer();

        PageMongooseModel.update({_id: pageId}, {$set: page}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function deletePage(pageId){

        var deferred = q.defer();

        WidgetModel
            .findAllWidgetsForPage(pageId)
            .then(function(widgets){
                if(widgets != null) {
                    var w;
                    for (w in widgets) {
                        WidgetModel.deleteWidget(widgets[w]._id);
                    }
                }
            });

        PageMongooseModel.remove({_id: pageId}, function(err, retVal){
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
        createPage: createPage,
        findPageById: findpageById,
        findAllPagesForWebsite: findAllPagesForWebsite,
        updatePage: updatePage,
        deletePage: deletePage
    };
    return api;
};
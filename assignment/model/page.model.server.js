
"use strict"

var q = require("q");

module.exports=function(mongoose, db) {
    var pageSchema = require("./page.schema.server.js")(mongoose);
    var pageModel = mongoose.model("Page", pageSchema);
    var api;

    function createPage(websiteId, page){

        console.log("Hello from createPage - page.model.server.js");
        console.log("We're trying to make this page:");

        page._website = websiteId;
        console.log(page);

        var deferred = q.defer();

        pageModel.create(page, function(err, retVal){
            if (err) {
                console.log("page model - create page ran into an error");
                console.log(err);
                deferred.reject(err);
            }
            else{
                console.log("page model - create page success!");
                deferred.resolve(retVal);
            }
        });

        console.log(deferred.promise);
        return deferred.promise;
        
    }

    function findpageById(pageId){
        console.log("This is find page by id - page.model.server.js");
        var deferred = q.defer();
        pageModel.findById(pageId, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        console.log("The model found this page: ");
        console.log(deferred.promise);
        return deferred.promise;
    }
    
    
    function findAllPagesForWebsite(websiteId){
         var deferred = q.defer();

        pageModel.find({_website: websiteId}, function(err, retVal){
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

        pageModel.update({_id: pageId}, {$set: page}, function(err, retVal){
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
        console.log("hello from deletePage - page.model.server.js");
        var deferred = q.defer();

        pageModel.remove({_id: pageId}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        //console.log(deferred.promise);
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
}
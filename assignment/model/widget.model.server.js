
"use strict"

var q = require("q");

module.exports=function(mongoose, db, WidgetMongooseModel, PageMongooseModel) {

    var api;

    function createWidget(pageId, widget){

        widget._page = pageId;
        var pageDeferred = q.defer();
        PageMongooseModel.findById(pageId, function(err, page){
            if(err){
                pageDeferred.reject("The page you're trying to make a widget for doesn't exist!");
                return pageDeferred.promise();
            }
            else{
                page._widgets.push(widget._id);
                page.save();
            }
        });

        var deferred = q.defer();

        WidgetMongooseModel.create(widget, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function findWidgetById(widgetId){
        //console.log("This is find widget by id - widget.model.server.js");
        var deferred = q.defer();
        WidgetMongooseModel.findById(widgetId, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        //console.log("The model found this widget: ");
        //console.log(deferred.promise);
        return deferred.promise;
    }


    function findAllWidgetsForPage(pageId){
        var deferred = q.defer();

        WidgetMongooseModel.find({_page: pageId}, function(err, retVal){
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

    function updateWidget(widgetId, widget){

        var deferred = q.defer();

        WidgetMongooseModel.update({_id: widgetId}, {$set: widget}, function(err, retVal){
            if (err) {
                deferred.reject(err);
            }
            else{
                deferred.resolve(retVal);
            }
        });
        return deferred.promise;
    }

    function deleteWidget(widgetId){
        //console.log("hello from deleteWidget - widget.model.server.js");
        var deferred = q.defer();

        WidgetMongooseModel.remove({_id: widgetId}, function(err, retVal){
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
        createWidget: createWidget,
        findWidgetById: findWidgetById,
        findAllWidgetsForPage: findAllWidgetsForPage,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget
    };
    return api;
};

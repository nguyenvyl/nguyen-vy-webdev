
"use strict"

var q = require("q");

module.exports=function(mongoose, db) {
    var widgetSchema = require("./widget.schema.server.js")(mongoose);
    var widgetModel = mongoose.model("Widget", widgetSchema);
    var api;

    function createWidget(pageId, widget){

        //console.log("Hello from createWidget - widget.model.server.js");
        //console.log("We're trying to make this widget:");

        widget._page = pageId;
        //console.log(widget);

        var deferred = q.defer();

        widgetModel.create(widget, function(err, retVal){
            if (err) {
                //console.log("widget model - create widget ran into an error");
                //console.log(err);
                deferred.reject(err);
            }
            else{
                //console.log("widget model - create widget success!");
                deferred.resolve(retVal);
            }
        });

        //console.log(deferred.promise);
        return deferred.promise;

    }

    function findWidgetById(widgetId){
        //console.log("This is find widget by id - widget.model.server.js");
        var deferred = q.defer();
        widgetModel.findById(widgetId, function(err, retVal){
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

        widgetModel.find({_page: pageId}, function(err, retVal){
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

        widgetModel.update({_id: widgetId}, {$set: widget}, function(err, retVal){
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

        widgetModel.remove({_id: widgetId}, function(err, retVal){
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
}

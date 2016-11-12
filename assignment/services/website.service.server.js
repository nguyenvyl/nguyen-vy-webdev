var _ = require('lodash');

module.exports = function(app, WebsiteModel) {
    console.log("Hi! This is your friendly neighborhood website service!");

    function createWebsite(req, res) {
        //console.log("Hi from createWebsite - server side!");
        var uid = req.params.userId;

        var website = req.body;

        WebsiteModel
            .createWebsite(uid, website)
            .then(function(retVal){
                    //console.log("Your website was created!:");
                    //console.log(retVal);
                    res.send(retVal);
                },
                function(err){
                    console.log("We done got an error, bruh");
                    res.sendStatus(400).send(err);
                });
    }


    function findAllWebsitesForUser(req, res) {
        //console.log("This is find all websites for user, server!");
        var uid = req.params.userId;

        WebsiteModel
            .findAllWebsitesForUser(uid)
            .then(function(retVal) {
                //console.log("Here's the websites found for user " + uid);
                //console.log(retVal);
                res.send(retVal);
                },
                function(err){
                    console.log("Error on findAllWebsitesForUser - website.server.server.js");
                    res.sendStatus(400).send(err);
                });
    }

    function findWebsiteById(req, res){
        console.log("This is find website by ID, website.service.server.js");
        var websiteId = req.params.websiteId;

        WebsiteModel
            .findWebsiteById(websiteId)
            .then(function(retVal) {
                //console.log("Here's the website we found for website id " + websiteId);
                console.log(retVal);
                res.send(retVal);
                },
                function(err){
                    console.log("Error on find website by id - website.server.server.js");
                    res.sendStatus(400).send(err);
                });
    }

    function updateWebsite(req, res){
        var update = req.body;
        var websiteId= req.params.websiteId;

        WebsiteModel
            .updateWebsite(websiteId, update)
            .then(function(retVal){
                console.log("Here's our updated website for site " + websiteId);
                console.log(retVal);
                res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });

    }

    function deleteWebsite(req, res){
        //console.log("Hello from deleteWebsite - server");
        var websiteId = req.params.websiteId;
        //console.log("We're trying to delete website with ID " + websiteId);

         WebsiteModel
            .deleteWebsite(websiteId)
            .then(function(retVal){
                res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });

    }


    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.post("/api/user/:userId/website", createWebsite);
    app.put("/api/website/:websiteId", updateWebsite);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.delete("/api/website/:websiteId", deleteWebsite);

};
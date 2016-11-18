var _ = require('lodash');

module.exports = function(app, WebsiteModel) {
    // console.log("Hi! This is your friendly neighborhood website service!");

    function createWebsite(req, res) {
        var uid = req.params.userId;
        var website = req.body;
        WebsiteModel
            .createWebsite(uid, website)
            .then(function(retVal){
                    res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }


    function findAllWebsitesForUser(req, res) {
        var uid = req.params.userId;
        WebsiteModel
            .findAllWebsitesForUser(uid)
            .then(function(retVal) {
                res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function findWebsiteById(req, res){
        var websiteId = req.params.websiteId;
        WebsiteModel
            .findWebsiteById(websiteId)
            .then(function(retVal) {
                res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function updateWebsite(req, res){
        var update = req.body;
        var websiteId= req.params.websiteId;

        WebsiteModel
            .updateWebsite(websiteId, update)
            .then(function(retVal){
                res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });

    }

    function deleteWebsite(req, res){
        var websiteId = req.params.websiteId;
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
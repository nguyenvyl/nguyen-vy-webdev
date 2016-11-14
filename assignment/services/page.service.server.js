var _ = require('lodash');

module.exports = function(app, PageModel) {
    console.log("Hi! This is your friendly neighborhood page service!");

    function createPage(req, res) {
        var websiteId = req.params.websiteId;
        var page = req.body;

        PageModel
            .createPage(websiteId, page)
            .then(function(retVal){
                    res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params.websiteId;
        PageModel
            .findAllPagesForWebsite(websiteId)
            .then(function(retVal) {
                res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
        
   }

    function findPageById(req, res){
        var pageId = req.params.pageId;
        PageModel
            .findPageById(pageId)
            .then(function(retVal) {
                    res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function updatePage(req, res){
        var update = req.body;
        var pageId= req.params.pageId;

        PageModel
            .updatePage(pageId, update)
            .then(function(retVal){
                    res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function deletePage(req, res){
        var pageId = req.params.pageId;
        PageModel
            .deletePage(pageId)
            .then(function(retVal){
                    res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.post("/api/website/:websiteId/page", createPage);
    app.put("/api/page/:pageId", updatePage);
    app.get("/api/page/:pageId", findPageById);
    app.delete("/api/page/:pageId", deletePage);

};
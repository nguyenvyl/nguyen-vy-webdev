var _ = require('lodash');

module.exports = function(app, PageModel) {
    console.log("Hi! This is your friendly neighborhood page service!");

    function createPage(req, res) {
        console.log("Hi from createPage - server side!");
        var websiteId = req.params.websiteId;

        var page = req.body;

        PageModel
            .createPage(websiteId, page)
            .then(function(retVal){
                    //console.log("Your page was created!:");
                    //console.log(retVal);
                    res.send(retVal);
                },
                function(err){
                    console.log("We done got an error, bruh");
                    res.sendStatus(400).send(err);
                });
 
    }

    function findAllPagesForWebsite(req, res) {
        //console.log("This is find all pages for user, server!");
        var websiteId = req.params.websiteId;

        PageModel
            .findAllPagesForWebsite(websiteId)
            .then(function(retVal) {
                //console.log("Here's the pages found for website" + websiteId);
                console.log(retVal);
                res.send(retVal);
                },
                function(err){
                    console.log("Error on findAllPagesForWebsite - page.server.server.js");
                    res.sendStatus(400).send(err);
                });
        
   }

    function findPageById(req, res){
        console.log("This is find page by ID, page.service.server.js");
        var pageId = req.params.pageId;

        PageModel
            .findPageById(pageId)
            .then(function(retVal) {
                    //console.log("Here's the page we found for page id " + pageId);
                    //console.log(retVal);
                    res.send(retVal);
                },
                function(err){
                    console.log("Error on find page by id - page.server.server.js");
                    res.sendStatus(400).send(err);
                });

    }

    function updatePage(req, res){
        var update = req.body;
        var pageId= req.params.pageId;

        PageModel
            .updatePage(pageId, update)
            .then(function(retVal){
                    //console.log("Here's our updated page for site " + pageId);
                    //console.log(retVal);
                    res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
        
    }

    function deletePage(req, res){
        console.log("Hello from deletePage - server");
        var pageId = req.params.pageId;
        console.log("We're trying to delete page with ID " + pageId);

        PageModel
            .deletePage(pageId)
            .then(function(retVal){
                    console.log("Page deleted!");
                    console.log(retVal);
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
var _ = require('lodash');

module.exports = function(app, PageModel) {
    console.log("Hi! This is your friendly neighborhood website service!");
    var pages = [
        {_id: 321, name: "Post 1", websiteId: 456, title: "This is post 1"},
        {_id: 432, name: "Post 2", websiteId: 456, title: "This is post 2"},
        {_id: 543, name: "Post 3", websiteId: 456, title: "This is post 3"},
        {_id: 443, name: "Vy's test page", websiteId: 567, title: "Vy test page"},
        {_id: 111, name: "Another page", websiteId: 321, title: "This be a page"},
        {_id: 403, name: "wiki page", websiteId: 432, title: "Wiki page"},
        {_id: 404, name: "another wiki page", websiteId: 432, title: "Some other wiki page"}
    ];


    function createPage(req, res) {
        console.log("Hi from createPage - server side!");
        var page = req.body;
        console.log("Here's the page we're adding: ");
        console.log(page);
        pages.push(page);
        res.send(page);
    }



    function findAllPagesForWebsite(req, res) {
        console.log("This is find all pages for user, server!")
        var uid = req.params.userId;
        var result = [];
        for(var w in pages) {
            if(pages[w].developerId == uid) {
                result.push(pages[w]);
            }
        }
        res.json(result);
    }

    function findPageById(req, res){
        // console.log("This is find page by ID, server side!");
        var pageId = parseInt(req.params.pageId);

        var page = _.find(pages, function(page){
            return page._id === pageId;
        });
        // console.log("Here's the page we found for id " + pageId);
        // console.log(page);
        res.send(page || '0');
    }

    function updatePage(req, res){
        // console.log("This is update page, server!");
        // console.log("Here's the update we want:");
        var update = req.body;
        //console.log(update);

        var pageId= parseInt(req.params.pageId);
       // console.log("The page's id is " + pageId);
        for(var w in pages) {
            if(pages[p]._id === pageId) {
                pages[p] = update;
            }
        }
        res.sendStatus(200);
    }

    function deletePage(req, res){
        console.log("Hello from deletePage - server");
        var pageId = parseInt(req.params.pageId);
        console.log("We're trying to delete page with ID " + pageId);

        for(var p in pages) {
            if(pages[p]._id === pageId) {
                console.log("We found em!");
                pages.splice(p, 1);
            }
        }
        res.sendStatus(200);
    }


    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.post("/api/website/:websiteId/page", createPage);
    app.put("/api/page/:pageId", updatePage);
    app.get("/api/page/:pageId", findPageById);
    app.delete("/api/page/:pageId", deletePage);

};
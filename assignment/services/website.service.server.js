var _ = require('lodash');

module.exports = function(app, WebsiteModel) {
    console.log("Hi! This is your friendly neighborhood website service!");
    var websites = [
        { _id: 321, name: 'facebook.com',developerId: 123,  description:"Hello facebook!"},
        { _id: 432, name: 'wikipedia.org',developerId: 123, description:"Hello wikipedia!"},
        { _id: 543, name: 'twitter.com', developerId: 234,  description:"Hello twitter!"},
        { _id: 123, name: "Facebook",    developerId: 456 , description: "This is Facebook!"},
        { _id: 234, name: "Tweeter",     developerId: 456 , description: "This is bootleg twitter!"},
        { _id: 456, name: "Gizmodo",     developerId: 456 , description: "This is some nerdy site!"},
        { _id: 567, name: "Tic Tac Toe", developerId: 123 , description: "This is a kid's game!"},
        { _id: 678, name: "Checkers",    developerId: 123 , description: "This is a the game of champions!"},
        { _id: 789, name: "Chess",       developerId: 234 , description: "This is a game of super geniuses!"}
    ];


    function createWebsite(req, res) {
        console.log("Hi from createWebsite - server side!");
        var website = req.body;
        console.log("Here's the website we're adding: ");
        console.log(website);
        websites.push(website);
        res.send(website);
    }



    function findAllWebsitesForUser(req, res) {
        console.log("This is find all websites for user, server!")
        var uid = req.params.userId;
        var result = [];
        for(var w in websites) {
            if(websites[w].developerId == uid) {
                result.push(websites[w]);
            }
        }
        res.json(result);
    }

    function findWebsiteById(req, res){
        // console.log("This is find website by ID, server side!");
        var websiteId = parseInt(req.params.websiteId);

        var website = _.find(websites, function(website){
            return website._id === websiteId;
        });
        // console.log("Here's the website we found for id " + websiteId);
        // console.log(website);
        res.send(website || '0');
    }

    function updateWebsite(req, res){
        // console.log("This is update website, server!");
        // console.log("Here's the update we want:");
        var update = req.body;
        //console.log(update);

        var websiteId= parseInt(req.params.websiteId);
       // console.log("The website's id is " + websiteId);
        for(var w in websites) {
            if(websites[w]._id === websiteId) {
                websites[w] = update;
            }
        }
        res.sendStatus(200);
    }

    function deleteWebsite(req, res){
        console.log("Hello from deleteWebsite - server");
        var websiteId = parseInt(req.params.websiteId);
        console.log("We're trying to delete website with ID " + websiteId);

        for(var w in websites) {
            if(websites[w]._id === websiteId) {
                console.log("We found em!");
                websites.splice(w, 1);
            }
        }
        res.sendStatus(200);
    }


    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.post("/api/user/:userId/website", createWebsite);
    app.put("/api/website/:websiteId", updateWebsite);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.delete("/api/website/:websiteId", deleteWebsite);

};
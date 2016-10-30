var _ = require('lodash');

module.exports = function(app, UserModel) {
    console.log("Hi! This is your friendly neighborhood user service!");
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
        var website = req.body;
        websites.push(website);
        res.send(websites);
    }

    function findAllWebsitesForUser(req, res) {
        var uid = req.params.userId;
        var result = [];
        for(var w in websites) {
            if(websites[w].uid == uid) {
                result.push(websites[w]);
            }
        }
        res.json(result);
    }


    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.post("/api/user/:userId/website", createWebsite);


};
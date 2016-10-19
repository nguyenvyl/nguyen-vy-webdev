(function() {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);
    function WebsiteService() {
        var websites = [
            { _id: 123, name: "Facebook",    developerId: 456 , description: "This is Facebook!"},
            { _id: 234, name: "Tweeter",     developerId: 456 , description: "This is bootleg twitter!"},
            { _id: 456, name: "Gizmodo",     developerId: 456 , description: "This is some nerdy site!"},
            { _id: 567, name: "Tic Tac Toe", developerId: 123 , description: "This is a kid's game!"},
            { _id: 678, name: "Checkers",    developerId: 123 , description: "This is a the game of champions!"},
            { _id: 789, name: "Chess",       developerId: 234 , description: "This is a game of super geniuses!"}
        ],
            api;

        function createWebsite(userId, website) {
            website.developerId = userId;
            websites.push(website);
        }

        function findWebsiteByUser(userId){
            var result = [];
            for(var w in websites) {
                if(websites[w].developerId === userId) {
                    result.push(websites[w]);
                }
            }
            return result;
        }


        function findWebsiteById(websiteId){
            for(var w in websites) {
                if(websites[w]._id === websiteId) {
                    return websites[w];
                }
            }
            return null;
        }


        function updateWebsite(websiteId, website){

            for(var w in websites) {
                if(websites[w]._id === websiteId) {
                    websites[w] = website;
                    break;
                }
            }
        }

        function deleteWebsite(websiteId){
            for(var w in websites) {
                if(websites[w]._id === websiteId) {
                    websites.splice(w, 1);
                    break;
                }
            }
        }

        api = {
            createWebsite     : createWebsite,
            findWebsiteByUser : findWebsiteByUser,
            findWebsiteById   : findWebsiteById,
            updateWebsite     : updateWebsite,
            deleteWebsite     : deleteWebsite
        };
        return api;
    }


})();

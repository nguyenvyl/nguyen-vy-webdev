(function() {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);
    function WebsiteService($routeParams, $http) {
        var api;

        var vm = this;
        var userId    = parseInt($routeParams.uid);
        var websiteId = parseInt($routeParams.wid);
        vm.updateWebsite = updateWebsite;
        vm.removeWebsite = removeWebsite;

        function removeWebsite(wid) {
            WebsiteService.removeWebsite(wid);
            $location.url("/user/"+userId+"/website");
        }

        function createWebsite(userId, website) {
            var url = "/api/user/" + userId + "/website";
            return $http.post(url, website);
        }

        function findAllWebsitesForUser(userId){
            var url = "/api/user/" + userId + "/website";
            return $http.get(url);
        }


        function findWebsiteById(websiteId){
            var url = "/api/website/" + websiteId;
            return $http.get(url);
        }


        function updateWebsite(website){
            var url = "/api/website/" + website._id;
            return $http.put(url, website);
        }

        function deleteWebsite(website){
            // console.log("Hello from delete website, client side!");
            // console.log("We got a website with id " + website._id);
            var url = "/api/website/" + website._id;
            return $http.delete(url);
        }

        api = {
            createWebsite           : createWebsite,
            findAllWebsitesForUser  : findAllWebsitesForUser,
            findWebsiteById         : findWebsiteById,
            updateWebsite           : updateWebsite,
            deleteWebsite           : deleteWebsite
        };
        return api;
    }


})();

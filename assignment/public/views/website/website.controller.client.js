(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.userId = parseInt($routeParams["uid"]);
        function init() {
            vm.websites = WebsiteService.findWebsiteByUser(vm.userId);
        }
        init();
    }

    function NewWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = parseInt($routeParams.uid);
        vm.createWebsite = createWebsite;

        function init() {
            vm.websites = WebsiteService.findWebsiteByUser(vm.userId);
        }
        init();

        function createWebsite(name, description){
            console.log("Entering create website");
            if(!name || !description){
                vm.alert = "Please type input for all fields.";
                return;
            }
            else{
                var siteID = getRandomInt(100, 999);
                while(WebsiteService.findWebsiteById(siteID)){
                    siteID = getRandomInt(100, 999);
                }
                var newSite = { _id: siteID, name: name, developerId: vm.userId, description: description};
                WebsiteService.createWebsite(vm.userId, newSite);
                $location.url("/user/" + vm.userId + "/website/");
            }
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }

    function EditWebsiteController($routeParams, $location, $route, WebsiteService) {
        var vm = this;
        vm.websiteId = parseInt($routeParams.wid);
        vm.userId = parseInt($routeParams.uid);
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        function init() {
            vm.websites = WebsiteService.findWebsiteByUser(vm.userId);
            vm.website = WebsiteService.findWebsiteById(vm.websiteId);
        }
        init();

        function updateWebsite(name, description) {
            var update = { _id: vm.websiteId, name: name, developerId: vm.userId, description: description};
            WebsiteService.updateWebsite(vm.websiteId, update);
            $location.url("/user/" + vm.userId + "/website/");
        }

        function deleteWebsite() {
            WebsiteService.deleteWebsite(vm.websiteId);
            $location.url("/user/" + vm.userId + "/website/");
        }
    }

})();


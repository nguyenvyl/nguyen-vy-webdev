(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        function init() {
            var promise = WebsiteService.findAllWebsitesForUser(vm.userId);
            promise
                .success(function(websites){
                    vm.websites = websites;
                });
        }
        init();

    }

    function NewWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.createWebsite = createWebsite;

        function init() {
            var promise = WebsiteService.findAllWebsitesForUser(vm.userId);
            promise
                .success(function(websites){
                    vm.websites = websites;
                });
        }
        init();

        function createWebsite(website){
            console.log("Entering create website - website.controller.client.js");
            console.log("We're creating a website for this user: " + vm.userId);
            console.log(website);
            if(!website.name || !website.description){
                vm.alert = "Please type input for all fields.";
                return;
            }
            else{
                //website._id = (new Date()).getTime();
                //website.developerId = vm.userId;
                WebsiteService
                    .createWebsite(vm.userId, website)
                    .success(function () {
                        $location.url("/user/" + vm.userId + "/website");
                    });
            }
        }
    }

    function EditWebsiteController($routeParams, $location, $route, WebsiteService) {
        var vm = this;
        vm.websiteId = $routeParams.wid;
        vm.userId = $routeParams.uid;
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        function init() {
            var listPromise = WebsiteService.findAllWebsitesForUser(vm.userId);
            listPromise
                .success(function(websites){
                    vm.websites = websites;
                });
            var websitePromise = WebsiteService.findWebsiteById(vm.websiteId);
            websitePromise
                .success(function(website){
                    if(website != '0'){
                        vm.website = website;
                    }
                })
                .error(function(){
                    console.log("Dawg, your website server service done had an error");
                });
        }
        init();


        function updateWebsite() {
            // console.log("This is update website, controller!");
            // console.log("The controller is passing in this website:");
            // console.log(vm.website);
            var promise = WebsiteService.updateWebsite(vm.website);
            promise
                .success(function(){
                    $location.url("/user/"+ vm.userId +"/website");
                });
        }

        function deleteWebsite(website) {

            console.log("Hello from delete website controller - client");
            console.log("We received a website with ID " + website._id);
            WebsiteService
                .deleteWebsite(website)
                .success(function(){
                    $location.url("/user/"+ vm.userId +"/website");
                })
                .error(function(){
                    console.log("We done had some errors dawg");
                });
        }


    }

})();


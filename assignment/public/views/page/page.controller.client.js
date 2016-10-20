(function(){
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService) {
        var vm = this;
        vm.pageId = parseInt($routeParams["pid"]);
        vm.userId = parseInt($routeParams["uid"]);
        vm.websiteId = parseInt($routeParams["wid"]);

        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();
    }

    function NewPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = parseInt($routeParams["uid"]);
        vm.websiteId = parseInt($routeParams["wid"]);
        vm.createPage = createPage;

        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();

        function createPage(name, title){
            if(!name || !title){
                vm.alert = "Please type input for all fields.";
                return;
            }
            else{
                var pageID = getRandomInt(100, 999);
                while(PageService.findPageById(pageID)){
                    pageID = getRandomInt(100, 999);
                }

                var newPage = { _id: pageID, name: name, websiteId: vm.websiteId, title: title};
                PageService.createPage(vm.websiteId, newPage);
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
            }
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

    }

    function EditPageController($routeParams, $location, PageService){
        var vm = this;
        vm.pageId = parseInt($routeParams["pid"]);
        vm.userId = parseInt($routeParams["uid"]);
        vm.websiteId = parseInt($routeParams["wid"]);
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
            vm.page = PageService.findPageById(vm.pageId);
        }
        init();

        function updatePage(name, title) {
            var update = {_id: vm.pageId, name: name, websiteId: vm.websiteId, title: title};
            PageService.updatePage(vm.pageId, update);
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/");
        }

        function deletePage(pageId) {
            PageService.deletePage(vm.websiteId);
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/");
        }
    }
})();



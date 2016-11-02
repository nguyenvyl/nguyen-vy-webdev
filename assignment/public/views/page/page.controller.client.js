(function(){
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService) {

        var vm = this;
        vm.userId = parseInt($routeParams.uid);
        vm.websiteId = parseInt($routeParams.wid);
        function init() {
            var promise = PageService.findAllPagesForWebsite(vm.websiteId);
            promise
                .success(function(pages){
                    vm.pages = pages;
                });
        }
        init();
    }

    function NewPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = parseInt($routeParams.uid);
        vm.websiteId = parseInt($routeParams.wid);
        vm.createPage = createPage;

        function init() {
            var promise = PageService.findAllPagesForWebsite(vm.websiteId);
            promise
                .success(function(pages){
                    vm.pages = pages;
                });
        }
        init();

        function createPage(page){
            console.log("Entering create page");
            console.log(page);
            if(!page.name || !page.title){
                vm.alert = "Please type input for all fields.";
                return;
            }
            else{
                page._id = (new Date()).getTime();
                page.websiteId = vm.userId;
                PageService
                    .createPage(vm.websiteId, page)
                    .success(function () {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                    });
            }
        }

    }

    function EditPageController($routeParams, $location, PageService){
        console.log("Hello from Edit Page Controller!");
        var vm = this;
        vm.pageId = parseInt($routeParams.pid);
        vm.userId = parseInt($routeParams.uid);
        vm.websiteId = parseInt($routeParams.wid);
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        console.log("Page id is " + vm.pageId);

        function init() {
            var listPromise = PageService.findAllPagesForWebsite(vm.websiteId);
            listPromise
                .success(function(pages){
                    vm.pages = pages;
                });
            var pagePromise = PageService.findPageById(vm.pageId);
            pagePromise
                .success(function(page){
                    if(page != '0'){
                        vm.page = page;
                    }
                })
                .error(function(){
                    console.log("Dawg, your page server service done had an error");
                });
        }
        init();


        function updatePage() {
            // console.log("This is update page, controller!");
            // console.log("The controller is passing in this page:");
            // console.log(vm.page);
            var promise = PageService.updatePage(vm.pageId, vm.page);
            promise
                .success(function(){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/");
                });
        }

        function deletePage(pageId) {
            console.log("Hello from delete page controller - client");
            console.log("We received a page with ID " + pageId);
            PageService
                .deletePage(pageId)
                .success(function(){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/");
                })
                .error(function(){
                    console.log("We done had some errors dawg");
                });
        }
    }
})();



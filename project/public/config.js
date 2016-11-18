(function() {
    angular
        .module("WebDevProject")
        .config(Config);

    function Config($routeProvider) {
        $routeProvider
            .when("/project/home", {
                templateUrl: "home.html",
                controller: "ProjectTestController",
                controllerAs: "model"
            })
            .otherwise({
                redirectTo: "/project/home"
            });
    }
})();
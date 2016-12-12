(function() {
    angular
        .module("WebDevProject")
        .config(Config)
        .config(["$sceDelegateProvider",
            // Config to allow embedded Google Maps
            function($sceDelegateProvider) {
                $sceDelegateProvider.resourceUrlWhitelist(["self",
                    "https://www.google.com/maps/embed/v1/place**",
                    "http://forecast.io/embed/**"
                ]);
             }
        ]);
    // Routing configuration
    function Config($routeProvider) {
        $routeProvider
            .when("/project/home", {
                templateUrl: "home.html",
                controller: "SearchController",
                controllerAs: "model"
            })
            .when("/about", {
                templateUrl: "views/home/about.view.client.html"
            })
            .when("/login", {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/user/:uid", {
                templateUrl: "views/user/private_profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when("/user/:uid/favorites", {
                templateUrl: "views/user/favorites.view.client.html",
                controller: "FavoritesController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when("/user/:uid/viewprofile/:uid2", {
                templateUrl: "views/user/public_profile.view.client.html",
                controller: "PublicProfileController",
                controllerAs: "model"
                // resolve: { loggedin: checkLoggedin }
            })
            .when("/register", {
                templateUrl: "views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/search/:uid",{
                templateUrl: "views/search/search.view.client.html",
                controller: "SearchController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when("/user/:uid/trail/:trailId",{
                templateUrl: "views/search/view_trail.view.client.html",
                controller: "ViewTrailController",
                controllerAs: "model"
            })
            .otherwise({
                redirectTo: "/project/home"
            });
    }

    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/loggedin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve();
                //$location.url('/user/:uid');
            } else {
                $rootScope.error = "You need to log in.";
                deferred.reject();
                $location.url('/login');
            }
        });
        return deferred.promise;
    };

})();
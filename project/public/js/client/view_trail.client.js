(function() {
    angular
        .module("WebDevProject")
        .factory("ProjectClient", ProjectClient);
    function ProjectClient($http) {
        console.log("Hello from project client");
        var api;

        function getTrails(searchParams) {
            console.log("getTrails - project test client");
            console.log(searchParams);
            var url = "/website/getTrails";
            return $http.post(url, searchParams);
        }

        api = {
            getTrails : getTrails
        };
        return api;
    }
})();

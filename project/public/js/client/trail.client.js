(function() {
    angular
        .module("WebDevProject")
        .factory("TrailClient", TrailClient);
    function TrailClient($http) {
        console.log("Hello from project trail client");
        var api;

        function getTrails(searchParams) {
            console.log("getTrails - project test client");
            console.log(searchParams);
            var url = "/api/getTrails";
            return $http.post(url, searchParams);
        }

        function addTrailToUser(trail, userId){
            var url = "/addTrail/?userId=" + userId;
            return $http.put(url, trail);
        }

        function getUserList(trail){
            return $http.put("/api/getUserList/", trail);
        }

        function updateTrail(trail){
            var url = '/api/trail/' + trail._id;
            return $http.put(url, trail);
        }

        function deleteTrail(trail){
            var url = '/api/trail/' + trail._id;
            return $http.delete(url);
        }

        function findTrailById(trailId){
            console.log("Find trail by id - client " + trailId);
            var url = '/api/trail/' + trailId;
            return $http.get(url);
        }

        api = {
            getTrails : getTrails,
            addTrailToUser: addTrailToUser,
            getUserList: getUserList,
            updateTrail: updateTrail,
            deleteTrail: deleteTrail,
            findTrailById: findTrailById
        };
        return api;
    }
})();

(function() {
    angular
        .module("WebDevProject")
        .factory("ProjectUserClient", ProjectUserClient);
    function ProjectUserClient($http, $rootScope) {

        var api;

        function createUser(user) {
            return $http.post('/api/user', user);
        }

        function findUserById(id) {
            var url = '/api/user/' + id;
            return $http.get(url);
        }

        function findUserByUsername(username){
            var url = '/api/user?username=' + username;
            return $http.get(url);
        }

        function findUserByCredentials(username, password) {
            var url = '/api/user?username=' + username + '&password=' + password;
            return $http.get(url);
        }

        function updateUser(user){
            var url = '/api/user/' + user._id;
            return $http.put(url, user);
        }

        function deleteUser(userId){
            var url = "/api/user/" + userId;
            return $http.delete(url);

        }

        function login(user){
            return $http.post("/api/login", user);
        }

        function logout() {
            return $http.post("/api/logout");
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        function loggedIn() {
            return $http.get("/api/loggedin");
        }

        function setCurrentUser(user) {
            $rootScope.currentUser = user;

        }

        function getTrailList(user){
            // console.log("Get trail list - client");
            return $http.put("/api/getTrailList", user);
        }

        api = {
            createUser            : createUser,
            findUserById          : findUserById,
            findUserByUsername    : findUserByUsername,
            findUserByCredentials : findUserByCredentials,
            updateUser            : updateUser,
            deleteUser            : deleteUser,
            login                 : login,
            logout                : logout,
            register              : register,
            loggedIn              : loggedIn,
            setCurrentUser        : setCurrentUser,
            getTrailList          : getTrailList
        };
        return api;
    }
})();
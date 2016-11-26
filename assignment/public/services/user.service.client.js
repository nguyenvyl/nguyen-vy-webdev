(function() {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);
    function UserService($http, $rootScope) {

        var api;

        function createUser(username, password) {
            var newUser = {
                username: username,
                password: password
            };
            return $http.post('/api/user', newUser);
        }

        function findUserById(id) {
            console.log("Hello from find user by id-- client");
            var url = '/api/user/' + id;
            return $http.get(url);
        }

        function findUserByUsername(username){
            console.log("Hello from find user by username-- client");
            var url = '/api/user?username=' + username;
            return $http.get(url);
        }

        function findUserByCredentials(username, password) {
            console.log("Hello from find user by credentials-- client");
            var url = '/api/user?username=' + username + '&password=' + password;
            console.log(url);

            return $http.get(url);
        }

        function updateUser(user){
            console.log("Hello from update user -- client");
            var url = '/api/user/' + user._id;
            return $http.put(url, user);
        }

        function deleteUser(userId){
            console.log("Hello from delete user - Client");
            console.log("We were passed user ID " + userId);
            var url = "/api/user/" + userId;
            return $http.delete(url);

        }

        function login(user){
            console.log("Hello from login - user client!");
            console.log(user);
            return $http.post("/api/login", user);
        }

        function logout() {
            console.log("Hello from logout - user client");
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
            setCurrentUser        : setCurrentUser
        };
        return api;
    }
})();
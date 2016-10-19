(function() {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);
    function UserService() {
        var users = [
            {_id: 123, username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder"  , email: "alice@wonder.com"},
            {_id: 234, username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley"  , email: "bob@marley.com"},
            {_id: 345, username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia"  , email: "charly@garcia.com"},
            {_id: 456, username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" , email: "youtube@prof.com"}
        ],
            api;


        function createUser(user) {
            users.push(user);
        }

        function findUserById(id) {
            for(var u in users){
                user = users[u];
                if(user._id === id) {
                    return user;
                }
            }
            return null;
        }

        function findUserByUsername(username){
            for(var u in users){
                user = users[u];
                if(user.username === username) {
                    return user;
                }
            }
            return null;
        }

        function findUserByCredentials(username, password) {
            for(var u in users) {
                user = users[u];
                if(    user.username === username
                    && user.password === password) {
                    return user;
                }
            }
            return null;
        }



        function updateUser(userId, user){
            for(var u in users){
                user = users[u];
                if(user._id === userId) {
                    users[u] = user;
                    break;
                }
            }
        }

        function deleteUser(userId){
            for(var u in users){
                if(users[u]._id === userId){
                    users.splice(i, 1);
                    break;
                }
            }
        }
        api = {
            createUser            : createUser,
            findUserById          : findUserById,
            findUserByUsername    : findUserByUsername,
            findUserByCredentials : findUserByCredentials,
            updateUser            : updateUser,
            deleteUser            : deleteUser
        };
        return api;
    }
})();
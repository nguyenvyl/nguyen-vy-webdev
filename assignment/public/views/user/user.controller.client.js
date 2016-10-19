(function(){
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);



        function LoginController($location, UserService) {
            var vm = this;
            vm.login = login;

            function login(username, password) {
                var user = UserService.findUserByCredentials(username, password);
                if (user) {
                    $location.url("/user/" + user._id);
                } else {
                    vm.alert = "Unable to login";
                }
            }
        }


        function RegisterController($location, UserService) {
            var vm = this;
            vm.register = register;

            function register(username, password1, password2){
                // Check if the passwords match.
                if(password1 !== password2){
                    vm.alert = "Passwords do not match.";
                }
                // Check if this username is already taken.
                else if(UserService.findUserByUsername(username)){
                    vm.alert = "Username is already taken.";
                }
                else{
                    // Generate a random user ID
                    var userID = getRandomInt(100, 999);
                    // Make sure there are no id collisions (prob won't need later once Mongo DB is integrated)
                    while(UserService.findUserById(userID)){
                        userID = getRandomInt(100, 999);
                    }
                    var newUser = {_id: userID, username: username, password: password1, firstName: "", lastName: "", email: ""};
                    UserService.createUser(newUser);
                    $location.url("/user/" + newUser._id);
                }

            }
            /**
             * Returns a random integer between min (inclusive) and max (inclusive)
             * Using Math.round() will give you a non-uniform distribution!
             */
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        }

        function ProfileController($location, $routeParams, $route, UserService) {
            var vm = this;
            var userId = parseInt($routeParams.uid);
            var user = UserService.findUserById(userId);
            if(user != null) {
                vm.user = user;
            }
            vm.updateUser = updateUser;

            function updateUser(email, firstname, lastname){
                var update = {_id: user._id, username: user.username, password: user.password,
                        firstName: firstname, lastName: lastname, email: email};
                UserService.updateUser(user._id, update);
                $route.reload(true);
            }


        }

})();

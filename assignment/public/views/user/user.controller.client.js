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
            console.log("Hello from Login Controller login");
            var promise = UserService.findUserByCredentials(username, password);
            promise
                .success(function(user){
                    if(user == '0'){
                        vm.alert = "No such user";
                    }
                    else{
                        $location.url("/user/" + user._id);
                    }
                })
                .error(function(){
                    console.log("Server error, whoops!");
                })

        }
    }


    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(username, password1, password2){
            console.log("This is register user - client");
            // Check if the passwords match.
            if(password1 !== password2){
                vm.alert = "Passwords do not match.";
            }
            // Check if this username is already taken.
            else if(UserService.findUserByUsername(username)){
                vm.alert = "Username is already taken.";
            }

            UserService
                .createUser(username, password1)
                .then(function(user){
                    $location.url("/user/" + user._id);
                })
                .error(function(){
                    console.log("Server error!");
                })

        }
    }

    function ProfileController($location, $routeParams, $route, UserService) {
        var vm = this;
        var userId = parseInt($routeParams.uid);
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;

        function init(){
            var promise = UserService.findUserById(userId);
            promise
                .success(function(user){
                    if(user != '0'){
                        vm.user = user;
                    }
                })
                .error(function(){
                    console.log("Server error.");
                })
        }
        init();


        function updateUser(){
            UserService.updateUser(vm.user);
        }

        function deleteUser(){
            console.log("Hello from delete user controller - client");
            UserService
                .deleteUser(vm.user._id)
                .success(function(){
                    $location.url("/login");
                })
                .error(function(){
                    console.log("We done had some errors dawg");
                });
        }
    }

})();

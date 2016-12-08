(function(){
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, $rootScope, UserService) {
        var vm = this;
        vm.login = login;


        function login() {

            if(!vm.user.username || !vm.user.password){
                vm.alert = "Please provide both a username and password.";
            }

            UserService
                .login({
                    username: vm.user.username,
                    password: vm.user.password
                })
                .then(function(response){
                    // console.log("Login user controller received this response: ");
                    // console.log(response);
                    if(response.data) {
                        UserService.setCurrentUser(response.data);
                        var user = response.data;
                        $location.url("/user/"+user._id);
                    }
                });
        }


    }


    function RegisterController($location, $rootScope, UserService) {
        var vm = this;
        vm.register = register;

        function register(username, password1, password2){
            if(!username || !password1 || !password2){
                vm.alert = "Please fill in all fields to register.";
                return;
            }
            // Check if the passwords match.
            if(password1 !== password2){
                vm.alert = "Passwords do not match.";
                return;
            }

            UserService
                .createUser(username, password1)
                .success(function(user){
                    console.log(user);
                    if(user === 'User exists'){
                        vm.alert = "Username is already taken, sorry!";
                        return;
                    }
                    else{
                        console.log("We're going to try to log this user in: ");
                        console.log(user);
                        UserService
                            .login(user)
                            .then(function(response){
                                console.log("Register controller tried to log in and here's what we got: ");
                                console.log(response);
                                if(response.data) {
                                    UserService.setCurrentUser(response.data);
                                    var user = response.data;
                                    $location.url("/user/"+user._id);
                                }
                            });
                        $location.url("/user/" + user._id);
                    }
                })
                .error(function(){
                    console.log("Server error!");
                });
        }
    }

    function ProfileController($location, $routeParams, UserService) {

        var vm = this;
        var userId = $routeParams.uid;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

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
            UserService
                .deleteUser(vm.user._id)
                .success(function(){
                    $location.url("/login");
                })
                .error(function(){
                    console.log("We done had some errors dawg");
                });
        }

        function logout() {
            UserService
                .logout()
                .then(
                    function(response) {
                        UserService.setCurrentUser(null);
                        $location.url("/login");
                    });
        }
    }

})();

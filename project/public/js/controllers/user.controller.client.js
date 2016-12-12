(function(){
    angular
        .module("WebDevProject")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, $rootScope, ProjectUserClient) {
        var vm = this;
        vm.login = login;

        function login() {

            if(!vm.user.username || !vm.user.password){
                vm.alert = "Please provide both a username and password.";
            }

            ProjectUserClient
                .login({
                    username: vm.user.username,
                    password: vm.user.password
                })
                .then(function(response){
                    if(response.data) {
                        ProjectUserClient.setCurrentUser(response.data);
                        var user = response.data;
                        $location.url("/user/"+user._id);
                    }
                });
        }


    }


    function RegisterController($location, $rootScope, ProjectUserClient) {
        var vm = this;
        vm.register = register;

        function register(username, email, password1, password2){
            if(!username || !password1 || !password2 || !email){
                vm.alert = "Please fill in all fields to register.";
                return;
            }
            // Check if the passwords match.
            if(password1 !== password2){
                vm.alert = "Passwords do not match.";
                return;
            }

            var newUser = {
                username: username,
                password: password1,
                email: email,
                picture: '../../../images/default.png'
            };

            ProjectUserClient
                .createUser(newUser)
                .success(function(user){
                    console.log(user);
                    if(user === 'User exists'){
                        vm.alert = "Username is already taken, sorry!";
                        return;
                    }
                    else{
                        ProjectUserClient
                            .login(newUser)
                            .then(function(response){
                                console.log("Register controller tried to log in and here's what we got: ");
                                console.log(response);
                                if(response.data) {
                                    ProjectUserClient.setCurrentUser(response.data);
                                    var user = response.data;
                                    $location.url("/user/"+user._id);
                                }
                            });
                    }
                })
                .error(function(){
                    console.log("Server error!");
                });
        }
    }

    function ProfileController($location, $routeParams, $rootScope, ProjectUserClient) {

        console.log("Hello from profile controller");
        var vm = this;
        var userId = $routeParams.uid;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        function init(){
            var promise = ProjectUserClient.findUserById(userId);
            promise
                .success(function(user){
                    if(user != '0'){
                        vm.user = user;
                        getTrailList(user);
                    }
                })
                .error(function(){
                    console.log("Server error.");
                })
        }
        init();

        function getTrailList(user){
            // var trailIds = user.trails;
            ProjectUserClient
                .getTrailList(user)
                .then(function(response){
                    // console.log(response.data.trails[0]);
                    vm.trails = response.data.trails;
                    // console.log(vm.trails);
                })
        }

        function updateUser(){
            ProjectUserClient
                .updateUser(vm.user)
                .then(function(retVal){
                    // console.log(err);
                    console.log(retVal);
                    if(retVal){
                        vm.updateAlert = "Your profile has been updated!"
                    }
                    else{
                        vm.updateAlert = "Due to server issues, your profile was not able to be updated. Sorry!"
                    }
                })
        }

        function deleteUser(){
            ProjectUserClient
                .deleteUser(vm.user._id)
                .success(function(){
                    $location.url("/login");
                })
                .error(function(){
                    console.log("We done had some errors dawg");
                });
        }

        function logout() {
            ProjectUserClient
                .logout()
                .then(
                    function(response) {
                        ProjectUserClient.setCurrentUser(null);
                        $location.url("/login");
                    });
        }
    }

})();

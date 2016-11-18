(function(){
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, $rootScope, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            console.log("Hello from Login Controller login");
            var promise = UserService.findUserByCredentials(username, password);
            promise
                .success(function(user){
                    if(user == null){
                        vm.alert = "User not found. To register, hit the Register button below!";
                    }
                    else{
                        $rootScope.currentUser = user;
                        $location.url("/user/" + user._id);
                    }
                })
                .error(function(){
                    console.log("Server error, whoops!");
                })
        }

        vm.logout = logout;
        function logout() {
            UserService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    });
        }
    }


    function RegisterController($location, $rootScope, UserService) {
        var vm = this;
        vm.register = register;

        function register(username, password1, password2){
            // Check if the passwords match.
            if(password1 !== password2){
                vm.alert = "Passwords do not match.";
            }

            UserService
                .createUser(username, password1)
                .success(function(retVal){
                    console.log(retVal);
                    if(retVal === 'User exists'){
                        vm.alert = "Username is already taken, sorry!";
                    }
                    else{
                        $rootScope.currentUser = retVal;
                        $location.url("/user/" + retVal._id);
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

            // deleteAllWebsitesFromUser();

            UserService
                .deleteUser(vm.user._id)
                .success(function(){
                    $location.url("/login");
                })
                .error(function(){
                    console.log("We done had some errors dawg");
                });
        }
        //
        // function deleteAllWebsitesFromUser(){
        //     var websites = WebsiteService.findAllWebsitesForUser(vm.user._id);
        //     for(w in websites){
        //         WebsiteService
        //             .deleteWebsite(websites[w])
        //             .success(function(){
        //                 console.log("Website with ID " + websites[w]._id + "deleted");
        //             })
        //             .error(function(){
        //                 console.log("Error deleting a website from user");
        //             })
        //     }
        // }
    }

})();

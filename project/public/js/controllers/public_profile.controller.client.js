(function(){
    angular
        .module("WebDevProject")
        .controller("PublicProfileController", PublicProfileController);

    function PublicProfileController($location, $rootScope, $window, $routeParams, ProjectUserClient) {
        var vm = this;
        vm.sendEmail = sendEmail;
        var userId1 = $routeParams.uid;
        var userId2 = $routeParams.uid2;

        function init() {

            ProjectUserClient
                .findUserById(userId1)
                .success(function (user) {
                    if (user != '0') {
                        vm.currentUser = user;
                        ProjectUserClient
                            .getTrailList(user)
                            .then(function (response) {
                                vm.currentUserTrails = response.data.trails;
                            })
                    }
                })
                .error(function () {
                    console.log("Server error.");
                });

            ProjectUserClient
                .findUserById(userId2)
                .success(function (user) {
                    if (user != '0') {
                        vm.viewUser = user;
                        ProjectUserClient
                            .getTrailList(user)
                            .then(function (response) {
                                vm.viewUserTrails = response.data.trails;
                                trailsInCommon();
                            })
                    }
                })
                .error(function () {
                    console.log("Server error.");
                })
        }
        init();

        function trailsInCommon(){
            var count = 0;
            var trails1 = vm.viewUser.trails;
            var trails2 = vm.currentUser.trails;
            for(i = 0; i < trails1.length; i++){
                for(j = 0; j < trails2.length; j++){
                    if(trails1[i] == trails2[j]){
                        count++;
                    }
                }
            }
            vm.trailsInCommon = count;
        }

        function sendEmail(){
            console.log(vm.currentUser);
            var sendTo = vm.viewUser.email;
            var subject = "Let's go hiking!";

            if(!vm.currentUser.firstName){
                var name = vm.currentUser.username;
            }
            else{
                var name = vm.currentUser.firstName;
            }

            var message = "Hey, we share " + vm.trailsInCommon.toString() + " hikes in common! Want to arrange a hiking trip?"
                + "\nCheers, " + name;
            console.log(message);
            $window.open("mailto:"+ sendTo + "?subject=" + subject+"&body="+ encodeURIComponent(message), "_self");
        }

    }
})();

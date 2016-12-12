(function(){
    angular
        .module("WebDevProject")
        .controller("FavoritesController", FavoritesController);

    function FavoritesController($location, $scope, $routeParams, $rootScope, TrailClient, ProjectUserClient, $interval) {
        var vm = this;
        vm.getUserList = getUserList;
        vm.viewInfo = viewInfo;
        vm.removeTrailFromUser = removeTrailFromUser;

        function init(){
            vm.favorited = null;
            var userId = $routeParams.uid;
            getCurrentUser(userId);
        }
        init();

        function getCurrentUser(userId){
            var promise = ProjectUserClient.findUserById(userId);
            promise
                .success(function(user){
                    if(user != '0'){
                        vm.currentUser = user;
                        getTrailList(vm.currentUser);
                    }
                })
                .error(function(){
                    console.log("Server error.");
                })
        }


        function getTrailList(user){
            // var trailIds = user.trails;
            ProjectUserClient
                .getTrailList(user)
                .then(function(response){
                    vm.trails = response.data.trails;
                    if(vm.trails.length == 0){
                        vm.alert = "You haven't favorited any trails yet!";
                    }
                })
        }

        function updateUser(){
            ProjectUserClient.updateUser(vm.user);
        }

        // Removes a trail from a user's list of trails.
        function removeTrailFromUser(trail){

            // Find the trail to remove.
            var uniqueId = trail.unique_id;
            var currentUser = vm.currentUser;
            for(i = 0; i < currentUser.trails.length; i++){
                if(currentUser.trails[i].unique_id == uniqueId){
                    var removeIndex = i;
                }
            }

            // Splice out the trail that needs to be removed from the user.
            var removedTrail = currentUser.trails.splice(removeIndex, 1)[0];

            // Update the user in our database.
            ProjectUserClient
                .updateUser(currentUser)
                .then(function(err, retVal){
                });

            // Find the user that needs to be removed from the trail.
            var userId = currentUser._id;
            for(i = 0; i < removedTrail.users.length; i++){
                if(removedTrail.users[i] == userId){
                    var removeIndex = i;
                }
            }
            removedTrail.users.splice(removeIndex, 1);

            // If our updated trail has no more users, delete it from our Mongo database.
            if(removedTrail.users.length == 0){
                SearchClient
                    .deleteTrail(removedTrail)
                    .then(function(err, retVal){
                        viewInfo(removedTrail);
                    })
            }
            // Simply update the trail if it still has users in it.
            else{
                SearchClient
                    .updateTrail(removedTrail)
                    .then(function (err, retVal) {
                        viewInfo(removedTrail);
                    })
            }

        }


        // Given a trail, populates the trail's list of userIDs with the user objects.
        function getUserList(trail){
            SearchClient
                .getUserList(trail)
                .then(function(response){
                    if(!response.data.users){
                        vm.alert = "No users have favorited this trail yet!";
                    }
                    else{
                        vm.alert = null;
                        vm.trail.userList = response.data.users;
                    }
                })
        }

        //
        function viewInfo(trail){
            getUserList(trail);
            // Repopulating current user's trail list in case an update has happened
            ProjectUserClient
                .getTrailList(vm.currentUser)
                .then(function(response){
                    vm.currentUser = response.data;
                    vm.favorited = isInFavorites(trail);
                });
            vm.trail = trail;
        }
    }

})();

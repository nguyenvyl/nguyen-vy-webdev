(function(){
    angular
        .module("WebDevProject")
        .controller("ViewTrailController", ViewTrailController);

    function ViewTrailController($location, $scope, $routeParams, $window, $rootScope, TrailClient, ProjectUserClient, $interval) {
        var vm = this;
        vm.getUserList = getUserList;
        vm.removeTrailFromUser = removeTrailFromUser;
        var trailId = $routeParams.trailId;
        var userId = $routeParams.uid;

        function init(){
            getUserById(userId);
            findTrailById(trailId);
            vm.selectedTab = 1;
        }
        init();


        vm.selectTab = function(tab) {
            vm.selectedTab = tab;
        };

        vm.isActive = function(tab){
            return tab == vm.selectedTab;
        };

        vm.isSelectedTab = function(tab){
            console.log("Is selected tab");
            console.log(tab);
            return tab == vm.selectedTab;
        };

        function checkTrailNull(trail){
            if(!trail.description){
                vm.descriptionAlert = "No description available for this trail. Sorry about that!"
            }
            if(!trail.directions){
                vm.directionsAlert = "No directions available for this trail. Sorry about that!"
            }
            if(trail.activities.length == 0){
                vm.activitiesAlert = "No activity information available for this trail, sorry!"
            }
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

        function makeGoogleEmbedUrl(trail){
            var lat = trail.lat;
            var lon = trail.lon;
            var url = "https://www.google.com/maps/embed/v1/place?q=" + lat + "," + lon + "&zoom=10&key=AIzaSyBXaGcOswjtGmOSLvrTW84n_3PfVboXy4I";
            vm.googleUrl = url;
        }

        function makeWeatherEmbedUrl(trail){
            var lat = trail.lat;
            var lon = trail.lon;
            var name = trail.name + ", " + trail.state;
            var url = "http://forecast.io/embed/#lat=" + lat + "&lon=" + lon + "&name=" + name;
            if(trail.country == 'United States'){
                url = url + "&units=us";
            }

            console.log(url);
            vm.weatherUrl = url;
        }

        function getUserById(userId){
            ProjectUserClient
                .findUserById(userId)
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

        function findTrailById(trailId){
            console.log("Get trail by id, controller");
            console.log(trailId);
            TrailClient
                .findTrailById(trailId)
                .then(function (response){
                    console.log(response);
                    vm.trail = response.data;
                    makeGoogleEmbedUrl(vm.trail);
                    makeWeatherEmbedUrl(vm.trail);
                    getUserList(vm.trail);
                    checkTrailNull(vm.trail);
                })

        }

        function viewInfo(trail){
            getUserList(trail);
            // Repopulating current user's trail list in case an update has happened
            ProjectUserClient
                .getTrailList(vm.currentUser)
                .then(function(response){
                    vm.currentUser = response.data;
                });
            vm.trail = trail;
        }

        // Removes a trail from a user's list of trails.
        function removeTrailFromUser(trail){

            // Find the trail to remove.
            var uniqueId = trail.unique_id;
            var currentUser = vm.currentUser;
            for(i = 0; i < currentUser.trails.length; i++){
                if(currentUser.trails[i]._id == uniqueId){
                    var removeIndex = i;
                }
            }

            // Splice out the trail that needs to be removed from the user.
            currentUser.trails.splice(removeIndex, 1)[0];
            // Update the user in our database.
            ProjectUserClient
                .updateUser(currentUser)
                .then(function(err, retVal){
                    console.log(retVal);
                    vm.currentUser = retVal;
                });

            // Find the user that needs to be removed from the trail.
            var userId = currentUser._id;
            for(i = 0; i < vm.trail.users.length; i++){
                if(vm.trail.users[i] == userId){
                    var removeIndex = i;
                }
            }
            vm.trail.users.splice(removeIndex, 1);

            // If our updated trail has no more users, delete it from our Mongo database.
            if(vm.trail.users.length == 0){
                TrailClient
                    .deleteTrail(vm.trail)
                    .then(function(err, retVal){
                        // viewInfo(removedTrail);
                    })
            }
            // Simply update the trail if it still has users in it.
            else{
                TrailClient
                    .updateTrail(vm.trail)
                    .then(function (err, retVal) {
                        viewInfo(vm.trail);
                    })
            }
            $location.url("/user/" + vm.currentUser._id + "/favorites");
        }


        // Given a trail, populates the trail's list of userIDs with the user objects.
        function getUserList(trail){
            TrailClient
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

    }

})();

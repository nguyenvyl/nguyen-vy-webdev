(function(){
    angular
        .module("WebDevProject")
        .controller("SearchController", SearchController);

    function SearchController($location, $scope, $routeParams, $rootScope, TrailClient, ProjectUserClient, $interval) {
        var vm = this;
        vm.getTrails = getTrails;
        vm.addTrailToUser = addTrailToUser;
        vm.getUserList = getUserList;
        vm.viewInfo = viewInfo;
        vm.isInFavorites = isInFavorites;
        vm.removeTrailFromUser = removeTrailFromUser;

        // vm.maps = maps;
        // $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
        // $interval( $scope.GenerateMapMarkers, 2000);

        function init(){
            setCountries();
            vm.favorited = null;
            vm.loading = false;
            console.log($routeParams.uid);
            var userId = $routeParams.uid;
            getCurrentUser(userId);
        }

        init();

        function getCurrentUser(userId){
            console.log("Get current user");
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
            ProjectUserClient
                .getTrailList(user)
                .then(function(response){
                    vm.currentUser = response.data;
                    // console.log(vm.currentUser);
                });
        }

        // Sets country and state search options for the page.
        function setCountries(){
            vm.countries = [
                {
                    "name": "Canada",
                    "states": [
                        {"state": "Ontario"},
                        {"state": "Quebec"},
                        {"state": "Nova Scotia"},
                        {"state": "New Brunswick"},
                        {"state": "Manitoba"},
                        {"state": "British Columbia"},
                        {"state": "Prince Edward Island"},
                        {"state": "Saskatchewan"},
                        {"state": "Alberta"},
                        {"state": "Newfoundland & Labrador"}
                    ]
                },
                {
                    "name": "United States",
                    "states": [
                        {"state": "Alabama"},
                        {"state": "Alaska"},
                        {"state": "Arizona"},
                        {"state": "Arkansas"},
                        {"state": "California"},
                        {"state": "Colorado"},
                        {"state": "Connecticut"},
                        {"state": "Delaware"},
                        {"state": "Florida"},
                        {"state": "Georgia"},
                        {"state": "Hawaii"},
                        {"state": "Idaho"},
                        {"state": "Illinois"},
                        {"state": "Indiana"},
                        {"state": "Iowa"},
                        {"state": "Kansas"},
                        {"state": "Kentucky"},
                        {"state": "Louisiana"},
                        {"state": "Maine"},
                        {"state": "Maryland"},
                        {"state": "Massachusetts"},
                        {"state": "Michigan"},
                        {"state": "Minnesota"},
                        {"state": "Mississippi"},
                        {"state": "Missouri"},
                        {"state": "Montana"},
                        {"state": "Nebraska"},
                        {"state": "Nevada"},
                        {"state": "New Hampshire"},
                        {"state": "New Jersey"},
                        {"state": "New Mexico"},
                        {"state": "New York"},
                        {"state": "North Carolina"},
                        {"state": "North Dakota"},
                        {"state": "Ohio"},
                        {"state": "Oklahoma"},
                        {"state": "Oregon"},
                        {"state": "Pennsylvania"},
                        {"state": "Rhode Island"},
                        {"state": "South Carolina"},
                        {"state": "South Dakota"},
                        {"state": "Tennessee"},
                        {"state": "Texas"},
                        {"state": "Utah"},
                        {"state": "Vermont"},
                        {"state": "Virginia"},
                        {"state": "Washington"},
                        {"state": "West Virginia"},
                        {"state": "Wisconsin"},
                        {"state": "Wyoming"}
                    ]
                }
            ]
        }

        // Runs the user's trail search query against the Trails API database.
        function getTrails(){
            vm.loading = true;
            TrailClient
                .getTrails(vm.search)
                .then(function(response){
                    vm.searchResults = response.data.places;
                    vm.loading = false;
                })
        }

        // function createMarkers(length){
        //     console.log("create markers");
        //     var markers = [];
        //     for (var i=0; i < length; i++) {
        //         markers[i] = new google.maps.Marker({
        //             title: "Hi marker " + i
        //         })
        //     }
        //     console.log(markers);
        //     $scope.markers = markers;
        // }

        // $scope.GenerateMapMarkers = function() {
        //     $scope.date = Date(); // Just to show that we are updating
        //     console.log($scope.markers);
        //     var numMarkers = Math.floor(Math.random() * 4) + 4;  // betwween 4 & 8 of them
        //     for (i = 0; i < numMarkers; i++) {
        //         var lat =   1.280095 + (Math.random()/100);
        //         var lng = 103.850949 + (Math.random()/100);
        //         // You need to set markers according to google api instruction
        //         // you don't need to learn ngMap, but you need to learn google map api v3
        //         // https://developers.google.com/maps/documentation/javascript/markers
        //         var latlng = new google.maps.LatLng(lat, lng);
        //         $scope.markers[i].setPosition(latlng);
        //         $scope.markers[i].setMap($scope.map);
        //     }
        // };


        // function GenerateMapMarkers (markers, length) {
        //     console.log("generate map markers");
        //     // $scope.date = Date(); // Just to show that we are updating
        //
        //     var numMarkers = Math.floor(Math.random() * 4) + 4;  // betwween 4 & 8 of them
        //     for (i = 0; i < length; i++) {
        //         var lat =   1.280095 + (Math.random()/100);
        //         var lng = 103.850949 + (Math.random()/100);
        //         // You need to set markers according to google api instruction
        //         // you don't need to learn ngMap, but you need to learn google map api v3
        //         // https://developers.google.com/maps/documentation/javascript/markers
        //         var latlng = new google.maps.LatLng(lat, lng);
        //         markers[i].setPosition(latlng);
        //         markers[i].setMap($scope.map);
        //     }
        //     return markers;
        // }

        // Adds a trail to a user's list of trails.
        function addTrailToUser(trail){
            var userId = $routeParams.uid;
            TrailClient
                .addTrailToUser(trail, userId)
                .then(function (response){
                    responseTrail = response.config.data;
                    // Refreshes the view to reflect the change
                    viewInfo(responseTrail);
                });
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
                TrailClient
                    .deleteTrail(removedTrail)
                    .then(function(err, retVal){
                        viewInfo(removedTrail);
                    })
            }
            // Simply update the trail if it still has users in it.
            else{
                TrailClient
                    .updateTrail(removedTrail)
                    .then(function (err, retVal) {
                        viewInfo(removedTrail);
                    })
            }

        }

        // Checks if a trail is in the current user's list of favorites.
        function isInFavorites(trail){
            var contains = false;
            var uniqueId = trail.unique_id;
            for(t in vm.currentUser.trails){
                if(vm.currentUser.trails[t].unique_id == uniqueId){
                    contains = true;
                    break;
                }
            }
            return contains;
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

(function(){
    angular
        .module("WebDevProject")
        .controller("ViewTrailController", ViewTrailController);

    function ViewTrailController($location, ProjectClient, $scope) {
        console.log("Hello from project test controller!");
        var vm = this;
        vm.getTrails = getTrails;
        // vm.maps = maps;
        // $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
        function init(){
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
                        {"state": "Delaward"},
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
        init();

        function getTrails(){
            console.log("Hello from getTrails, controller");
            // console.log(vm.search);
            ProjectClient
                .getTrails(vm.search)
                .then(function(response){
                    console.log("Hey there");
                    console.log(response);
                    vm.searchResults = response.data.places;
                })
        }

        function getTrailById(){
            console.log("Hello from getTrailById, controller");

        }

        function addTrailToUser(){

        }

        // function maps($scope, uiGmapGoogleMapApi){
        //     uiGmapGoogleMapApi.then(function(maps) {
        //         console.log("Uhhh....");
        //     });
        // }
    }

})();

(function(){
    angular
        .module("WebDevProject")
        .controller("ProjectTestController", ProjectTestController);

    function ProjectTestController($location) {
        console.log("Hello from project test controller!");
        // var vm = this;

        // function init() {
        //     unirest.get("https://trailapi-trailapi.p.mashape.com/?lat=34.1&limit=25&lon=-105.2&q[activities_activity_name_cont]=Yellow+River+Trail&q[activities_activity_type_name_eq]=hiking&q[city_cont]=Denver&q[country_cont]=Australia&q[state_cont]=California&radius=25")
        //         .header("X-Mashape-Key", "aEhGRykKi5msh6OWsyjPrfga3xNCp1hX5zyjsnkBsAIdchAnfW")
        //         .header("Accept", "text/plain")
        //         .end(function (result) {
        //             console.log(result.status, result.headers, result.body);
        //         });
        // }
        // init();
    }

})();

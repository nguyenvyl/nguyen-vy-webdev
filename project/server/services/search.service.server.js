var _ = require('lodash');
var unirest = require('unirest');

module.exports = function(app, UserModel) {
    console.log("Hello from projectTest.service.server.js");

    function getTrails(req, res) {
        console.log("Hello from getTrails - server");
        console.log(req.body);

        var url = constructTrailRequest(req.body);
        console.log(url);

        unirest.get(url)
            .header("X-Mashape-Key", "1qo8s7goIcmshmLvARBEqmmVWkmpp12rej1jsn4ut2EvqOy17u")
            .header("Accept", "text/plain")
            .end(function (result) {
                // console.log(result.status, result.headers, result.body);
                // console.log(result.body);
                res.send(result.body);
            });
    }

    //"https://trailapi-trailapi.p.mashape.com/?q[city_cont]=Boston&radius=100"

    function constructTrailRequest(searchParams){
        var url = "https://trailapi-trailapi.p.mashape.com/?";

        if(searchParams.city && searchParams.city != ''){
            url = url + "&q[city_cont]=" + searchParams.city;
        }
        if(searchParams.state && searchParams.state != ''){
            url = url + "&q[state_cont]=" + searchParams.state;
        }
        if(searchParams.country && searchParams.country != ''){
            url = url + "&q[country_cont]=" + searchParams.country;
        }
        if(searchParams.activity && searchParams.activity != ''){
            url = url + "&q[activities_activity_type_name_eq]=" + searchParams.activity;
        }
        if(searchParams.trailName && searchParams.trailName != ''){
            url = url + "&q[activities_activity_name_cont]=" + searchParams.trailName;
        }
        if(searchParams.radius && searchParams.radius != ''){
            url = url + "&radius=" + searchParams.radius;
        }
        return url;

    }

    function addTrailToUser(req, res){
        console.log(req.query);
        var userId = req.query.userId;
        var trailId = req.query.trailId;

        UserModel
            .findUserById(userId)
            .then(
                function(user){
                    if(!user.trails.contains(trailId)){
                        user.trails.push(trailId);
                        UserModel
                            .updateUser(userId, user)
                            .then(function(retVal){
                                if(retVal != null){
                                    res.send(retVal);
                                }
                            })
                    }
                },
                function(err){
                    res.send(err);
                }
            );
    }

    app.post("/website/getTrails", getTrails);
    app.put("/addTrail/", addTrailToUser);
};

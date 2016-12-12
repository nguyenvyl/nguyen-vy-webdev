var _ = require('lodash');
var unirest = require('unirest');

module.exports = function(app, TrailModel, UserModel) {

    function getTrails(req, res) {
        var url = constructTrailRequest(req.body);
        unirest.get(url)
            .header("X-Mashape-Key", "1qo8s7goIcmshmLvARBEqmmVWkmpp12rej1jsn4ut2EvqOy17u")
            .header("Accept", "text/plain")
            .end(function (result) {
                res.send(result.body);
            });
    }

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
        var userId = req.query.userId;
        var trail = req.body;

        // Check if the trail exists in our database. If it doesn't, create it.
        TrailModel
            .findTrailByUniqueId(trail.unique_id)
            .then(function(db_trail){
                if(!db_trail){
                    TrailModel
                        .createTrail(trail)
                        .then(function(newTrail){
                            trail = newTrail;
                            addUserToTrail(trail._id, userId);
                            addTrailToUser2(userId, trail._id);
                            res.sendStatus(200);
                        })
                }
                else{
                    trail = db_trail;
                    addUserToTrail(trail._id, userId);
                    addTrailToUser2(userId, trail._id);
                    res.sendStatus(200);
                }
            });
    }

    // Add the trail's mongoose ID to the user.
    function addTrailToUser2(userId, trailId){
        UserModel
            .findUserById(userId)
            .then(
                function(user){
                    // This validation prevents duplicate trails from being added.
                    var contains = false;
                    for(var i = 0; i < user.trails.length; i++){
                        var userTrail = JSON.stringify(user.trails[i]);
                        var searchTrail = JSON.stringify(trailId);
                        if(searchTrail === userTrail){
                            contains = true;
                            break;
                        }
                    }
                    // Only add the trail if the user's list of trails doesn't have it.
                    if(!contains){
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

    // Add a user mongoose ID to the trail's list of users.
    function addUserToTrail(trailId, userId){
        TrailModel
            .findTrailById(trailId)
            .then(function(trail){

                // This validation prevents duplicate users from being added to the trail.
                var contains = false;
                for(u in trail.users){
                    var trailUser = JSON.stringify(trail.users[u]);
                    var searchUser = JSON.stringify(userId);
                    if(trailUser === searchUser){
                        contains = true;
                    }
                }
                // Only add the user if the trail doesn't have the user yet.
                if(!contains){
                    trail.users.push(userId);
                    TrailModel
                        .updateTrail(trailId, trail)
                        .then(function(err, retVal){
                        })
                }
            });
    }

    function getUserList(req, res){
        var trail = req.body;
        TrailModel
            .getUserList(trail)
            .then(
                function(retVal){
                    res.send(retVal);
                }
            );
    }

    function updateTrail(req, res){
        var update = req.body;
        var trailId = req.params.trailId;
        TrailModel
            .updateTrail(trailId, update)
            .then(function (retVal) {
                    if (retVal != null) {
                        res.send(retVal);
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function deleteTrail(req, res){
        var trailId = req.params.trailId;
        TrailModel
            .deleteTrail(trailId)
            .then(function(retVal){
                    if (retVal != null) {
                        res.send(retVal);
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function findTrailById(req, res){
        var trailId = req.params.trailId;
        TrailModel
            .findTrailById(trailId)
            .then(
                function(response){
                    res.json(response);
                },
                function(err){
                    res.send(err);
                }
            );
    }

    app.get("/api/trail/:trailId", findTrailById);
    app.delete("/api/trail/:trailId", deleteTrail);
    app.put("/api/trail/:trailId", updateTrail);
    app.post("/api/getTrails", getTrails);
    app.put("/addTrail/", addTrailToUser);
    app.put("/api/getUserList/", getUserList);

};

module.exports=function(mongoose){

    var trailSchema = mongoose.Schema({
        name: String,
        city: String,
        state: String,
        country: String,
        lat: Number,
        lon: Number,
        description: String,
        directions: String,
        unique_id : Number,
        activities: Object,

        dateCreated: {type: Date, default: Date.now},

        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProjectUser'
        }]

    });

    return trailSchema;
};
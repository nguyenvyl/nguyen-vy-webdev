module.exports=function(mongoose){

    var userSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,

        dateCreated: {type: Date, default: Date.now},
        picture: String,
        friends: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProjectUser'
        }],
        trails: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trail'
        }],
        facebook: {
            id:    String,
            token: String
        },
        description: String,
        visibleToPublic: Boolean
    });

    return userSchema;
};
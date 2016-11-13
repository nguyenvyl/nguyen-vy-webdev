module.exports=function(mongoose){

    var widgetSchema = mongoose.Schema({
        _page: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Page'
        },
        widgetType: {
            type: String,
            enum: ['HEADER', 'IMAGE', 'YOUTUBE', 'HTML', 'INPUT', 'TEXT']
        },
        name: String,
        text: String,
        placeholder: String,
        description: String,
        url: {type: String, default: ''},
        width: {type: String, default: '100%'},
        height: String,
        rows: Number,
        size: Number,
        class: String,
        icon: String,
        deletable: Boolean,
        formatted: Boolean,
        dateCreated: {
            type: Date,
            default: Date.now
        },
        index: Number
    });
    return widgetSchema;
};
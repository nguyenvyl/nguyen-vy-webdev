var _ = require('lodash');

module.exports = function(app, WidgetModel) {
    console.log("Hi! This is your friendly neighborhood widget service!");
    var widgets = [
            { _id: 123, widgetType: "HEADER", pageId: 321, size: 2, text: "GIZMODO"},
            { _id: 234, widgetType: "HEADER", pageId: 321, size: 4, text: "Lorem ipsum"},
            { _id: 345, widgetType: "IMAGE", pageId: 321, width: "100%",
                url: "http://lorempixel.com/400/200/"},
            { _id: 456, widgetType: "HTML", pageId: 321, text: "<p>Lorem ipsum</p>"},
            { _id: 567, widgetType: "HEADER", pageId: 321, size: 4, text: "Lorem ipsum"},
            { _id: 678, widgetType: "YOUTUBE", pageId: 321, width: "100%",
                url: "https://youtu.be/AM2Ivdi9c4E" },
            { _id: 789, widgetType: "HTML", pageId: 321, text: "<p>Lorem ipsum</p>"},
            { _id: 777, widgetType: "HTML", pageId: 343, text: "<p>Vy's test html paragraph</p>"},
            { _id: 778, widgetType: "HEADER", pageId: 343, size: 4, text: "Vy's test header"},
            { _id: 779, widgetType: "YOUTUBE", pageId: 343, width:"100%", url:"https://youtu.be/Wsx9f8tdifw"},
            { _id: 222, widgetType: "IMAGE", pageId: 343, width: "100%",
                url: "https://ithinkincomics.files.wordpress.com/2016/03/post-202-image-1.jpg?w=502&h=648"},
        ];


    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../public/uploads' });
    function uploadImage(req, res) {
        console.log("This is upload image from widget.service.server");
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;
        var userId        = req.body.userId;
        var websiteId     = req.body.websiteId;
        var pageId        = req.body.pageId;


        console.log("Here's our file: ");
        console.log(myFile);

        if(!myFile){
            res.redirect("/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/"+widgetId);
            return;
        }

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        var extension = originalname.split('.').pop();
        var relPath = "../uploads/" + filename;

        for(var w in widgets){
            if(widgets[w]._id == widgetId){
                widgets[w].url = relPath;
                widgets[w].width = width;
                widgets[w].name = originalname;
                console.log("Here's our updated widget: ");
                console.log(widgets[w]);
                res.redirect("/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/"+widgetId);
                return;
            }
        }
        res.redirect("/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/"+widgetId);
    }

    function createWidget(req, res) {
        var widget = req.body;
        console.log(widget);
        widgets.push(widget);
        res.send(widget);
    }

    function findAllWidgetsForPage(req, res) {
        var pid = parseInt(req.params.pageId);
        var result = [];
        for(var w in widgets) {
            //console.log(widgets[w].pageId);
            if(widgets[w].pageId === pid) {
                result.push(widgets[w]);
            }
        }
        res.json(result);
    }

    function findWidgetById(req, res){
        var widgetId = parseInt(req.params.widgetId);

        var widget = _.find(widgets, function(widget){
            return widget._id === widgetId;
        });
        res.send(widget || '0');
    }

    function updateWidget(req, res){
        var update = req.body;
        var widgetId = parseInt(req.params.widgetId);
        for(var w in widgets) {
            if(widgets[w]._id === widgetId) {
                widgets[w] = update;
            }
        }
        res.sendStatus(200);
    }

    function deleteWidget(req, res){
        console.log("Hello from deleteWidget - server");
        var widgetId = parseInt(req.params.widgetId);
        for(var w in widgets) {
            if(widgets[w]._id === widgetId) {
                widgets.splice(w, 1);
            }
        }
        res.sendStatus(200);
    }

    function sortItem(req, res){
        console.log("This is sort item, client!");
        var sortedWidgets = req.body;
        widgets = sortedWidgets;
        res.send(widgets);
    }
    app.put("/api/sort", sortItem);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.post("/api/page/:pageId/widget", createWidget);
    app.put("/api/widget/:widgetId", updateWidget);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.post("/api/upload", upload.single('myFile'), uploadImage);
};
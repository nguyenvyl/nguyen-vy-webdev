var _ = require('lodash');

module.exports = function(app, WidgetModel) {
    console.log("Hi! This is your friendly neighborhood widget service!");

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../public/uploads' });

    function uploadImage(req, res) {
        var widget        = req.body;
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;
        var userId        = req.body.userId;
        var websiteId     = req.body.websiteId;
        var pageId        = req.body.pageId;
        
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

        widget.url = relPath;
        widget.name = originalname;
        widget.width = width;

        WidgetModel
            .updateWidget(widgetId, widget)
            .then(function(retVal){
                    res.redirect("/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/"+widgetId);
                }),
        res.redirect("/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/"+widgetId);
    }

    function createWidget(req, res) {
        var pageId = req.params.pageId;
        var widget = req.body;

        WidgetModel
            .createWidget(pageId, widget)
            .then(function(retVal){
                    res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });        
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
        WidgetModel
            .findAllWidgetsForPage(pageId)
            .then(function(retVal) {
                retVal = sortWidgetList(retVal);
                res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
        
    }

    function sortWidgetList(widgetList){
        return widgetList.sort(function compareFn(a, b){
            return a.index - b.index;
        })
    }

    function findWidgetById(req, res){
        var widgetId = req.params.widgetId;

        WidgetModel
            .findWidgetById(widgetId)
            .then(function(retVal) {
                    res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function updateWidget(req, res){
        //console.log("This is updateWidget - service.server");
        var update = req.body;
        var widgetId= req.params.widgetId;
        //console.log(update);

        WidgetModel
            .updateWidget(widgetId, update)
            .then(function(retVal){
                    res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function deleteWidget(req, res){
        var widgetId = req.params.widgetId;
        WidgetModel
            .deleteWidget(widgetId)
            .then(function(retVal){
                    res.send(retVal);
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.post("/api/page/:pageId/widget", createWidget);
    app.put("/api/widget/:widgetId", updateWidget);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.post("/api/upload", upload.single('myFile'), uploadImage);
};
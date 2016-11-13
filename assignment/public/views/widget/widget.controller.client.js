(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($routeParams, $sce, WidgetService) {
        var vm = this;
        vm.pageId = $routeParams.pid;
        vm.websiteId = $routeParams.wid;
        vm.userId = $routeParams.uid;
        vm.trustHTML = trustHTML;
        vm.trustURL = trustURL;
        vm.embedYoutube = embedYoutube;

        function init() {
            var listPromise = WidgetService.findAllWidgetsForPage(vm.pageId);
            listPromise
                .success(function(widgets){
                    vm.widgets = widgets;
                });
        }

        function sortItem(start, end) {
            console.log("start: " + start);
            console.log("end: " + end);

            var moved = vm.widgets.splice(start, 1)[0];
            vm.widgets.splice(end, 0, moved);

            var promise = WidgetService.sortItem(vm.widgets);
            promise
                .success(function(){
                    console.log("Widget order has been updated!");
                });
        }
        vm.sortItem = sortItem;
        init();


        function trustHTML(htmlCode){
            return $sce.trustAsHtml(htmlCode);
        }

        function trustURL(url){
            return $sce.trustAsResourceUrl(url);
        }

        function embedYoutube(youtube){
            var vidID = getYoutubeID(youtube);
            var embedURL = "https://www.youtube.com/embed/" + vidID;
            return embedURL;
        }

        // Function used to parse the video ID from a YouTube URL.
        // The regex is designed to handle a variety of YouTube URL formats.
        function getYoutubeID(youtube){
            var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = youtube.match(regExp);
            if (match && match[2].length == 11) {
                return match[2];
            } else {
                return "Youtube link not valid";
            }
        }


    }

    function NewWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.createWidget = createWidget;

        function init() {
            var listPromise = WidgetService.findAllWidgetsForPage(vm.websiteId);
            listPromise
                .success(function(widgets){
                    vm.widgets = widgets;
                });
        }
        init();

        function createWidget(widgetType) {
            var newWidget;

            switch(widgetType) {
                case "HEADER":
                    newWidget = { widgetType: "HEADER", size: 1, text: ""};
                    break;
                case "HTML":
                    newWidget = {widgetType: "HTML", text: ""};
                    break;
                case "YOUTUBE":
                    newWidget = {widgetType: "YOUTUBE", width:"100%", url:""};
                    break;
                case "IMAGE":
                    newWidget = {widgetType: "IMAGE", width: "100%", url: ""};
                    break;
                case "TEXT":
                    newWidget = {widgetType: "TEXT", rows: 1, placeholder: "", formatted: true }
                    break;
            }

            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function (retVal) {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + retVal._id);
                });
        }
    }

    function EditWidgetController($routeParams, $location, $http, WidgetService){
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.widgetId = $routeParams.wgid;
        vm.editHEADER = editHEADER;
        vm.editHTML = editHTML;
        vm.editIMAGE = editIMAGE;
        vm.editYOUTUBE = editYOUTUBE;
        vm.deleteWidget = deleteWidget;
        vm.uploadImage = uploadImage;

        function init() {
            var widgetPromise = WidgetService.findWidgetById(vm.widgetId);
            widgetPromise
                .success(function(widget){
                    vm.widget = widget;
                })
        }
        init();

        
        function editHTML(text){
            var update = {widgetType: vm.widget.widgetType, pageId: vm.pageId, text: text };
            WidgetService
                .updateWidget(vm.widgetId, update)
                .success(function(widget){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
                })
        }

        // This allows changes to a YouTube widget. It also checks for valid input for the width value.
        function editYOUTUBE(url, width) {
            var checkWidth = formatWidth(width);
            if(checkWidth){
                var update = {name: vm.widget.name, widgetType: vm.widget.widgetType, pageId: vm.pageId, width: checkWidth, url: url};
                WidgetService
                    .updateWidget(vm.widgetId, update)
                    .success(function(widget){
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
                    })
            }
        }

        function editHEADER(text, size){
            if(size < 1 || size > 6){
                vm.alert = "Header size can only be between 1 and 6."
            }
            else {
                var update = {name: vm.widget.name, widgetType: vm.widget.widgetType, pageId: vm.pageId, size: size, text: text};
                WidgetService
                    .updateWidget(vm.widgetId, update)
                    .success(function(widget){
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
                    })
            }
        }

        function editIMAGE(url, width, file){
            console.log("editImage");
            console.log(file);

            var checkWidth = formatWidth(width);
            if(checkWidth){
                var update = {name: vm.widget.name,  widgetType: vm.widget.widgetType, pageId: vm.pageId, width: checkWidth, url: url, name: vm.widget.name, };
                WidgetService
                    .updateWidget(vm.widgetId, update)
                    .success(function(widget){
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
                    })
            }
        }

        function uploadImage(file){
            console.log(file);
            var uploadUrl = "api/upload";
            var fd = new FormData();
            fd.append('file', file);

            $http.post(uploadUrl,fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
                .success(function(){
                    console.log("success!!");
                })
                .error(function(){
                    console.log("error!!");
                });

        }

        function deleteWidget(widgetId){
            WidgetService
                .deleteWidget(widgetId)
                .success(function(widget){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
                })
        }

        // Checks if a string is a number between 1 and 100.
        function is1to100(string){
            var regExNumber = /^[1-9][0-9]?$|^100$/;
            return string.match(regExNumber);
        }

        // Checks if a string is a valid percentage string (i.e., '100%' or '3%')
        function isPercentage(string){
            var regExPercent = /[0-9]{1,3}%/;
            return string.match(regExPercent);
        }

        // Takes in user input for width, and returns it as
        // a valid percentage string that can be used in HTML.
        function formatWidth(width){
            if(is1to100(width)){
                return width + "%";
            }
            else if(isPercentage(width)){
                return width;
            }
            else{
                vm.alert = "Please input a valid percentage for width."
            }
        }

    }

})();


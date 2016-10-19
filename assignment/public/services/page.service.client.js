(function() {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);
    function PageService() {
        var pages = [
            {_id: 321, name: "Post 1", websiteId: 456, title: "This is post 1"},
            {_id: 432, name: "Post 2", websiteId: 456, title: "This is post 2"},
            {_id: 543, name: "Post 3", websiteId: 456, title: "This is post 3"},
            {_id: 543, name: "Vy's test page", websiteId: 567, title: "Vy test page"}
        ],
            api;

        function createPage(websiteId, page) {
            page.websiteId = websiteId;
            pages.push(page);
        }

        function findPageByWebsiteId(websiteId){
            var webPages = [];
            for(var p in pages){
                if(pages[p].websiteId === websiteId){
                    webPages.push(pages[p]);
                }
            }
            return webPages;

        }

        function findPageById(pageId){
            for(var p in pages){
                if(pages[p]._id === pageId){
                    return pages[p];
                }
            }
        }

        function updatePage(pageId, page){
            for(var p in pages){
                if(pages[p]._id === pageId){
                    pages[p] = page;
                    break;
                }
            }
        }

        function deletePage(pageId){
            for(var p in pages){
                if(pages[p]._id === pageId){
                    pages.splice(p, 1);
                    break;
                }
            }
        }
        api = {
            createPage          : createPage,
            findPageByWebsiteId : findPageByWebsiteId,
            findPageById        : findPageById,
            updatePage          : updatePage,
            deletePage          : deletePage
        };
        return api;
    }
})();

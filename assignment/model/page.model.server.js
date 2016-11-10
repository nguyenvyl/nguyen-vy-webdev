module.exports=function(app) {

    var service = {
        createPage: createPage,
        findPageById: findpageById,
        findPagesByWebsiteId: findPagesByWebsiteId,
        updatePage: updatePage,
        deletePage: deletePage
    };
    return service;

    function createPage(){}
    function findpageById(){}
    function findPagesByWebsiteId(){}
    function updatePage(){}
    function deletePage(){}
}
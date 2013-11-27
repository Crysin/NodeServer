OntologueManager = function(app) {
    var OntologueProvider = require('./ontologueProvider').OntologueProvider;
    var ontologueProvider = new OntologueProvider();
    /*
    ontologueProvider.insertResource(
        {creationDate:"10/30/2013",uri: "img/resources/cat-image_1.jpg",width: 800,height: 600,tags:["cat:","dog"]}, function(a,b){});
    ontologueProvider.insertResource(
        {creationDate:'10/30/2013',uri:'img/resources/cat-image_2.jpg',width:800,height:600,tags:["cat","dog"]}
        , function(a,b){});
*/
    app.get('/resources', function(req, res) {
        ontologueProvider.fetchAllResources(function(error, resources) {
            res.send(resources);
        });
    });

    app.post('/resources', function(req, res) {
        ontologueProvider.insertResource(req.body, function(error, resource) {
            if (error) {
                res.send(error, 500);
            } else {
                res.send(resource);
            }
        });
    });

    app.get('/resources/:tag', function(req, res) {
        ontologueProvider.fetchResourceByTag(req.params.tag, function(error, resource) {
            console.log("External Tags: " + req.params.tag);
            if (resource == null) {
                res.send(error, 404);
            } else {
                res.send(resource);
            }
        });
    });

    app.post('/resources/:tag', function(req, res) {
        var _resource = req.body;
        console.log("reading");
        _resource.tags= req.params.tags;
        resourceProvider.updateResource(_resource, function(error, resource) {
            if (resource == null) {
                res.send(error, 404);
            } else {
                res.send(resource);
            }
        });
    });

    app.delete('/resourcess/:id', function(req, res) {
        resoruceProvider.deleteResource(req.params.id, function(error, resource) {
            if (resource == null) {
                res.send(error, 404);
            } else {
                res.send(resource);
            }
        });
    });
};

exports.OntologueManager = OntologueManager;

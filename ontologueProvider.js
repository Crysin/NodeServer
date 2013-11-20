var nextResourceId = 1;

OntologueProvider = function() {
    this.resources = [];

    this.fetchAllResources = function(cb) {
        cb(null, this.resources);
    };

    this.fetchResourceById = function(id, cb) {
        var foundResources = this.resources.filter(function(resource) {return resource._id == id});

        if (foundResources.length == 0) {
            cb('Resource not found', null);
        } else {
            cb(null, foundResources[0]);
        }
    };

    this.insertResource = function(resource, cb) {
        var _id =  "\"_id\":" + "\"" + (nextResourceId++).toString() + "\"" + ",";
        resource = JSON.stringify(resource);
        resource = [resource.slice(0, 1), _id, resource.slice(1)].join('');
        resource = JSON.parse(resource);


        this.resources.push(resource);
        cb(null, resource);
    };

    this.updateResource = function(resource, cb) {
        this.fetchResourceById(resource._id, function(error, _resource) {
            if (error) {
                cb(error, null);
            } else {
                _resource.creationDate = resource.creationDate;
                _resource.uri = resource.uri;
                _resource.width = resource.width;
                _resource.height = resource.height;
                _resource.tags = resource.tags;
                cb(null, _resource);
            }
        });
    };

    this.deleteUser = function(id, cb) {
        this.resources = this.resources.filter(function(resource) {return resource._id != id});
        cb(null, {_id:id});
    };
};

exports.OntologueProvider = OntologueProvider;
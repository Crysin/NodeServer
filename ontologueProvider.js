var nextResourceId = 1;
fs = require('fs');
OntologueProvider = function() {
    var newData = [];
    var jsonData;

    this.fetchAllResources = function(cb) {
        console.log(newData.length)
        fs.open('test.json','a+',function(err,fd)
        {
            if(err)
            {
                console.error(err.stack);
                return;
            }
            console.log("FD: " + fd);
            fs.readFile('test.json', function(err, data){
                console.error(err);
                if(data.toString().length ==0)
                {
                    fs.appendFile('test.json','[]', function(err)
                    {
                        if(err) throw err;
                    });
                }
                else
                {
                    jsonData = newData;
                    jsonData.toString();
                    //jsonData = JSON.parse(jsonData);
                    console.log(jsonData)
                    fs.appendFile('test.json',jsonData, function(err)
                    {
                        if(err) throw err;
                    });
                }
                cb(null, jsonData);
                fs.close(fd,function()
                {
                    console.log('Done');
                });
            });
        });
    };

    this.fetchResourceById = function(id, cb) {
        var foundResources = newData.filter(function(resource) {return resource._id == id});

        if (foundResources.length == 0) {
            cb('Resource not found', null);
        } else {
            cb(null, foundResources[0]);
        }
    };

    this.insertResource = function(resource, cb) {
                //resource = resource.toString();
                //resource = JSON.parse(resource);
                //resource = JSON.parse(resource);
                console.log(resource);
                newData.push(resource);
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
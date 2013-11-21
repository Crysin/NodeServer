var nextResourceId = 0;
fs = require('fs');

var newData = [];
var jsonData;

fs.open('test.json','a+',function(err,fd)
{
    if(err)
    {
        console.error(err.stack);
        return;
    }
    fs.readFile('test.json',function(err,data){
        if(err)
        {
            console.error(err.stack);
            return;
        }
        if(data.toString().length ==0)
        {
            fs.appendFile('test.json','[]', function(err)
            {
                if(err) throw err;
            });
        }
        else
        {

            jsonData = JSON.parse(data);
            newData = jsonData;
            nextResourceId = newData.length;
            console.log(newData[0]);
        }
        fs.close(fd,function()
        {
            console.log('Done');
        });
    });
});

OntologueProvider = function() {

    this.fetchAllResources = function(cb) {
                 console.log(jsonData);
                //jsonData = JSON.parse(newData);
                cb(null, jsonData);
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
        resource.id = nextResourceId++;
        newData.push(resource);
        jsonData = newData;
        jsonData.toString();
        fs.open('test.json','a+',function(err,fd)
        {
            fs.writeFile('test.json',JSON.stringify(jsonData), function(err)
            {
                if(err) throw err;
            });

            fs.close(fd,function()
            {
                console.log('Done');
                cb(null, resource);
            });
        });
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
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
        }
        fs.close(fd,function()
        {
            console.log('Done');
        });
    });
});

OntologueProvider = function() {

    this.fetchAllResources = function(cb) {
                cb(null, jsonData);
                console.log("Tags: " + newData[11].tags[0]);
    };

    this.fetchResourceByTag = function(tags, cb) {
        var termNamesToMatch, foundResources, tagIndex, tagCount, currentTermToMatch, matches;
        termNamesToMatch = tags.split(',');
        console.log("Tag Length: " + termNamesToMatch.length);
        console.log("Tag 0: " + termNamesToMatch[0]);
        console.log("Tag 1: " + termNamesToMatch[1]);
        foundResources = newData.filter(function(resource) {
            tagCount = resource.tags.length;
            for(tagIndex = 0; tagIndex < tagCount; tagIndex++)
            {
                currentTermToMatch = 0;
                while(currentTermToMatch < termNamesToMatch.length)
                {
                    console.log("Resource Tags and Matching Tag: " + resource.tags[tagIndex] + termNamesToMatch[currentTermToMatch]);
                    if(resource.tags[tagIndex] == termNamesToMatch[currentTermToMatch])
                    {
                        matches = resource;
                    }
                    currentTermToMatch++;
                }
            }
            return matches;
        });

        if (foundResources.length == 0) {
            cb('Resource not found', null);
        } else {
            cb(null, foundResources);
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
        this.fetchResourceByTag(resource.tags, function(error, _resource) {
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
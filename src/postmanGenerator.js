const _ = require('lodash');
const postmanEnvGenerator = require('./postmanEnvGenerator');
const postmanCollectionGenerator = require('./postmanCollectionGenerator');
const generatorName = "Postman";
const generatorLang = "javascript";

function generate(request) {
    var testSuites = request.testSuites;
    var name = request.name;
  
    var envFile = postmanEnvGenerator.generate(request);
    var collectionFile = postmanCollectionGenerator.generate(request);

    
    return  {
        name: generatorName,
        files: [
            collectionFile,
            envFile
        ]
    
    };
}
exports.generate = generate;
exports.NAME = generatorName;

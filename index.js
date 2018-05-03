const _ = require('lodash');
const swaggerDataProvider = require('./src/swaggerDataProvider');
const swaggerToTestsTransformer = require('./src/swaggerToTestsTransformer');
const gherkinGenerator = require('./src/gherkinGenerator');
const postmanGenerator = require('./src/postmanGenerator');
const availableGeneratorNames = [gherkinGenerator.NAME, postmanGenerator.NAME];
const availableGenerators =  [gherkinGenerator, postmanGenerator] ;

async function generateFromSwagger(urlOrData, options = {codes: [], methods: [], generators: availableGeneratorNames}) {
    var selectedGenerators = options.generators;
    var data = await swaggerDataProvider.getData(urlOrData);
    var testsData =   swaggerToTestsTransformer.transform({
        apiDefinition: data,
        options: options
    });
    var results = [];  
   _.forEach(availableGenerators, function(generator) {
        if (selectedGenerators.indexOf(generator.NAME) >= 0) {
            results.push(generator.generate(testsData));
        }
   });

   // console.log(testsData);
    return {
        results: results   
    };
}

exports.generateFromSwagger = generateFromSwagger;
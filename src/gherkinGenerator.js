const _ = require('lodash');
const givenStatementsGenerator = require('./gherkinGivenGenerator');

const generatorName = "Gherkin";
const generatorLang = "gherkin";


function generateScenarios(testSuites) {
    var lines = [];
  
    _.forEach(testSuites, function (testSuite) {
        _.forEach(testSuite.tests, function (test) {
            lines.push(`Scenario: ${test.name}`);
            lines.push(givenStatementsGenerator.generate(test));
            lines.push(`When I submit to "${test.path}" using "${test.method}"`);
            lines.push(`Then I should receive "${test.code}" status code`);
            lines.push('\r\n');
        });

    });
    return lines;

};

function generate(request) {
    var testSuites = request.testSuites;
    var name = request.name;
    var scenarios = generateScenarios(testSuites);

    var lines = [];
    lines.push("");
    lines.push(`Feature: ${name}`);
    lines.push('\r\n');
    var contents = lines.concat(scenarios).join('\r\n');

    return  {
        name: generatorName,
        files: [
            {
                name: "Feature file contents",
                filename: `${name}.feature`,
                lang:    generatorLang,
                contents: contents
            }
        ]
    
    };
}
exports.generate = generate;
exports.NAME = generatorName;

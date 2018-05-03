const _ = require('lodash');
const pathHelper = require('./pathHelper');

function innerGenerate(testSuites) {
    var values = [];
   
    values.push(
        {
            "key": "url",
            "value": "TODO",
            "enabled": true,
            "type": "text"
        }
    );
    var names = [];
    _.forEach(testSuites, function (testSuite, testSuiteKey) {
        _.forEach(testSuite.tests, function (testCase, testCaseKey) {
            var paths = pathHelper.getPath(testCase.path);
            _.forEach(paths, function (path) {
                if (path.startsWith("{")) {
                    var tmp = path.replace("{{", "").replace("}}", "");
                    if (names.indexOf(tmp) == -1) {
                        names.push(tmp);
                    }
                }
            });
        });
    });
    _.forEach(names, function (name) {
        values.push(
            {
                "key": name,
                "value": "TODO",
                "enabled": true,
                "type": "text"
            });
    });


    return {
        "name": "TEST",
        "_postman_variable_scope": "environment",
        "values": values
    };
}
function generate(testSuites) {

    return {
        "name": "Environment file contents",
        "filename": "env.collection.json",
        "contents": `\r\n${JSON.stringify(innerGenerate(testSuites), null, 1)}`,
        "lang": "javascript"
    }
}

exports.generate = generate;

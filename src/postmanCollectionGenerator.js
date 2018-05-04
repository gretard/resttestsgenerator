const _ = require('lodash');

const objsGenerator = require('./objsGenerator');


function getPath(path) {
    var paths = [];

    _.forEach(path.split('/'), function (path) {
        if (path.length == 0) {
            return;
        }

        if (path.startsWith("{")) {
            paths.push("{" + path + "}");
            return;
        }
        paths.push(path);
    });
    return paths;
}


function generateBody(testCase, defs) {
    var index = _.findIndex(testCase.params, ['in', 'body']);
    if (testCase.method == "get" || index == -1 || !testCase.checks.generateRequestCode) {
        return ""
    }

    var obj = objsGenerator.generate(testCase.params[0].schema || testCase.params[0], defs);

    return JSON.stringify(obj, null, 2);
}

function generateTests(testCase) {
    if (!testCase.checks.generateStatusCheckCode) {
        return [];
    }
    var code = testCase.code;
    return [
        {
            "listen": "test",
            "script": {
                "type": "text/javascript",
                "exec": [
                    "pm.test(\"Status code is " + code + "\", function () {",
                    "    pm.response.to.have.status(" + code + ");",
                    "});"
                ]
            }
        }
    ]
}

function innerGenerate(request) {
    var testSuites = request.testSuites;
    var definitions = request.definitions;
    var items = [];
    _.forEach(testSuites, function (testSuite, testSuiteKey) {
        var tests = [];
        _.forEach(testSuite.tests, function (testCase, testCaseKey) {
            var path = getPath(testCase.path);
            var code = testCase.code;
            var headers = testCase.headers;
            var basePath = path.join('/');
            tests.push(
                {
                    "name": testCase.name,
                    "event": generateTests(testCase),


                    "request": {
                        "description": testCase.description,
                        "method": testCase.method,
                        "header": headers,
                        "body": {
                            "mode": "raw",
                            "raw": generateBody(testCase, definitions)
                        },
                        "url": {
                            "raw": `{{url}}/${basePath}`,
                            "host": "{{url}}",
                            "port": "",
                            "path": path
                        }

                    }

                }
            )
        });

        items.push({
            "name": testSuite.name,
            "description": testSuite.description,
            "item": tests
        });
    });
    return {
        "info": {
            "name": `Tests: ${request.name}`,
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        "item": items
    };
}

function generate(request) {

    return {
        "name": "Collection file contents",
        "filename": "env.collection.json",
        "contents": `\r\n${JSON.stringify(innerGenerate(request), null, 1)}`,
        "lang": "javascript"
    }
}

exports.generate = generate;

const _ = require('lodash');

function generateHeaders(types = []) {
    if (types.indexOf('application/json') >= 0 || types.length == 0) {
        return [
            {
                "key": "Content-type",
                "value": "application/json"
            }
        ]
    }
    return [
        {
            "key": "Content-type",
            "value": types[0]
        }
    ];
}

function getStatusCode(code) {
    if (!code || code == "default") {
        return 200;
    }
    return code;
}

function transform(request) {

    var options = request.options || {codes: [], methods: []};
    var data = request.apiDefinition;
    var testSuites = [];
    var self = this;
    _.forEach(data.paths, function (value, path) {

        var tests = [];
        _.forEach(value, function (methodDesc, methodName) {
            _.forEach(methodDesc.responses, function (codeDesc, codeName) {
                var code = getStatusCode(codeName)
                if ((options.codes.length != 0 && options.codes.indexOf(code) < 0)
                    || (options.methods.length != 0 && options.methods.indexOf(methodName) < 0)
                ) {
                    return;
                }
                var params = methodDesc.parameters || [];
                tests.push(
                    {
                        "name": `${path} returns: ${codeDesc.description}`,
                        "description": `${path} returns: ${codeDesc.description}`,
                        "path": path,
                        "params": params,
                        "consumes": methodDesc.consumes || [],
                        "produces": methodDesc.produces || [],
                        "headers": generateHeaders(methodDesc.consumes),
                        "code": code,
                        "method": methodName,
                        "checks": {
                            "generateStatusCheckCode": true,
                            "generateRequestCode": true
                        }
                    }
                );

            });
        });
        if (tests.length > 0) {
            var testSuite = {
                "name": path,
                "description": `Tests for: ${path}`,
                "tests": tests
            };
            testSuites.push(testSuite);
        }

    });
    return {
        testSuites: testSuites,
        name: "",
        definitions: data.definitions,
        apiDefinition: data
    };
}

exports.transform = transform;
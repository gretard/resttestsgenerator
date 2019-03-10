const _ = require('lodash');

function generateHeaders(path, data) {
    var contentTypes = path.consumes || [];
    var acceptTypes = path.produces || [];
    var headers = [];
    if (contentTypes.length > 0) {
        if (contentTypes.indexOf('application/json') >= 0) {
            headers.push({
                "key": "Content-type",
                "value": "application/json"
            });
        }
        else {
            headers.push({
                "key": "Content-type",
                "value": contentTypes[0]
            });
        }
    }

    if (acceptTypes.length > 0) {
        if (acceptTypes.indexOf('application/json') >= 0) {
            headers.push({
                "key": "Accept",
                "value": "application/json"
            });
        }
        else {
            headers.push({
                "key": "Accept",
                "value": acceptTypes[0]
            });
        }
    }

    if (path.security && data.securityDefinitions && data.securityDefinitions.api_key && data.securityDefinitions.api_key.in == 'header') {
        headers.push({
            "key": `${data.securityDefinitions.api_key.name}`,
            "value": `{{apiKey}}`
        });
    }
    return headers;
}

function getStatusCode(code) {
    if (!code || code == "default") {
        return 200;
    }
    return code;
}
function getGlobalVariables(data) {
    var variables = [];
    variables.push("url");

    if (data.securityDefinitions && data.securityDefinitions.api_key) {
        variables.push("apiKey");
    }
    _.forEach(data.paths, function (pathDesc, path) {
        _.forEach(pathDesc, function (methodDesc, methodName) {
            _.forEach(methodDesc.parameters, function (param) {
                if (param.in == 'query' || param.in == 'path') {
                    var name = param.name;
                    if (variables.indexOf(name) < 0) {
                        variables.push(name);
                    }
                }
            });
        });
    });
    return variables;
}
function getTestSuites(data, options) {
    var self = this;
    var testSuites = [];
    var codes = options.codes || [];
    var methods = options.methods || [];
    _.forEach(data.paths, function (value, path) {

        var tests = [];
        _.forEach(value, function (methodDesc, methodName) {
            _.forEach(methodDesc.responses, function (codeDesc, codeName) {
                var code = getStatusCode(codeName)
                if ((codes.length != 0 && codes.indexOf(code) < 0)
                    || (methods.length != 0 && methods.indexOf(methodName) < 0)
                ) {
                    return;
                }
                var opPath = path;
                var paramsQuery = "";
                _.forEach(methodDesc.parameters, function (param) {
                    if (param.in == 'query') {
                        paramsQuery += `${param.name}={${param.name}}&`;
                    }
                });
                if (paramsQuery.length > 1) {
                    opPath = `${opPath}?${paramsQuery.substr(0, paramsQuery.lastIndexOf("&")-1)}`;
                }

                var params = methodDesc.parameters || [];
                tests.push(
                    {
                        "name": `${path} returns: ${codeDesc.description}`,
                        "description": `${path} returns: ${codeDesc.description}`,
                        "path": opPath,
                        "params": params,
                        "consumes": methodDesc.consumes || [],
                        "produces": methodDesc.produces || [],
                        "headers": generateHeaders(methodDesc, data),
                        "code": code,
                        "method": methodName,
                        "checks": {
                            "generateStatusCheckCode": true,
                            "generateRequestCode": true,
                            "needsAuthorization": methodDesc.security && data.securityDefinitions && data.securityDefinitions.api_key ? true : false
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
    return testSuites;
}
function transform(request) {

    var options = request.options || { codes: [], methods: [] };
    var data = request.apiDefinition || {};
    var testSuites = getTestSuites(data, options);
    var title = data && data.info && data.info.title ? data.info.title : "Service";
    var version = data && data.info && data.info.version ? ` v${data.info.version}` : "";
    var variables = getGlobalVariables(data);;


    return {
        testSuites: testSuites,
        variables: variables,
        name: `${title}${version}`,
        description: `${data && data.info ? data.info.description : ""}`,
        definitions: data.definitions || {},
        apiDefinition: data
    };
}

exports.transform = transform;

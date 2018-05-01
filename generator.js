

var swaggerParser = require('swagger-parser');
var _ = require('lodash');


class GherkinObjectsGenerator {

    constructor(data) {
        this.data = data;
    }

    generate(data) {
        if (!data) {
            return {};
        }
        var parent = {};
        this.innerGenerate(parent, "root", data);
        return parent.root;
    }

    innerGenerate(parent, key, data) {
        var self = this;
        if (data.$ref) {
            var newRoot = {};
            var name = data.$ref.replace("#/definitions/", "");
            var item = self.data.definitions[name];
            self.innerGenerate(newRoot, 0, item);
            parent[key] = newRoot[0];
            return;
        }
        if (data.type === 'object') {
            var newRoot = {};
            _.forEach(data.properties, function (val, key) {
                self.innerGenerate(newRoot, key, val);
            });
            parent[key] = newRoot;
            return;
        }

        if (data.type === 'array') {
            var obj = {};
            self.innerGenerate(obj, 0, data.items);
            parent[key] = [obj[0]];
            return;
        }

        if (data.enum && data.enum.length > 0) {
            parent[key] = `${data.enum[0]}`;
            return;
        }

        parent[key] = `valueOf${data.type}`;

    }
}

class PostmanObjectsGenerator {

    constructor(data) {
        this.data = data;
    }

    generate(data) {
        if (!data) {
            return {};
        }
        var parent = {};
        this.innerGenerate(parent, "root", data);
        return parent.root;
    }

    innerGenerate(parent, key, data) {
        var self = this;
        if (data.$ref) {
            var newRoot = {};
            var name = data.$ref.replace("#/definitions/", "");
            var item = self.data.definitions[name];
            self.innerGenerate(newRoot, 0, item);
            parent[key] = newRoot[0];
            return;
        }
        if (data.type === 'object') {
            var newRoot = {};
            _.forEach(data.properties, function (val, key) {
                self.innerGenerate(newRoot, key, val);
            });
            parent[key] = newRoot;
            return;
        }

        if (data.type === 'array') {
            var obj = {};
            self.innerGenerate(obj, 0, data.items);
            parent[key] = [obj[0]];
            return;
        }

        if (data.enum && data.enum.length > 0) {
            parent[key] = `${data.enum[0]}`;
            return;
        }

        parent[key] = `valueOf${data.type}`;

    }

}
class GherkinGivenStatementsGenerator {
    generate(test) {
        if (test.method == "get" || !test.checks.generateRequestCode) {
            return "Given I have request";
        }
        var index = _.findIndex(test.params, ['in', 'body']);
        
       
        if (index >= 0 ) {
            var bodyParam = test.params[index];
     
            if (bodyParam.schema && bodyParam.schema.$ref && !bodyParam.schema.type ) {
                return `Given I have a request of type "${bodyParam.schema.$ref.replace('#/definitions/', '')}"`;
            }
            if (bodyParam.schema && bodyParam.schema.type && bodyParam.schema.type == 'array' && bodyParam.schema.items.$ref) {
                return `Given I have an array of type "${bodyParam.schema.items.$ref.replace('#/definitions/', '')}"`;
            }
            return `Given I have a request of type "${bodyParam.name}"`;
           
        }
        var formData = _.find(test.params, ['in', 'formData']);
        if (!formData) {
            return "Given I have request";
        }
        var lines = [];
        lines.push("Given I have request with form data");
        lines.push("| Key | Value |");
       
        _.forEach(test.params, function(param, key) {
            if (param.in == 'formData') {
              
                lines.push(`| ${param.name} | valueOf${param.type} |`);
            }
          
        });

        
        return lines.join('\r\n');
    }
}
class GherkinTestsGenerator {

    constructor(data) {
        this.data = data;
        this.givenStatementsGenerator = new GherkinGivenStatementsGenerator();
    }

    generate(testSuites) {
        var files = [];
        var self = this;


        files.push({
            "name": self.data.name,
            "filename": `${self.data.name}.feature`,
            "contents": self.generateTests(testSuites).join('\r\n'),
            "lang": "gherkin"
        });
        return files;
    }
  

    generateTests(testSuites) {
        var self = this;
        var lines = [];
        lines.push("");
        lines.push(`Feature: ${self.data.info.title} of v.${self.data.info.version}`);
        lines.push('\r\n');
        _.forEach(testSuites, function (testSuite) {
            _.forEach(testSuite.tests, function (test) {
                lines.push(`Scenario: ${test.name}`);
                lines.push(self.givenStatementsGenerator.generate(test));
                lines.push(`When I submit to "${test.path}" using "${test.method}"`);
                lines.push(`Then I should receive "${test.code}" status code`);
                lines.push('\r\n');
            });

        });
        return lines;

    }

}

class PostmanTestsGenerator {

    constructor(data) {
        this.data = data;
        this.PostmanObjectsGenerator = new PostmanObjectsGenerator(this.data);
    }

    generate(testSuites) {
        var files = [];
        files.push({
            "name": "Collection file contents",
            "contents": `\r\n${JSON.stringify(this.generateCollection(testSuites), null, 1)}`,
            "lang": "javascript"
        });
        files.push({
            "name": "Environment file contents",
            "contents": `\r\n${JSON.stringify(this.generateEnvironment(testSuites), null, 1)}`,
            "lang": "javascript"
        });
        return files;
    }

    getPath(path) {
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

    generateBody(testCase) {
        var self = this;
        var index = _.findIndex(testCase.params, ['in', 'body']);
        if (testCase.method == "get" || index == -1 || !testCase.checks.generateRequestCode) {
            return ""
        }

        var obj = this.PostmanObjectsGenerator.generate(testCase.params[0].schema || testCase.params[0]);

        return JSON.stringify(obj, null, 2);
    }

    generateTests(testCase) {
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

    generateCollection(testSuites) {
        var self = this;
        var items = [];
        _.forEach(testSuites, function (testSuite, testSuiteKey) {
            var tests = [];
            _.forEach(testSuite.tests, function (testCase, testCaseKey) {
                var path = self.getPath(testCase.path);
                var code = testCase.code;
                var headers = testCase.headers;
                var basePath = path.join('/');
                tests.push(
                    {
                        "name": testCase.name,
                        "event": self.generateTests(testCase),


                        "request": {
                            "description": testCase.description,
                            "method": testCase.method,
                            "header": headers,
                            "body": {
                                "mode": "raw",
                                "raw": self.generateBody(testCase)
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
                "name": `Tests: ${this.data.info.title}`,
                "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
            },
            "item": items
        };
    }

    generateEnvironment(testSuites) {
        var values = [];
        var self = this;
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
                var paths = self.getPath(testCase.path);
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

}
class SwaggerToTestsTransformer {

    constructor(data, options = { codes: [], methods: [] }) {
        this.data = data;
        this.options = options;
        this.options.codes = this.options.codes || [];
        this.options.methods = this.options.methods || [];
    }
    generateHeaders(types = []) {


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
    getStatusCode(code) {
        if (!code || code == "default") {
            return 200;
        }
        return code;
    }
    transform() {
        var options = this.options;
        var data = this.data;
        var testSuites = [];
        var self = this;
        _.forEach(data.paths, function (value, path) {

            var tests = [];
            _.forEach(value, function (methodDesc, methodName) {
                _.forEach(methodDesc.responses, function (codeDesc, codeName) {
                    var code = self.getStatusCode(codeName)
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
                            "headers": self.generateHeaders(methodDesc.consumes),
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
        return testSuites;
    }

}
class SwaggerDataProvider {

    constructor(urlOrCode) {
        this.urlOrCode = urlOrCode;
    }

    async getData() {
        
        if (this.data) {
            return this.data;
        }

        if (!this.urlOrCode.startsWith("http")) {
            this.data = await swaggerParser.parse(JSON.parse(this.urlOrCode));
        }else {
            this.data =await swaggerParser.parse(this.urlOrCode);
        }
        return this.data;
    }
}

exports.Generator = function () {
  
    var generate = async function (url, options) {
        var dataProvider = new SwaggerDataProvider(url);
        var apiData = await dataProvider.getData();
        var tests = new SwaggerToTestsTransformer(apiData, options).transform();
        var postman = new PostmanTestsGenerator(apiData).generate(tests);
        var gherkin = new GherkinTestsGenerator(apiData).generate(tests);

        return {
            "tests": tests,
            "postman": postman,
            "gherkin": gherkin
        };

    }

  

    return {
        generate: generate
    }
}  

exports.PostmanObjectsGenerator = PostmanObjectsGenerator;
exports.GherkinTestsGenerator = GherkinTestsGenerator;
exports.GherkinGivenStatementsGenerator = GherkinGivenStatementsGenerator;
exports.SwaggerDataProvider = SwaggerDataProvider;
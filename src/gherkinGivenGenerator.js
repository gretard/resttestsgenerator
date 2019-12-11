const _ = require('lodash');


function generate(test) {

    var requestType = test.checks.needsAuthorization ? '"authorized"' : '"unauthorized"';
    
    if (test.method === "get" || !test.checks.generateRequestCode || test.params.length === 0
        || (test.params.length === _.filter(test.params, ['in', 'path']).length)
    ) {
        return `Given I have ${requestType} request`;
    }

    if (test.params.length === 1 && test.params[0].in === "body") {
        var bodyParam = test.params[0];

        if (bodyParam.schema && bodyParam.schema.$ref && !bodyParam.schema.type) {
            return `Given I have ${requestType} request of type "${bodyParam.schema.$ref.replace('#/definitions/', '')}"`;
        }

        if (bodyParam.schema && bodyParam.schema.type && bodyParam.schema.type == 'array' && bodyParam.schema.items.$ref) {
            return `Given I have ${requestType} request with an array of type "${bodyParam.schema.items.$ref.replace('#/definitions/', '')}"`;
        }

        return `Given I have ${requestType} request of type "${bodyParam.name}"`;

    }



    var lines = [];
    lines.push(`Given I have ${requestType} request with data`);
    lines.push("| Key | Value | Type | Description |");

    _.forEach(test.params, function (param, key) {
        if (param.in === 'path') {
            return;
        }
        var type = `${param.type}`;
        var value = `valueOf${param.type}`;
        var description = (param.description && param.description != undefined) ? param.description : "";
        if (param.schema && param.schema.$ref && !param.schema.type) {
            type = `${param.schema.$ref.replace('#/definitions/', '')}`;
            value = `valueOf${param.schema.$ref.replace('#/definitions/', '')}`;
        }
        lines.push(`| ${param.name} | ${value} | ${type} | ${description} |`);
    });
    return lines.join('\r\n');
}

exports.generate = generate;


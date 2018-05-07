const _ = require('lodash');


function generate(test) {

    var requestType = test.checks.needsAuthorization ? '"authorized"' : '"unauthorized"';
    if ((test.method == "get" || ! test.checks.generateRequestCode)) {
        return `Given I have ${requestType} request`;
    }

    var index = _.findIndex(test.params, ['in', 'body']);
    
   
    if (index >= 0 ) {
        var bodyParam = test.params[index];
 
        if (bodyParam.schema && bodyParam.schema.$ref && !bodyParam.schema.type ) {
            return `Given I have ${requestType} request of type "${bodyParam.schema.$ref.replace('#/definitions/', '')}"`;
        }

        if (bodyParam.schema && bodyParam.schema.type && bodyParam.schema.type == 'array' && bodyParam.schema.items.$ref) {
            return `Given I have r${requestType} request with an array of type "${bodyParam.schema.items.$ref.replace('#/definitions/', '')}"`;
        }

        return `Given I have ${requestType} request of type "${bodyParam.name}"`;
       
    }
    var formData = _.find(test.params, ['in', 'formData']);
    if (!formData) {
        return `Given I have ${requestType} request`;
    }
    
    var lines = [];
    lines.push(`Given I have ${requestType} request with form data`);
    lines.push("| Key | Value |");
   
    _.forEach(test.params, function(param, key) {
        if (param.in == 'formData') {
          
            lines.push(`| ${param.name} | valueOf${param.type} |`);
        }
      
    });

    
    return lines.join('\r\n');
}

exports.generate = generate;


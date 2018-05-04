const _ = require('lodash');

function generate(request) {
    var values = [];
    var names = request.variables;
    _.forEach(names, function (name) {
        values.push(
            {
                "key": name,
                "value": "TODO",
                "enabled": true,
                "type": "text"
            });
    });


    var vars = {
        "name": "TEST",
        "_postman_variable_scope": "environment",
        "values": values
    };

    return {
        "name": "Environment file contents",
        "filename": "env.collection.json",
        "contents": `\r\n${JSON.stringify(vars, null, 1)}`,
        "lang": "javascript"
    }
}

exports.generate = generate;

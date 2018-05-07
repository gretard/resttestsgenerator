const _ = require('lodash');
function generate(item, defs) {
    if (!item) {
        return {};
    }
    var parent = {};
    innerGenerate(parent, "root", item, defs, 4);
    return parent.root;
}

function innerGenerate(parent, key, data, defs, level) {
    var newLevel = level - 1;
    if (newLevel < 0) {
        parent[key] = null;
        return;
    }

    var self = this;
    if (data.$ref) {
        var newRoot = {};
        var name = data.$ref.replace("#/definitions/", "");
        var item = defs[name];
        innerGenerate(newRoot, 0, item, defs, newLevel);
        parent[key] = newRoot[0];
        return;
    }
    if (data.type === 'object') {
        var newRoot = {};
        _.forEach(data.properties, function (val, key) {
            innerGenerate(newRoot, key, val, defs, newLevel);
        });
        parent[key] = newRoot;
        return;
    }

    if (data.type === 'array') {
        var obj = {};
        innerGenerate(obj, 0, data.items, defs, newLevel);
        parent[key] = [obj[0]];
        return;
    }

    if (data.enum && data.enum.length > 0) {
        parent[key] = `${data.enum[0]}`;
        return;
    }

    parent[key] = `valueOf${data.type}`;

}

exports.generate = generate;

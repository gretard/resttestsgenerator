const _ = require('lodash');

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

exports.getPath = getPath;
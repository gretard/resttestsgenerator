const swaggerParser = require('swagger-parser');

async function getData(urlOrCode) {
    if (!urlOrCode.startsWith("http")) {
        return  await swaggerParser.parse(JSON.parse(urlOrCode));
    }
    
    return await swaggerParser.parse(urlOrCode);
}
exports.getData = getData;
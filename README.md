# Rest tests generator
A library to generate Postman or Gherkin tests. Library reads all paths, methods and responses and for each pair generates tests.

## Installation ##

```
npm install github:gretard/resttestsgenerator
```

## Usage ##
```
var generator = require('resttestsgenerator');
generate.generateFromSwagger('http://urltoswaggerdef/swagger.json'); 

// or you pass definition directly
generate.generateFromSwagger(JSON.stringify({
      swagger: "2.0",
      info: {
        title: "Test service",
        version: "1.0.0"
      },
      paths: {
        "/health": {
          "get": {
            "summary": "Returns health status",
            "responses": {
              200: "OK",
              500: "Internal system error"
            },
            "security": {

            }
          }
        }
      }
    })); 

```

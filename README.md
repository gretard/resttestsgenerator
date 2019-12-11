# Rest tests generator
A library to generate Postman or Gherkin tests. Library reads all paths, methods and responses and for each pair generates tests. You can checkout demo at https://gretard.github.io/resttestsgenerator/

## Installation ##

```
npm install github:gretard/resttestsgenerator#1.0.0
```

## Usage ##

### Generating from url ###
```
const generator = require('resttestsgenerator');
const genResults = generator.generateFromSwagger('https://petstore.swagger.io/v2/swagger.json'); 
genResults.then(generatedResults=> {
    generatedResults.results.forEach(result => {
        console.log(result);  
    });
});
```

This example will generate both Gherkin and Postman results.

### Generating Gherkin template from swagger object ###
```
// or you can pass definition directly
const generator = require('resttestsgenerator');
const genResults = generator.generateFromSwagger(JSON.stringify({
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
                    200: {
                        "description": "OK"
                    }
                }
            }
        },
        "/state": {
            "post": {
                "parameters": [
                    {
                        "name": "available",
                        "in": "formData",
                        "type": "boolean"
                    }
                ],
                "summary": "Returns health status",
                "responses": {
                    200: {
                        "description": "OK"
                    }
                }
            }
        }
    }
}), { generators: ["Gherkin"] });

genResults.then(generatedResults => {
    generatedResults.results.forEach(result => {
        result.files.forEach(fileData => {
            console.log(fileData.contents)
        })
    });
});
```
The last example will produce gherkin output with:

```
Feature: Test service v1.0.0


Scenario: /health returns: OK
Given I have "unauthorized" request
When I submit to "/health" using "get"
Then I should receive "200" status code


Scenario: /state returns: OK
Given I have "unauthorized" request with form data
| Key | Value |
| available | valueOfboolean |
When I submit to "/state" using "post"
Then I should receive "200" status code

```

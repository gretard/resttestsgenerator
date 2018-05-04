# Rest tests generator
A library to generate Postman or Gherkin tests. Library reads all paths, methods and responses and for each pair generates tests.

## Installation ##

```
npm install github:gretard/resttestsgenerator
```

## Usage ##

### Generating from url ###
```
var generator = require('resttestsgenerator');
var genResults = generate.generateFromSwagger('http://urltoswaggerdef/swagger.json'); 
```

This example will generate both Gherkin an postman results.

### Generating from swagger object ###
```
// or you can pass definition directly
var generator = require('resttestsgenerator');
var results = generate.generateFromSwagger(JSON.stringify({
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
    }), {generators: ["Gherkin]}); 


```
The last example will produce gherkin file with:

```
Feature: Test service v1.0.0


Scenario: /health returns: undefined
Given I have "unauthorized" request
When I submit to "/health" using "get"
Then I should receive "200" status code


Scenario: /health returns: undefined
Given I have "unauthorized" request
When I submit to "/health" using "get"
Then I should receive "500" status code

```

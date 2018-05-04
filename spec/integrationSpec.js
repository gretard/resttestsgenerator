describe("SwaggerDataProvider", function () {

  var generator = require('./../index');
  var fs = require('fs');
  beforeEach(function () {

  });

  it("should be able to generate tests from url", async function () {
    var result = await generator.generateFromSwagger("http://petstore.swagger.io/v2/swagger.json", { generators: ["Gherkin"] });
    expect(result.results.length).toEqual(1);

  });

  it("should be able to generate tests from url22", async function () {
    var result = await generator.generateFromSwagger("http://petstore.swagger.io/v2/swagger.json", { generators: ["Postman"] });
    expect(result.results.length).toEqual(1);
    expect(result.results[0].files.length).toEqual(2);

  });

  it("should be able to generate tests from data", async function () {
    var result = await generator.generateFromSwagger(JSON.stringify({
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
    expect(result).toBeDefined();
  });


});
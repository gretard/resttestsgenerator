describe("SwaggerDataProvider", function () {

    var generator = require('./../src/swaggerToTestsTransformer');
       
     beforeEach(function () {
    
     });
    

     it("should be able to generate tests from swagger",async function () {
       var result =  await  generator.transform({
         apiDefinition: {

          paths:{
            "/test": {
              "get": {
                "consumes": [
                  "testConsumes"
                ],
                "produces": [
                  "testProduces"
                ],
                "responses": {
                  200: "test 200"
                },
                "security": {

                }
              }
            }
          }
        }
       });
       expect(result.testSuites.length).toEqual(1);
       expect(result.testSuites[0].tests.length).toEqual(1);
      });
   });
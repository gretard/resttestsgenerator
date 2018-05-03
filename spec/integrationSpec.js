describe("SwaggerDataProvider", function () {

    var generator = require('./../index');
       
     beforeEach(function () {
    
     });
    

     it("should be able to read url",async function () {
       var result =  await  generator.generateFromSwagger("http://petstore.swagger.io/v2/swagger.json");
       expect(result).toBeDefined();
   
     });
   });
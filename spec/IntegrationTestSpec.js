describe("GeneratorTest", function () {
    var generator = require('./../generator');
      
   
      beforeEach(function () {
      
      });

      it("should be able to generate tests",async function () {
       var result = await generator.Generator().generate("http://petstore.swagger.io/v2/swagger.json");
        expect(result.tests.length).toEqual(14);
    
      });
    });
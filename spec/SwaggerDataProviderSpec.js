describe("SwaggerDataProvider", function () {
    var generator = require('./../src/generator');
      
        
      beforeEach(function () {
      
      });

      it("should be able to read url",async function () {
        var result =  await new generator.SwaggerDataProvider('http://petstore.swagger.io/v2/swagger.json').getData();
        
        expect(result).toBeDefined();
    
      });
          /*
      it("should be able to read data",async function () {
        var result =  await new generator.SwaggerDataProvider(`{ "swagger": "2.0", "info": {
            "title": "test",
            "version": "1.0.0"    } }`).getData();
        
        expect(result).toEqual("Given I have request");
    
      });*/
    });
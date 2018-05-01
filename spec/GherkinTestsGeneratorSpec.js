describe("GherkinGivenStatementsGenerator", function () {
    var generator = require('./../src/generator');
      var objGenerator;
        
      beforeEach(function () {
        objGenerator = new generator.GherkinGivenStatementsGenerator();
      });
    
      it("should be able to get request", function () {
        var result = objGenerator.generate( 
                    {
                        name: "test1",
                        codeDesc: "test",
                        path: "/test",
                        method: "get",
                        code: 200,
                        checks: {
                            generateRequestCode: true
                        }
                    }
         );
        expect(result).toEqual("Given I have request");
    
      });
      it("should be able to genereate form data", function () {
        var result = objGenerator.generate( 
                    {
                        name: "test1",
                        codeDesc: "test",
                        path: "/test",
                        method: "post",
                        params: [
                            {
                                "name": "name",
                                "in": "formData",
                                "description": "Updated name of the pet",
                                "required": false,
                                "type": "string"
                              }
                        ],
                        code: 200,
                        checks: {
                            generateRequestCode: true
                        }
                    }
         );
        expect(result).toEqual(`Given I have request with form data\r\n| Key | Value |\r\n| name | valueOfstring |`);
    
      });
      it("should be able to genereate body data", function () {
        var result = objGenerator.generate( 
                    {
                        name: "test1",
                        codeDesc: "test",
                        path: "/test",
                        method: "post",
                        params: [
                            {
                                "name": "name",
                                "in": "body",
                                "description": "Updated name of the pet",
                                "required": false,
                                "type": "string"
                              }
                        ],
                        code: 200,
                        checks: {
                            generateRequestCode: true
                        }
                    }
         );
        expect(result).toEqual(`Given I have a request of type "name"`);
    
      });
      it("should be able to genereate array body data", function () {
        var result = objGenerator.generate( 
                    {
                        name: "test1",
                        codeDesc: "test",
                        path: "/test",
                        method: "post",
                        params: [
                            {
                                "name": "name",
                                "in": "body",
                                "description": "Updated name of the pet",
                                "required": false,
                                "type": "string",
                                "schema": {
                                    "type": "array",
                                    "items": {
                                      "$ref": "#/definitions/User"
                                    }
                                  }
                              }
                        ],
                        code: 200,
                        checks: {
                            generateRequestCode: true
                        }
                    }
         );
        expect(result).toEqual(`Given I have an array of type "User"`);
    
      });
      it("should be able to genereate  body data", function () {
        var result = objGenerator.generate( 
                    {
                        name: "test1",
                        codeDesc: "test",
                        path: "/test",
                        method: "post",
                        params: [
                            {
                                "name": "name",
                                "in": "body",
                                "description": "Updated name of the pet",
                                "required": false,
                                "type": "string",
                                "schema": {
                                    "$ref": "#/definitions/User"
                                  }
                              }
                        ],
                        code: 200,
                        checks: {
                            generateRequestCode: true
                        }
                    }
         );
        expect(result).toEqual(`Given I have a request of type "User"`);
    
      });
    });
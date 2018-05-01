describe("PostmanObjectsGenerator", function () {
var generator = require('./../src/generator');
  var objGenerator;

  beforeEach(function () {
    objGenerator = new generator.PostmanObjectsGenerator({
      "definitions": {
        "User": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int64"
            },
            "username": {
              "type": "string"
            }
          }
        }
      }
    });
  });

  it("should be able to generate string", function () {
    var result = objGenerator.generate({ 'type': 'string' });
    expect(result).toEqual('valueOfstring');

  });

  it("should be able to generate ref", function () {
    var result = objGenerator.generate({
      "type": "array",
      "items": {
        "$ref": "#/definitions/User"
      }
    });
    expect(result).toEqual([{ id: 'valueOfinteger', username: 'valueOfstring' }]);

  });

  it("should be able to generate array", function () {
    var result = objGenerator.generate({
      "name": "status",
      "in": "query",
      "description": "Status values that need to be considered for filter",
      "required": true,
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "available",
          "pending",
          "sold"
        ],
        "default": "available"
      },
      "collectionFormat": "multi"
    });
    expect(result).toEqual(['available']);

  });
  it("should be able to generate object", function () {
    var result = objGenerator.generate({
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "format": "int64"
        },

        "status": {
          "type": "string",
          "description": "Order Status",
          "enum": [
            "placed",
            "approved",
            "delivered"
          ]
        }

      },
      "xml": {
        "name": "Order"
      }
    });
    expect(result).toEqual({ id: 'valueOfinteger', status: 'placed' });

  });
});
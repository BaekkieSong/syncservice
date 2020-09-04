var assert = require("assert");
describe("Array2", function () {
  describe("#indexOf()2", function () {
    it("should return -1 when the value is not present", function () {
      assert.equal([1, 2, 5].indexOf(4), -1);
    });
  });
});

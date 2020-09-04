const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
describe("\x1b[32mCall Stack Unittest\x1b[0m", () => {
  this.a = 3;
  before("Before Ones", () => {
    console.log("before ones");
  });
  after("After Ones", () => {
    console.log("after ones");
  });
  beforeEach("Before Each", () => {
    console.log("before each");
  });
  afterEach("After Each", () => {
    console.log("after each");
  });
  describe("Internal Call Stack", () => {
    before("Before Ones", () => {
      console.log("before ones internal");
    });
    after("After Ones", () => {
      console.log("after ones internal");
    });
    beforeEach("Before Each", () => {
      console.log("before each internal");
    });
    afterEach("After Each", () => {
      console.log("after each internal");
    });
    it("Condition should be false", () => {
      assert(this.a != 2);
    });
    it("Condition should be true", () => {
      assert(this.a == 3);
    });
  });
});

describe("\x1b[32mChai Expect Unittest\x1b[0m", () => {
  it("Expect1", () => {
    var arr = [1, 2, 5, 3, 4];
    expect(arr, "arr expect").to.have.key([1, 2, 3, 4, 0]);
  });
});

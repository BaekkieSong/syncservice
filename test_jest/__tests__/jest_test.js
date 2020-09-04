function sum(a, b) {
  return a + b;
}
module.exports = sum;

test("sum 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

test("null test", () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
  expect(n).not.toBeNaN();
});

test("zero", () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});

test("two plus two is four", () => {
  expect(2 + 2).toBe(4);
  expect(2 + 2).toEqual(4);
  expect(2 + 2).not.toBe(3);
  expect(2 + 2).not.toEqual(3);
  let arr = [2, 3, 4];
  expect(arr).not.toBe([2, 3, 4]);
  expect(arr).toStrictEqual([2, 3, 4]);
});

test("object assignment", () => {
  const data = { one: 1 };
  data["two"] = 2;
  expect(data).not.toBe({ one: 1, two: 2 });
  expect(data).toEqual({ one: 1, two: 2 });
});

test("two plus two", () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);

  // toBe and toEqual are equivalent for numbers
  expect(value).toBe(4);
  expect(value).toEqual(4);
});

test("adding floating point numbers", () => {
  const value = 0.1 + 0.2;
  expect(value).not.toBe(0.3); // This won't work because of rounding error
  expect(value).toBeCloseTo(0.3); // This works.
});

test("there is no I in team", () => {
  expect("team").toBe("team");
  expect("team").not.toMatch(/I/);
});
test('but there is a "stop" in Christoph', () => {
  expect("Christoph").toMatch(/stop/);
});

const shoppingList = [
  "diapers",
  "kleenex",
  "trash bags",
  "paper towels",
  "beer",
];
test("the shopping list has beer on it", () => {
  expect(shoppingList).toContain("beer");
  expect(new Set(shoppingList)).toContain("beer");
  expect(shoppingList).toEqual(expect.arrayContaining(["beer", "trash bags"]));
  expect(shoppingList).toHaveLength(5);
  expect({ a: 3, b: 5 }).toEqual(expect.objectContaining({ a: 3 }));
  expect("abcdefg").toEqual(expect.stringContaining("cde"));
});

function compileAndroidCode() {
  throw new Error("you are using the wrong JDK");
}
test("compiling android goes as expected", () => {
  expect(compileAndroidCode).toThrow();
  expect(compileAndroidCode).toThrow(Error);

  // You can also use the exact error message or a regexp
  expect(compileAndroidCode).toThrow("you are using the wrong JDK");
  expect(compileAndroidCode).toThrow(/JDK/);
});

// 테스트 확장
expect.extend({
  toBeBack(result, OK) {
    // 여러 args를 가질 수 있음.
    if (result == OK) {
      return {
        message: () => "Good",
        pass: true,
      };
    } else {
      return {
        message: () => "Bad",
        pass: false,
      };
    }
  },
});
test("my extend test", () => {
  let result = 200;
  expect(result).toBeBack(200);
});

async function getExternalValue() {
  return 100;
}
expect.extend({
  async toBeDivisibleByExternalValue(received) {
    const externalValue = await getExternalValue();
    const pass = received % externalValue == 0;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be divisible by ${externalValue}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be divisible by ${externalValue}`,
        pass: false,
      };
    }
  },
});

test("is divisible by external value", async () => {
  await expect(100).toBeDivisibleByExternalValue();
  await expect(101).not.toBeDivisibleByExternalValue();
});

// 배열이 값을 포함하는지 확인하고 싶은 경우
describe("arrayContaining", () => {
  const expected = ["Alice", "Bob"];
  it("matches even if received contains additional elements", () => {
    expect(["Alice", "Bob", "Eve"]).toEqual(expect.arrayContaining(expected));
  });
  it("does not match if received does not contain expected elements", () => {
    expect(["Bob", "Eve"]).not.toEqual(expect.arrayContaining(expected));
  });
});
test("arrayContaining convert to jest format", () => {
  const expected = ["Alice", "Bob"];
  expect(["Alice", "Bob", "Eve"]).toEqual(expect.arrayContaining(expected));
  expect(["Bob", "Eve"]).not.toEqual(expect.arrayContaining(expected));
});

test("doAsync calls both callbacks", () => {
  expect.assertions(2);
  function callback1(data) {
    expect(data).toBeTruthy();
  }
  function callback2(data) {
    expect(data).toBeTruthy();
  }

  callback1(true);
  callback2(true);
});

async function getLemon() {
  return "lemon";
}
test("resolves to lemon using function", () => {
  // make sure to add a return statement
  return expect(Promise.resolve(getLemon())).resolves.toBe("lemon");
});

test("resolves to lemon", () => {
  // make sure to add a return statement
  return expect(Promise.resolve("lemon")).resolves.toBe("lemon");
});
test("resolves to lemon", async () => {
  await expect(Promise.resolve("lemon")).resolves.toBe("lemon");
  await expect(Promise.resolve("lemon")).resolves.not.toBe("octopus");
});

// Object containing house features to be tested
const houseForSale = {
  bath: true,
  bedrooms: 4,
  kitchen: {
    amenities: ["oven", "stove", "washer"],
    area: 20,
    wallColor: "white",
    "nice.oven": true,
  },
  "ceiling.height": 2,
};

test("this house has my desired features", () => {
  // Example Referencing
  expect(houseForSale).toHaveProperty("bath");
  expect(houseForSale).toHaveProperty("bedrooms", 4);

  expect(houseForSale).not.toHaveProperty("pool");

  // Deep referencing using dot notation
  expect(houseForSale).toHaveProperty("kitchen.area", 20);
  expect(houseForSale).toHaveProperty("kitchen.amenities", [
    "oven",
    "stove",
    "washer",
  ]);

  expect(houseForSale).not.toHaveProperty("kitchen.open");

  // Deep referencing using an array containing the keyPath
  expect(houseForSale).toHaveProperty(["kitchen", "area"], 20);
  expect(houseForSale).toHaveProperty(
    ["kitchen", "amenities"],
    ["oven", "stove", "washer"]
  );
  expect(houseForSale).toHaveProperty(["kitchen", "amenities", 0], "oven");
  expect(houseForSale).toHaveProperty(["kitchen", "nice.oven"]);
  expect(houseForSale).not.toHaveProperty(["kitchen", "open"]);

  // Referencing keys with dot in the key itself
  expect(houseForSale).toHaveProperty(["ceiling.height"], 2);
});

//.toMatchObject(object)

// 비동기 테스트1 (콜백)
test("the data is peanut butter", (done) => {
  function callback(data) {
    try {
      expect(data).toBe("peanut butter");
      done();
    } catch (error) {
      done(error);
    }
  }

  callback("peanut butter");
});

// Don't do this!
test("the data is peanut butter", () => {
  function callback(data) {
    expect(data).toBe("peanut butter");
  }

  callback("peanut butter");
});

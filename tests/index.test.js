test("Basic Jest Test", () => {
  expect(1).toBe(1);
});

const executeSELECTQuery = require("../src");
const readCSV = require("../src/csvReader");

test("Read CSV File", async () => {
  const data = await readCSV("./sample.csv");
  expect(data.length).toBeGreaterThan(0);
  expect(data.length).toBe(3);
  expect(data[0].name).toBe("John");
  expect(data[0].age).toBe("30");
});

const parseQuery = require("../src/queryParser");

test("Parse SQL Query", () => {
  const query = "SELECT id,name FROM sample";
  const parsed = parseQuery(query);

  expect(parsed).toEqual({
    fields: ["id", "name"],
    table: "sample",
  });
});

test("Error Handling - Invalid SQL Query", () => {
  const invalidQuery = "SELECT FROM"; // Invalid query missing table name after FROM
  expect(() => {
    parseQuery(invalidQuery);
  }).toThrow("Invalid query format");
});

test("Execute SQL Query", async () => {
  const query = "SELECT id,name FROM sample";
  const result = await executeSELECTQuery(query);
  expect(result.length).toBeGreaterThan(0);
  expect(result[0]).toHaveProperty("id");
  expect(result[0]).toHaveProperty("name");
  expect(result[0]).not.toHaveProperty("age");
  expect(result[0]).toEqual({ id: "1", name: "John" });
});

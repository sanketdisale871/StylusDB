const parseQuery = require("./queryParser");
const readCSV = require("./csvReader");

async function executeSELECTQuery(query) {
  try {
    // Parse the SELECT query
    const { fields, table } = parseQuery(query);

    // Read CSV data
    const data = await readCSV(`${table}.csv`);

    // Validate fields in the SELECT query
    const missingFields = fields.filter(
      (field) => !data[0].hasOwnProperty(field)
    );
    if (missingFields.length > 0) {
      throw new Error(
        `Field(s) '${missingFields.join(
          ", "
        )}' do(es) not exist in table '${table}'`
      );
    }

    // Filter the data based on the SELECTed fields
    const filteredData = data.map((row) => {
      const filteredRow = {};
      fields.forEach((field) => {
        filteredRow[field] = row[field];
      });
      return filteredRow;
    });

    return filteredData;
  } catch (error) {
    throw new Error(`Error executing query: ${error.message}`); // Re-throw any errors encountered during execution
  }
}

module.exports = executeSELECTQuery;

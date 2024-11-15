/**
 * Counts the number of rows in a table
 * @param {sqlite3.Database} db - The database to access
 * @param {string} tableName - The table to count
 * @returns {int} Number of rows in table
 */
export function count (db, tableName) {
  const res = db.get(`SELECT COUNT(*) FROM ${tableName}`, function (err, rows) { 
    if (err) {
      console.error(err.message);
    }

    return rows['COUNT(*)'];
  }).lastID;

  return res;
}

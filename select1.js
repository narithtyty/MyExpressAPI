var oracledb = require('oracledb');
var config = require('./config');
oracledb.getConnection(
  {
    user          : config.user,
    password      : config.password,
    connectString : config.connectString
  },
  function(err, connection) {
    if (err) {
      console.error(err.message);
      return;
    }
    connection.execute(
      // The statement to execute
      `SELECT fac_id, fac_name
       FROM faculty
       WHERE fac_id = :id`,
      // The "bind value" 180 for the bind variable ":id"
      [1],
      // execute() options argument.  Since the query only returns one
      // row, we can optimize memory usage by reducing the default
      // maxRows value.  For the complete list of other options see
      // the documentation.
      { maxRows: 1
        //, outFormat: oracledb.OBJECT  // query result format
        //, extendedMetaData: true      // get extra metadata
        //, fetchArraySize: 100         // internal buffer allocation size for tuning
      },

      // The callback function handles the SQL execution results
      function(err, result) {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
        console.log(result.rows);     // [ [ 180, 'Construction' ] ]
        doRelease(connection);
      });
  });

// Note: connections should always be released when not needed
function doRelease(connection) {
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}
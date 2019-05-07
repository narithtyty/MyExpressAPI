module.exports = {
    user          : "express",
    password      : "express",
    connectString : "192.168.199.73:1521/labvantage",
    externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
  };
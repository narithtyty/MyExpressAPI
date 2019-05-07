
var oracledb = require("oracledb");
var config =require("./config");
oracledb.getConnection({
    user : config.user,
    password : config.password,
    connectString : config.connectString
 },
 function(err, connection){
    if (err) {
        console.error(err.message);
        return; 
    }
    console.log('Connection was successful!');
 });
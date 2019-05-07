const express = require('express')
const bodyParser = require ('body-parser');
//import express from 'express';
const app = express();
var oracledb = require("oracledb");
var config =require("./config");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/test', function (req, res) {
    console.log(req.body);
    res.send(req.body);
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
            [1],
            { maxRows: 1},
            // The callback function handles the SQL execution results
            function(err, result) {
              if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
              }
              console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
              console.log(result.rows);     // [ [ 180, 'Construction' ] ]
              //doRelease(connection);
              return res.send(result.rows);
            });
        });
    //res.send('Got a POST request')
})

app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user')
})


// Normal Select 
app.post('/user', (req, res) => {
    //users[req.params.userId];
    //var id= req.params.userId;
    console.log(req.body);
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
             `,
           
            [],
         
            { maxRows: 3
            
            },
      
            function(err, result) {
              if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
              }
              console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
              console.log(result.rows);     // [ [ 180, 'Construction' ] ]
              var len = result.rows.length;
              console.log("len "+len);
              for(let i=0;i<len;i++){
                  console.log(result.rows[i]);
              }
              doRelease(connection);
              return res.send(result.rows);
            });
        });
    
  });

  // Function Oracle
  app.post('/user1', (req, res) => {
    //users[req.params.userId];
    //var id= req.params.userId;
    console.log(req.body);
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
          var bindvars = {
            p1:  'Chris', // Bind type is determined from the data.  Default direction is BIND_IN
            p2:  'Jones',
            ret:  { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 40 }
          };
          connection.execute(
            // The statement to execute
            `BEGIN :ret := testfunc(:p1, :p2); END;`,bindvars,
            function(err, result) {
              if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
              }
              console.log(result.outBinds);
              //.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
              //console.log(result.rows);     // [ [ 180, 'Construction' ] ]
              
              doRelease(connection);
              return res.send(result.outBinds);
            });
        });
    
  });


  // StoreProcedure Oracle
  app.post('/user1', (req, res) => {
    //users[req.params.userId];
    //var id= req.params.userId;
    console.log(req.body);
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
          var bindvars = {
            i:  'Chris',  // Bind type is determined from the data.  Default direction is BIND_IN
            io: { val: 'Jones', dir: oracledb.BIND_INOUT },
            o:  { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
          };
          connection.execute(
            // The statement to execute
            "BEGIN testproc(:i, :io, :o); END;",
            // The equivalent call with PL/SQL named parameter syntax is:
            // "BEGIN testproc(p_in => :i, p_inout => :io, p_out => :o); END;",,bindvars,
            function(err, result) {
              if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
              }
              console.log(result.outBinds);
              //.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
              //console.log(result.rows);     // [ [ 180, 'Construction' ] ]
              
              doRelease(connection);
              return res.send(result.outBinds);
            });
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
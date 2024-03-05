const mysql = require('mysql');

const connection = mysql.createConnection({
  host: "localhost",
  user: "test",
  password: "Refrt@234",
  database: "mydb",
});

connection.connect(function(error){
  if(error) throw error;
  console.log("database connected");
})

module.exports= connection;
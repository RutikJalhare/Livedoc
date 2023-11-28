const  mysql = require('mysql');
var conn = mysql.createConnection({
      host:'localhost',
      user:"root",  
      password: "",
      database: "practo",
      port:3307
    })
    conn.connect((err) => {
      if (err) {
        console.log(err)

      }
//  console.log('Database connected') 
    })


    module.exports=conn ;






    





const conn = require("./Database/database")
const express = require("express");
const path = require("path");
const app = express();
const { Server } = require('socket.io');
const http = require('http'); 
const { v4: uuidv4 } = require("uuid");
const server = http.createServer(app); 
const io = new Server(server); 
// Peer

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});





const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const multer = require('multer');
const fileUpload = require('express-fileupload');
app.use('/public', express.static('public'))
app.use("/peerjs", peerServer);

app.use(fileUpload());
app.use(express.json())
app.use(cookieParser());

const router = require("./Patientsroute/Route");
const doctorrouter = require("./Doctorroute/Route");

// loading  css for main.ejs
app.use(express.static(path.join(__dirname, 'public')));
// loading  css for patients ejs pages 
app.use(express.static(path.join(__dirname, 'public/patientscss')));

// loading  css for doctor ejs pages 
app.use(express.static(path.join(__dirname, 'public/doctorcss')));

app.use(express.json());       
app.use(express.urlencoded({extended:false }));
app.set('view engine', 'ejs');
app.use(
    bodyParser.json({
        limit: "50mb",
    })
);
// for parsing application/xwww-form-urlencoded
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
    })
);
// patients pages  route 
app.use("/patients/public",router)

// doctor pages  route 
 app.use("/doctor",doctorrouter)

app.use("/doctor",router)

app.get('/', (req, res) => { 
    res.render('Patients/main'); 
    
});


app.get("/video", (req, rsp) => {
    rsp.redirect(`/video/${uuidv4()}`);
  });
  app.get("/video/myroom/:room", (req, rsp) => {
    rsp.render("patientsroom" ,{roomId:req.params.room})
 //  rsp.render("patientsroom", { roomId: req.params.room });
    // rsp.redirect(`/`+req.params.room);
  });
  
  
  app.get("/video/:room", (req, res) => {
    res.render("room", { roomId: req.params.room });
  });







server.listen(5000,()=>{
        console.log("running on  5000")
})




// socket code here 


io.on('connection', (socket) => { 
    console.log(" connected")

    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", userId);
    
        socket.on("message", (message) => {
          io.to(roomId).emit("createMessage", message);
        });
      });













// get default chat function 
    socket.on('send message', (chat) => { 
		 console.log("chat" , chat )
         socket.emit('send message', (chat)); 
	});

 
    let Message  =[]
    socket.on('getchat', (data) => { 
        console.log(data)  
     let Profile_id=data.Receiver_id

        conn.query(`select  * from  messages  where Sender_Id = ? and Receiver_Id = ?  or Sender_Id = ? AND Receiver_Id=?  `,[data.Sender_id ,data.Receiver_id,data.Receiver_id, data.Sender_id  ], function (error, result) {
                        if (error) {
                              console.log(error)
                        }
                        else {
                    Message=[...result]         
                
                

                        }
                  }) 
                  
                  
if(data.profile=="patients"){
    conn.query(`SELECT * FROM  patients_basic_info pbi , patients_reg preg   WHERE preg.id =  pbi.P_id  AND pbi.P_id= ? `, [Profile_id], function (error, result) {
        if (error) {
                console.log(error)
        }
        else {
     
             patientdata={...result[0]}
             patientdata.photo="/patientscss/upload_patients"+patientdata.photo
             socket.emit('sendchat', patientdata  ,Message  ); 
        }
     });




}


if(data.profile=="doctor"){


       conn.query(`SELECT * FROM  doctor_basic_info dbi , doctor_contact_info dci  , doctor_education_info dei , doctor_experience_info dexpi , doctor_reg dreg WHERE dbi.D_id = dci.D_id  AND dbi.D_id=dei.D_id AND  dexpi.D_id=dbi.D_id  AND dreg.id=dbi.D_id AND dbi.D_id= ? `, [data.Receiver_id], function (error, result) {
      if (error) {
              console.log(error)
      }
      else {
        console.log(result)
       let patientdata={...result[0]}
        patientdata.photo="/upload_doctor/"+patientdata.photo
        socket.emit('sendchat', patientdata  ,Message ); 

      }
   });


}




        
      
   });

  


   socket.on('message', (message) => {  
    console.log("message" , message)

let insert_message = `INSERT INTO messages (Sender_Id, Receiver_Id, Message, time, date) VALUES ('${message.Sender_id}', '${message.Receiver_id}', '${message.Message}', '${message.time}' , '${message.date}'              )`;
    
    conn.query(insert_message, function (error, result) {
        if (error) {
                console.log(error)
        }
        else {
               console.log("message insered")
        }
});


// 
conn.query(`select  * from  messages  where Sender_Id = ? and Receiver_Id = ?  or Sender_Id = ? AND Receiver_Id=?  `,[message.Sender_id ,message.Receiver_id,message.Receiver_id, message.Sender_id   ], function (error, result) {
    if (error) {
          console.log(error)
    }
    else {

        io.emit('sendmessage', (result)); 



    }
}) 


  //  io.emit('sendmessage', (message)); 
  
});





}); 






const conn = require("../Database/database")
// console.log("connection" , conn)
const index = (req, resp) => {

    const getallDoctor = ` SELECT * FROM doctor_basic_info DBI , doctor_reg DREG ,doctor_contact_info DCI   ,doctor_experience_info DEXPI  WHERE DBI.D_id =DREG.id AND DCI.D_id =DREG.id AND DEXPI.D_id =DREG.id   `
    conn.query(getallDoctor,  function (error, result) {
      if (error) {
              console.log(error)
      }
      else {
      for( let j=0 ; j<result.length ;j++){ 
         // result[j].photo= "/upload_doctor/" + result[j].photo 
         result[j].photo ="/upload_doctor/"+result[j].photo
      }
  
      return resp.render('Patients/patients/public/index' , {result});

      }
   }); 

  

}

const myappointments = (req, resp) => {
   resp.render('Patients/patients/public/myappointments');
}
const login = (req, resp) => {
   let error ={
   
   }

resp.render('Patients/patients/public/login' , {error});
}

const register = (req, resp) => {
   let error ={
      contact : ""
   }

   resp.render('Patients/patients/public/register' , {error});
}




const medicalrecord = (req, resp) => {
   let Patient_Id = parseInt(req.cookies.Patient_Id);
   

   conn.query(`SELECT * from  doctor_basic_info dbi , precription prec where dbi.d_id = prec.D_id AND prec.P_id = ? `, [Patient_Id], function (error, result) {
      if (error) {
              console.log(error)
      }
      else {
         for(let j=0 ;j<result.length;j++){
            result[j].photo="/patientscss/upload_doctor/"+result[j].photo

         }
         
         console.log("result for record" , result)
        return  resp.render('Patients/patients/public/medicalrecord',{result:result});
      }
   });


   
  
}

const chat = (req, resp) => {
   resp.render('Patients/patients/public/chat');
}
const myprofile = (req, resp) => {
   
   let Patient_Id = req.cookies.Patient_Id;
   let patientdata;
   conn.query(`SELECT * FROM  patients_basic_info pbi , patients_reg preg   WHERE preg.id =  pbi.P_id  AND pbi.P_id= ? `, [Patient_Id], function (error, result) {
      if (error) {
              console.log(error)
      }
      else {
           patientdata={...result[0]}
           patientdata.photo="/patientscss/upload_patients"+patientdata.photo
       return  resp.render('Patients/patients/public/myprofile',{patientdata});
      }
   }); 

  
}
const specificdieses = (req, resp) => {
   resp.render('Patients/patients/public/specificdieses');
}

const doctorprofile = (req, resp) => {
     const D_id = req.params.id

     conn.query(`SELECT * FROM  doctor_basic_info dbi , doctor_contact_info dci  , doctor_education_info dei , doctor_experience_info dexpi , doctor_reg dreg WHERE dbi.D_id = dci.D_id  AND dbi.D_id=dei.D_id AND  dexpi.D_id=dbi.D_id  AND dreg.id=dbi.D_id AND dbi.D_id= ? `, [D_id], function (error, result) {
      if (error) {
              console.log(error)
      }
      else {
         result[0].photo ="/upload_doctor/"+result[0].photo
         const  doctordata={...result[0]}
         resp.render('Patients/patients/public/doctorprofile' ,  { doctordata }) ;


      }
   });






   
}
const bookappointment = (req, resp) => {
   resp.render('Patients/patients/public/bookappointment');
}
const editprofile = (req, resp) => {
   let Successs={} 
   return   resp.render('Patients/patients/public/editprofile' , {Successs});
   
  
}




const patientsregister = (req, resp) => {

   const email = req.body.email;
   const password = req.body.password;
   const contact = req.body.contact;

   if(contact.length < 10  ||   contact.length > 10  ){
      let error ={
         contact : " Enter valid contact "
      }

      resp.render('Patients/patients/public/register' , {error});
   }
   else{


      conn.query(`SELECT * FROM  patients_reg  WHERE email = ?`, [email], function (error, result) {
         if (error) {
                 console.log(error)
         }
         else {
                 if (result.length) {
    let error ={
       mail:"Email Already  Exits"
    }
   
              resp.render('Patients/patients/public/register' , {error});
   
                         
                 }
                 else {
                         // if user not available then register 
   
                       
                         conn.query(`INSERT INTO patients_reg set  ?`, req.body, function (error, result) {
                                 if (error) {
                                         console.log(error)
                                 }
                                 else {
                                 return  resp.redirect('/patients/public/login');
                                 }
                         });
                 }
         }
   });
   }
}





const patientslogin = async   (req,resp)=>{

   const email=req.body.email
   const password=req.body.password
   conn.query(`select * from  patients_reg where email = ? and password = ?  `, [email,password], async function (error, result) {
       if (error) {
               console.log(error)
       }
       else {
if(result.length==1){
   resp.cookie(`Patient_Id`,result[0].id);
   return  resp.redirect('/patients/public/index');
}else{
   let error ={
      msg:"Wrong Credentials "
   }

resp.render('Patients/patients/public/login' , {error});
}
       }
}); 
}




const patientseditprofile = async   (req,resp)=>{
  
   const f_name = req.body.f_name
   const l_name = req.body.l_name
   const b_date = req.body.b_date
   const email = req.body.email
   const gender = req.body.gender
   const bgrp = req.body.bgrp
   const address = req.body.address
   let    sampleFile = req.files.sampleFile;
   let fileName = Date.now()+sampleFile.name
   
   let    uploadPath =  'D:/Practo/public/patientscss/upload_patients'+ fileName ;
   

   let Patient_Id = req.cookies.Patient_Id;

   sampleFile.mv(uploadPath, function (err) {
      if (err){
         console.log('File not!' ,err);
          }else{
           // console.log('File uploaded!');


           conn.query(`SELECT * FROM  patients_basic_info  WHERE P_id = ?`, [Patient_Id], function (error, result) {
            if (error) {
                    console.log(error)
            }
            else {
               if(result.length){
                  //means update 
// console.log(" already present we have to update ")


let patients_basic_infosql  = `UPDATE patients_basic_info  SET  f_name =? 	, l_name = ? 	, email =? , b_date = ?  , gender = ? , address = ?  , b_group = ? , photo = ?     where P_id  = ?`;
conn.query(patients_basic_infosql,[f_name, l_name,email, b_date,gender, address, bgrp ,fileName,Patient_Id          ], function (error, result) {
  if (error) {
          console.log(error)
  }
  else {
        //console.log("data updated patients_basic_infosql ")
        let Successs={
         msg:"Profile Updated Successsfully"
      }
      
      return   resp.render('Patients/patients/public/editprofile' , {Successs});
  }
});


               }else{
     //means insert  
     let patients_basic_infosql = `INSERT INTO patients_basic_info (P_id	,f_name	,l_name,	email	,b_date,	gender,address,	b_group	,photo) VALUES ('${Patient_Id}', '${f_name}', '${l_name}', '${email}' , '${b_date}' , '${gender}' , '${address}', '${bgrp}' , '${fileName}'             )`;
     conn.query(patients_basic_infosql, function (error, result) {
       if (error) {
               console.log(error)
       }
       else {
             //console.log("data inserted doctor_basic_infosql ")
             let Successs={
               msg:"Profile Saved Successsfully"
            }
            
            return   resp.render('Patients/patients/public/editprofile' , {Successs});

       }
});





  
               }

            }
         })
          }
  
      });
}


const bookappointmentbypatients = (req,resp)=>{

let Patient_Id = req.cookies.Patient_Id;
let D_id = req.params.id
let Appointment_date = req.body.date
let category = req.body.category
let type = (req.body.video=='') ? "video" :"appointment"
let status="pending"
let Meeting_id=""
let patients_appointment_sql = `INSERT INTO appointment ( P_id,	D_id	,slot	,date	,appointment_type	,status, Meeting_id) VALUES ('${Patient_Id}', '${D_id}', '${category}', '${Appointment_date}' , '${type}' , '${status}'  ,'${Meeting_id}'      )`;

conn.query(patients_appointment_sql, function (error, result) {
  if (error) {
       console.log(error)
  }
  else {
        //console.log("data inserted doctor_basic_infosql ")
        let doctordata={
          msg:"success"
       }
       return  resp.redirect('/patients/public/myappointments');

  }
});
}




 const getallappointment= (req,resp)=>{
   let Patient_Id = req.cookies.Patient_Id;

let  getall_appointment_sql= `SELECT * FROM doctor_basic_info  dbi , doctor_experience_info dexp ,
doctor_contact_info dci ,appointment app where dbi.D_id  = dexp.D_id AND dexp.D_id = app.D_id  AND dci.D_id =dbi.D_id   AND app.P_id= ? `

  conn.query(getall_appointment_sql, [Patient_Id], async function (error, result) {
       if (error) {
               console.log(error)
       }
       else {

         for( let j=0 ; j<result.length ;j++){ 
            result[j].photo ="/upload_doctor/"+result[j].photo
         }
         console.log("appointment"  , result)
         resp.send(result)
       }
});

 }


 const videoappointment =(req,resp)=>{
   return   resp.render('Patients/patients/public/videoappointment');
 }

 const getvideoappointment= (req,resp)=>{
   let Patient_Id = req.cookies.Patient_Id;

let  getall_appointment_sql= `SELECT * FROM doctor_basic_info  dbi , doctor_experience_info dexp ,
doctor_contact_info dci ,appointment app where dbi.D_id  = dexp.D_id AND dexp.D_id = app.D_id  AND dci.D_id =dbi.D_id   AND app.P_id= ? AND app.appointment_type = ?  `

  conn.query(getall_appointment_sql, [Patient_Id, "video" ], async function (error, result) {
       if (error) {
               console.log(error)
       }
       else {

         for( let j=0 ; j<result.length ;j++){ 
            result[j].photo ="/upload_doctor/"+result[j].photo
         }

         resp.send(result)
         
       }
});

 }



 const statusupdate =(req,resp)=>{
   let Patient_Id = req.cookies.Patient_Id;
   let action =  req.body.action
   let D_id =  req.body.id
   let app_id =  req.body.app_id
   console.log("here........",app_id)
   let update_status_sql  = `UPDATE appointment  SET  status = ? where P_id  = ? AND D_id = ?  AND id = ? `;
   conn.query(update_status_sql,[ action ,Patient_Id , D_id ,app_id ], function (error, result) {
     if (error) {
             console.log(error)
     }
     else {
         resp.send({msg:200})
     }
   });

   
   
 }


module.exports = { index, myappointments, medicalrecord, chat, myprofile, specificdieses, doctorprofile, bookappointment , editprofile , login ,register ,patientsregister
, patientslogin , patientseditprofile , bookappointmentbypatients , getallappointment  , statusupdate , getvideoappointment , videoappointment


}


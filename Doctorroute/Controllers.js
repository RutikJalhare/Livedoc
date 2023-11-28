const conn = require("../Database/database")
const bcrypt = require('bcrypt');

const login = (req, resp) => {
   let error ={
      msg:""
   }
    resp.render('Doctor/login' , {error});
 }
 
const index = (req, resp) => {
    resp.render('Doctor/index');
 }

 const patients = (req, resp) => {

   let  D_id=req.cookies.Doctor_ID
   let  getallappointment = `SELECT * FROM  patients_reg  preg ,  patients_basic_info pbi ,appointment app where preg.id = pbi.P_id AND pbi.P_id=app.P_id AND app.D_id= ? AND app.appointment_type= ?  AND app.status = ?  `
   
   
   conn.query(    getallappointment , [D_id ,"video" , "confirmed"], function (error, result) {
      if (error) {
              console.log(error)
      }
      else {
   
         for(let j =0 ; j<result.length ;j++){
            result[j].photo ="/patientscss/upload_patients"+result[j].photo
         }
       //  console.log(" video data" , result)
      return   resp.render('Doctor/patients' , {result});
      }
   });

   // resp.render('Doctor/patients');
 }
 const salaryview = (req, resp) => {
   resp.render('Doctor/salaryview',{data:"hello"} );
}

 const appointments = (req, resp) => {

resp.render('Doctor/appointments' ); 
 }

 const schedule = (req, resp) => {
    resp.render('Doctor/schedule');
 }

 const chat = (req, resp) => {
    resp.render('Doctor/chat');
 }

 const profile = (req, resp) => {

let  D_id=req.cookies.Doctor_ID
// getting result for specific doctore id 

conn.query(`SELECT * FROM  doctor_basic_info dbi , doctor_contact_info dci  , doctor_education_info dei , doctor_experience_info dexpi , doctor_reg dreg WHERE dbi.D_id = dci.D_id  AND dbi.D_id=dei.D_id AND  dexpi.D_id=dbi.D_id  AND dreg.id=dbi.D_id AND dbi.D_id= ? `, [D_id], function (error, result) {
   if (error) {
           console.log(error)
   }
   else {
    
      const  doctordata={...result[0]}
      doctordata.photo="/upload_doctor/"+doctordata.photo
      resp.render('Doctor/profile' ,{doctordata });
   }
});





 }
 const editprofile = (req, resp) => {

   let  D_id=req.cookies.Doctor_ID
   // getting result for specific doctore id 
   
   conn.query(`SELECT * FROM  doctor_basic_info dbi , doctor_contact_info dci  , doctor_education_info dei , doctor_experience_info dexpi , doctor_reg dreg WHERE dbi.D_id = dci.D_id  AND dbi.D_id=dei.D_id AND  dexpi.D_id=dbi.D_id  AND dreg.id=dbi.D_id AND dbi.D_id= ? `, [D_id], function (error, result) {
      if (error) {
              console.log(error)
      }
      else {
       
         const  Successs={...result[0]}
      
          Successs.photo="/upload_doctor/"+Successs.photo
         //Successs.photo= "/upload_doctor/upload_doctor1700024738239100leetcode.png"
       
          return  resp.render('Doctor/edit-profile' , {Successs});
      }
   });


   

 }
 const editschedule = (req, resp) => {
    resp.render('Doctor/edit-schedule');
 }




 const patientprofile = (req, resp) => {
   
   let Application_id = req.params.app_id;
   let Patient_Id = req.params.id;
   let  D_id=req.cookies.Doctor_ID
   let Precriptions =[]
   conn.query(`SELECT * FROM  precription  where  D_id = ?  AND P_id= ? `, [D_id , Patient_Id], function (error, result) {
      if (error) {
              console.log(error)
      }
      else {
         Precriptions=[...result]
   
      }
   }); 








   conn.query(`SELECT * FROM  patients_basic_info pbi , patients_reg preg   WHERE preg.id =  pbi.P_id  AND pbi.P_id= ? `, [Patient_Id], function (error, result) {
      if (error) {
              console.log(error)
      }
      else {
   
           patientdata={...result[0]}
           patientdata.photo="/patientscss/upload_patients"+patientdata.photo
           patientdata.Application_id=Application_id 
           patientdata.Patient_Id=Patient_Id 
           patientdata.Precriptions=Precriptions
           console.log(" result for precription " , Precriptions)
          return  resp.render('Doctor/patient_profile' , {patientdata });
      //  return  resp.render('Patients/patients/public/myprofile',{patientdata});
      }
   }); 
  
 }
 const precription = async (req, resp) => {


 let MainData=[]
   let Main ={}
   let Doctor_Id = req.cookies.Doctor_ID;
 
  await  conn.query(`SELECT * FROM  doctor_basic_info dbi , doctor_contact_info dci   , doctor_reg dreg WHERE dbi.D_id = dci.D_id   AND dreg.id=dbi.D_id AND dbi.D_id= ? `, [Doctor_Id], function (error, result) {
      if (error) {
              console.log(error)
      }
      else {
         result[0].photo ="/upload_doctor/"+result[0].photo
        
         Main.DocName=result[0].f_name +" "+  result[0].l_name
         Main.consultation_fees=result[0].consultation_fees 
         Main.Doctor_address=result[0].address 
         Main.Doctor_state=result[0].state 
         Main.Doctor_ppincode=result[0].pincode 
         MainData=[...MainData ,result[0].f_name +" "+  result[0].l_name , result[0].consultation_fees ,result[0].address ,result[0].state , result[0].pincode  ]


       
      }
   });


   let Application_id=req.params.id
   let Patient_Id=req.params.Patient_Id
   // let  Application_idDetails  = `SELECT * FROM  patients_reg  preg ,  patients_basic_info pbi ,appointment app where preg.id = pbi.P_id AND pbi.P_id=app.P_id AND app.id= ?  `
   let  Application_idDetails  = `SELECT * FROM   patients_basic_info pbi ,appointment app where pbi.P_id=app.P_id AND app.id= ?  `


   await conn.query(    Application_idDetails , [Application_id], function (error, result) {
      if (error) {
              console.log(error)
      }
      else {

         Main.Patient_Name=  result[0].f_name +  result[0].l_name
         Main.Patient_date=  result[0].date
         Main.Patient_address=  result[0].address
         // console.log( "main ", Main)
MainData =[...MainData , Main.Patient_Name ,Main.Patient_date ,  Main.Patient_address , Patient_Id]

         return  resp.render('Doctor/precription' , {MainData });
      }
   });

   

    
   

 }

 const register = (req, resp) => {
   let error ={  
      contact:""
   }
   resp.render('Doctor/register' ,{error}  );
}



const doctorregister = (req, res) => {

   const email = req.body.email;
   const password = req.body.password;
   const contact = req.body.contact;

if(contact.length < 10  ||   contact.length > 10  ){
   let error ={
      contact : " Enter valid contact "
   }
   res.render('Doctor/register' , {error});
}else{

   //enter data into database 



   conn.query(`SELECT * FROM  doctor_reg  WHERE email = ?`, [email], function (error, result) {
      if (error) {
              console.log(error)
      }
      else {
              if (result.length) {
 let error ={
    mail:"Email Already  Exits"
 }

           return     res.render('Doctor/register' , {error});

                      
              }
              else {
                      // if user not available then register 

                    
                      conn.query(`INSERT INTO doctor_reg set  ?`, req.body, function (error, result) {
                              if (error) {
                                      console.log(error)
                              }
                              else {
                                      return  res.redirect('/Doctor/login');
                              }
                      });
              }
      }
});




}
}





const doctorlogin = async   (req,resp)=>{

   const email=req.body.email
   const password=req.body.password


   conn.query(`select * from  doctor_reg where email = ? and password = ?  `, [email,password], async function (error, result) {
       if (error) {
               console.log(error)
       }
       else {
   
if(result.length==1){

   resp.cookie(`Doctor_ID`,result[0].id);



   return  resp.redirect('/Doctor/index');
}else{
   let error ={
      msg:"Wrong Credentials "
   }
   return  resp.render('Doctor/login' , {error});
}
       
     


       }
}); 


}



const doctoreditprofile = (req,resp)=>{

// doctor basic information 
    const f_name = req.body.f_name
    const l_name = req.body.l_name
    const b_date = req.body.b_date
    const email = req.body.email
    const gender = req.body.gender
    const consultation_fees = req.body.consultation_fees
    let    sampleFile = req.files.sampleFile;
    let fileName = Date.now()+sampleFile.name
   
    let    uploadPath =  'D:/Practo/public/patientscss/upload_doctor/'+ fileName ;
    sampleFile.mv(uploadPath, function (err) {
      if (err){
         console.log('File not!' ,err);
          }else{
           console.log('File uploaded!');
          }

         })







    //Contact Informations
    const address = req.body.address
    const state = req.body.state
    const pincode = req.body.pincode

    //Education Informations
    const institute_name = req.body.institute_name
    const edu_profession = req.body.edu_profession
    const degree = req.body.degree

  //Experience Informations
  const about_me = req.body.about_me
  const location = req.body.location
  const exp_profession = req.body.exp_profession
  const period_form = req.body.period_form
  

let Doctor_Id = req.cookies.Doctor_ID;
 
conn.query(`SELECT * FROM  doctor_basic_info  WHERE D_id = ?`, [Doctor_Id], function (error, result) {
   if (error) {
           console.log(error)
   }
   else {
     
      if(result.length){
         // means update the  table 

          // update  in doctor_basic_info
      let doctor_basic_infosql = `UPDATE   doctor_basic_info SET  f_name = ? ,l_name =? ,b_date = ?,	gender = ?,	consultation_fees = ? , photo = ?   where D_id =?`
      conn.query(doctor_basic_infosql,[ f_name,l_name,b_date,gender,consultation_fees , fileName,Doctor_Id], function (error, result) {
        if (error) {
                console.log(error)
        }
        else {
              console.log("data updated doctor_basic_infosql ")
        }
});  



     // updating  in Contact Informations

     let doctor_contact_infosql  = `UPDATE  doctor_contact_info SET address = ? 	,state = ?	,pincode = ?    where D_id  = ?`;
     conn.query(doctor_contact_infosql, [ address,state,pincode,Doctor_Id] ,function (error, result) {
       if (error) {
               console.log(error)
       }
       else {
             console.log("data updated doctor_contact_infosql ")
       }
});



let Educationsql  = `UPDATE  doctor_education_info  SET  institute_name = ? 	,profession	= ?,degree = ?  where D_id  = ?`;
conn.query(Educationsql,[institute_name,edu_profession,degree,Doctor_Id], function (error, result) {
  if (error) {
          console.log(error)
  }
  else {
        console.log("data UPDATED Educationsql ")
  }
});





let doctor_experience_infosql  = `UPDATE   doctor_experience_info  SET  about_me =? 	,profession =? 	,location =? ,period_form =? where D_id  = ?`;
conn.query(doctor_experience_infosql,[about_me, exp_profession,location,period_form, Doctor_Id], function (error, result) {
  if (error) {
          console.log(error)
  }
  else {
        console.log("data updated doctor_experience_infosql ")
  }
});





let Successs={
   msg:"Profile Updated Successsfully"
}

return  resp.render('Doctor/edit-profile' , {Successs});


































      }else{
       // means insert into  the  table 
       // inserting in doctor_basic_info
      let doctor_basic_infosql = `INSERT INTO doctor_basic_info (D_id,	f_name	,l_name	,b_date,	gender,	consultation_fees	,photo) VALUES ('${Doctor_Id}', '${f_name}', '${l_name}', '${b_date}' , '${gender}' , '${consultation_fees}' , '${fileName}'    )`;
       conn.query(doctor_basic_infosql, function (error, result) {
         if (error) {
                 console.log(error)
         }
         else {
               console.log("data inserted doctor_basic_infosql ")
         }
 });



        // inserting in Contact Informations

         let doctor_contact_infosql  = `INSERT INTO doctor_contact_info (D_id	,address	,state	,pincode) VALUES ('${Doctor_Id}', '${address}', '${state}', '${pincode}' )`;
        conn.query(doctor_contact_infosql, function (error, result) {
          if (error) {
                  console.log(error)
          }
          else {
                console.log("data inserted doctor_contact_infosql ")
          }
  });

  // inserting in Education  Informations
  let Educationsql  = `INSERT INTO doctor_education_info (D_id	,institute_name	,profession	,degree	) VALUES ('${Doctor_Id}', '${institute_name}', '${edu_profession}', '${degree}' )`;
  conn.query(Educationsql, function (error, result) {
    if (error) {
            console.log(error)
    }
    else {
          console.log("data inserted Educationsql ")
    }
});

  // inserting in Experience  Informations
  let doctor_experience_infosql  = `INSERT INTO doctor_experience_info (D_id	,about_me	,profession	,location	,period_form	) VALUES ('${Doctor_Id}', '${about_me}', '${location}', '${exp_profession}' ,  '${period_form}')`;
  conn.query(doctor_experience_infosql, req.body, function (error, result) {
    if (error) {
            console.log(error)
    }
    else {
          console.log("data inserted doctor_experience_infosql ")
    }
});

let Successs={
   msg:"Profile Saved Successsfully"
}

return  resp.render('Doctor/edit-profile' , {Successs});
      }
          
   }
});


 
}






 const getallappointments =(req, resp )=>{
      let  D_id=req.cookies.Doctor_ID
let  getallappointment = `SELECT * FROM  patients_reg  preg ,  patients_basic_info pbi ,appointment app where preg.id = pbi.P_id AND pbi.P_id=app.P_id AND app.D_id= ?  `


conn.query(    getallappointment , [D_id], function (error, result) {
   if (error) {
           console.log(error)
   }
   else {

      for(let j =0 ; j<result.length ;j++){
         result[j].photo ="/patientscss/upload_patients"+result[j].photo
      }
      // console.log("docend app" , result)
      resp.send( result);

   }
});


 }

 const { v4: uuidv4 } = require("uuid");

  const statusupdate =(req,resp)=>{
   let id = req.body.id
   let status = req.body.status
   let Meeting_id = "";
   console.log("doc end " , id, status)
   if(status=="confirmed"){
      Meeting_id = uuidv4()
      console.log("Meeting_id = uuidv4()" ,Meeting_id)

   }
   
   let statusupdatesql   = `UPDATE  appointment  SET  status =? , Meeting_id = ?	 where id  = ?`;
   conn.query(statusupdatesql,[status , Meeting_id , id], function (error, result) {
     if (error) {
             console.log(error)
     }
     else {         
   resp.send({msg:200})
     }
   });

   
  }


  var pdf        = require('html-pdf');
  var fs         = require('fs');
  var options    = {format:'A4'};
  var pdf        = require('html-pdf');
const { Console } = require("console");


// D:/Practo/public/upload_pdf/demo.pdf

   const createprecription =(req, resp)=>{
    
  let data =  { 
   Medicines_Name :req.body.Medicines_Name , 
   Quantity_Name   : (req.body.Quantity_Name) ,
   Mornig_time : (req.body.Mornig_time),
 Night_time : (req.body.Night_time),
 Evening_time : (req.body.Evening_time),
 Patient_data : (req.body.Patient_data).split(",")

}
let Patient_id = parseInt(data.Patient_data[data.Patient_data.length-1])
let  D_id=req.cookies.Doctor_ID
resp.render('Doctor/salaryview',{data},function(err,html){

 console.log(" nmae " ,__dirname )
 let  f_name = Date.now()+"demo.pdf"

 let File_name = 'public/upload_pdf/'+f_name
 console.log("file name" , File_name)
   pdf.create(html, options).toFile(File_name, function(err, result) {
       if (err){
           return console.log(err);
       }
        else{
       console.log("result", result);
       var datafile = fs.readFileSync(File_name);
       resp.header('content-type','application/pdf');


       let Precription_sql  = `INSERT INTO precription ( D_id	,P_id	,Precription_name	   ) VALUES ('${D_id}', '${Patient_id}', '${f_name}'    )`;
       conn.query(Precription_sql, function (error, result) {
         if (error) {
                 console.log(error)
         }
         else {
           return  resp.send({msg:200});
         }
 });







       
        }
     });
})







 
   

  }  
     

   


 module.exports = { login , index , patients  , appointments  , schedule     , chat , profile , editprofile    , editschedule   , patientprofile   , precription  ,
   register , doctorregister , doctorlogin , doctoreditprofile , getallappointments , statusupdate , createprecription  , salaryview


}   
 
 
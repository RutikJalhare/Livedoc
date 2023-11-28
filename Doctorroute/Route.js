const {  login , index , patients , appointments  , schedule  , chat , profile , editprofile , editschedule, patientprofile ,
    precription , register ,
    
    
    doctorregister , doctorlogin , doctoreditprofile , getallappointments , statusupdate , createprecription  , salaryview




} = require("./Controllers");

const doctorrouter = require("express").Router();

// get route 
doctorrouter.get("/login", login)
doctorrouter.get("/index", index)
doctorrouter.get("/patients", patients)
doctorrouter.get("/appointments", appointments)
doctorrouter.get("/getallappointments", getallappointments)
doctorrouter.get("/schedule", schedule)
doctorrouter.get("/chat", chat)
doctorrouter.get("/profile", profile)
doctorrouter.get("/edit-profile", editprofile)
doctorrouter.get("/edit-schedule", editschedule)
doctorrouter.get("/patient_profile/:id/:app_id", patientprofile)
doctorrouter.get("/precription/:id/:Patient_Id", precription)
doctorrouter.get("/register", register) 
doctorrouter.get("/salary-view", salaryview) 

// post route
doctorrouter.post("/register", doctorregister)
doctorrouter.post("/login", doctorlogin)
doctorrouter.post("/edit-profile", doctoreditprofile)
doctorrouter.post("/statusupdate", statusupdate)

doctorrouter.post("/precription", createprecription)



module.exports = doctorrouter
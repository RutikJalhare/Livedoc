const { myappointments, index, medicalrecord, chat, myprofile, specificdieses, doctorprofile, bookappointment , editprofile ,
    login  , register  ,

    patientsregister , patientslogin  , patientseditprofile  , bookappointmentbypatients , getallappointment , statusupdate , getvideoappointment

,videoappointment


} = require("./Controllers");

const router = require("express").Router();
router.get("/index", index)
router.get("/login", login)
router.get("/register", register)
router.get("/myappointments", myappointments)
router.get("/medicalrecord", medicalrecord)
router.get("/chat", chat)
router.get("/myprofile", myprofile)
router.get("/specificdieses", specificdieses)
router.get("/doctorprofile/:id", doctorprofile)
router.get("/bookappointment/:id", bookappointment)
router.get("/edit-profile", editprofile)
router.get("/getallappointment", getallappointment)
router.get("/consult", videoappointment)
router.get("/getvideoappointment", getvideoappointment)


//post route 
router.post("/register", patientsregister)
router.post("/login", patientslogin)
router.post("/edit-profile", patientseditprofile)
router.post("/doctorprofile/:id", bookappointmentbypatients)
router.post("/statusupdate", statusupdate)
module.exports = router
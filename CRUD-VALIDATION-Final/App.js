const express = require('express');
const mongoose = require('mongoose');
const port = 8000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
// regex
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForName = RegExp(/^[A-Za-z]/);
const regForImage = RegExp(/.*\.(gif|jpe?g|bmp|png)$/);
// db connection
const db = "mongodb://localhost:27017/mongocrud";
const connect_db = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true });
        console.log("MongoDB Connected.");
    } catch (err) { console.log(err.message); }
}
connect_db();
// schema 
const UserData = require('./db/categorySchema');
// routes
// basic index page
app.get('/', (req, res) => { res.render('index'); });
// display users in table format.
app.get('/showusers', (req, res) => {
    UserData.find({}, (err, data) => {
        if (err) throw err;
        else { res.render('showusers', { users: data }); }
    });
});
// display add user form
app.get('/adduser', (req, res) => { res.render('adduser', { errors: {}, notification: "" }); });
// add user data to db
app.post("/adduser", (req, res) => {
    let uname = req.body.uname;
    let email = req.body.email;
    let image = req.body.image;
    let errors = { uname: "", email: "", image: "", }
    // regex validation
    if (!regForName.test(uname)) { errors.uname = "Enter Valid Name"; }
    if (!regForEmail.test(email)) { errors.email = "Enter Valid Email"; }
    if (!regForImage.test(image)) { errors.image = "Enter Valid Image"; }
    // if no errors send data else send errors.
    if (errors.uname === "" && errors.email === "" && errors.image === "") {
        let insertdata = new UserData({ uname: uname, email: email, image: image });
        insertdata.save((err) => {
            if (err) { res.render('adduser', { errors: errors, notification: "User Already Exist. Please Enter New User" }); }
            else { res.redirect('/showusers'); }
        });
    } else { res.render('adduser', { errors: errors, notification: "Please Enter Valid Data." }); }
});
// delete user
app.get("/deletedata/:id", (req, res) => {
    let id = req.params.id;
    UserData.deleteOne({ _id: id }, (err) => {
        if (err) throw err;
        else { res.redirect('/showusers'); }
    })
});
// render update form
app.get('/updateuser/:id', (req, res) => {
    let id = req.params.id;
    UserData.findOne({ _id: id }, (err, data) => {
        if (err) throw err;
        else { res.render('updateuser', { user: data, errors: {}, notification: "" }); }
    });
});
// update the user data
app.post("/updatedata/:id", (req, res) => {
    let id = req.params.id;
    let uname = req.body.uname;
    let email = req.body.email;
    let image = req.body.image;
    let errors = { uname: "", email: "", image: "", }
    // regex validation
    if (!regForName.test(uname)) { errors.uname = "Enter Valid Name"; }
    if (!regForEmail.test(email)) { errors.email = "Enter Valid Email"; }
    if (!regForImage.test(image)) { errors.image = "Enter Valid Image"; }
    // if no errors send data else send errors.
    if (errors.uname === "" && errors.email === "" && errors.image === "") {
        UserData.updateOne({ _id: id }, { $set: { uname: uname, email: email, image: image } }, (err) => {
            if (err) throw err;
            else { res.redirect('/showusers'); }
        });
    } else {
        UserData.findOne({ _id: id }, (err, data) => {
            if (err) throw err;
            else { res.render('updateuser', { user: data, errors: errors, notification: "Please Enter Valid Data." }); }
        });
    }
});
// host server
app.listen(port, (err) => {
    if (err) throw err;
    console.log(`App listening at http://localhost:${port}`)
});

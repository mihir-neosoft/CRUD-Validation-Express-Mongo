const mongoose = require('mongoose');

const UserData = new mongoose.Schema({
    uname:{
        type:String,
        required:true,
        unique:true
    },
    email:{type:String,required:true},
    image:{type:String,required:true},
    date:{type:Date,default:Date.now}
  });
  module.exports=mongoose.model("category",UserData);
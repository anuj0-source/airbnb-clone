const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    firstName:{
        required:true,
        type:String
    },
    lastName:{
        required:false,
        type:String
    },
    email:{
        required:true,
        type:String,
        unique:true
    },
    password:{
        required:true,
        type:String
    },
    userType:{
        default:'guest',
        type:String
    }
});

const User=mongoose.model("User",userSchema);

module.exports=User;
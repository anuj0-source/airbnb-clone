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
    },
    favourites:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Home",
        default:[]
    },
    listings:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Home"
    },
    profilePic:{
        type:String,
        required:false,
        default:"https://res.cloudinary.com/dcrsi07me/image/upload/v1772456092/avatar_ft4hwd.png"
    }
});

const User=mongoose.model("User",userSchema);

module.exports=User;
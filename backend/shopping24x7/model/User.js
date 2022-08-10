const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        firstName:{
            type: String,
            required:true
        },
        lastName:{
            type: String,
            required:true
        },
        password:{
            type:String,
            required: true
        },
        email:{
            type:String,
            required: true
        },
        role:{
            type:String,
            default: "User"
        },
        address:{
            streetAddress:{
                type:String
            },
            city:{
                type:String
            },
            state:{
                type:String
            },
            zipcode:{
                type:String
            }
        },
        profileImage:{
            imageLocation: String,
            imageURL : String,
        }
    }
)

module.exports = mongoose.model("users", userSchema);
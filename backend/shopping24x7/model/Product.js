const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required:true
                },
        category:{
            type: String,
            required:true
                },
        price:{
            type:Number,
            required: true
                },
        discountPrice:{
            type:Number,
                },
        description:{
            type:String,
            required: true
                },
        image:{
            type:String
                },
        createdOn:{
            type: Date, default: Date.now
                    },
        isTopProduct:{
            type:Boolean
        },
        quantityAvailable:{
            type:Number
        }
    }
)

module.exports = mongoose.model("products", productSchema);
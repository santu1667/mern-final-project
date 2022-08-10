const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
    {
        user:{
                firstName: String,
                lastName :String,
                email:String,
                shippingAddress: String
            },
        orderPlacedOn:{type:Date, default:Date.now},
        isDelivered: {type:Boolean,default:false},
        orderDeliveredOn:{type:Date,default:+new Date() + 3*24*60*60*1000},
        products:[{
            productId:String, 
            quantity:Number
        }]
    })

module.exports = mongoose.model("orders", orderSchema);
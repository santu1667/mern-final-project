const mongoose = require("mongoose");

var mongoDB = "mongodb://127.0.0.1/lms-shopping-cart";

const initiateMongoServer = async () =>{
    try{
        await mongoose.connect(mongoDB,{useNewUrlParser: true, useUnifiedTopology:true});
        console.log("Connected to DB lms-shopping-cart");
    }
    catch(e){
        console.log("**Mongo DB Connection Error**");
        throw e;
    }
    
};

module.exports = initiateMongoServer;


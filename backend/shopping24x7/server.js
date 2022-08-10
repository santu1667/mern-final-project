const express = require("express");
const bodyParser = require("body-parser");
const initiateMongoServer = require("./config/db");
const user = require("./routes/UserController");
const cors = require('cors');
const Product = require("./routes/ProductController");
const Order = require("./routes/OrdersController")

initiateMongoServer();

const app = express();
const port = process.env.port || 8080;

app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

app.get('/', function(req,res){
    res.send(`<h1>Welcome to Shopping24x7 API's</h1>`);
});

app.use('/api/v1',user);

app.use('/api/v1',Product);

app.use('/api/v1',Order);

app.listen(port,function(req,res){
    console.log(`App is Started and listening at port ${port}`)
    });
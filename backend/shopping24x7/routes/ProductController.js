const express= require("express");
const Product = require("../model/Product");
const router = express.Router();
var multer = require('multer');

var Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'D:\\Learning\\learning-mern\\react\\lmsprojects\\shopping24x7\\public\\images\\products')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
var upload = multer({ storage: Storage });

/**
 * @method - POST
 * @param - /admin/products
 * @description - This Method helps in Creating Product 
 */
router.post(
    "/admin/products",
    upload.single("productImage"),
    async (req,res) => {
        const {name,category,price,discountPrice,description,isTopProduct} = req.body;
        var quantityAvailable= 1;
        var imageURL = "";
        if(Object.keys(req).includes("file") && req.file.originalname){
            imageURL = "./images/products/"+req.file.originalname
        }
        if(Object.keys(req.body).includes("quantityAvailable")){
            quantityAvailable = req.body.quantityAvailable;
        }
        try{
            let product = new Product({
                name:name,
                category:category,
                price:price,
                discountPrice:discountPrice,
                description:description,
                isTopProduct:isTopProduct,
                image:imageURL,
                quantityAvailable:quantityAvailable
            });
        await product.save();
        return res.status(200).json({status:"success",message:"Product Created Successfully"})
        }
        catch(e)
        {
            return res.status(500).send({message:"Error in Saving Product"});
        }
    });

/**
 * @method - GET
 * @param - /products
 * @description - This Method helps in returning list of products
 */

router.get(
    "/products",
    async (req,res) => {
        try{
            let products = await Product.find().sort({createdOn:-1}).clone();
            return res.status(200).json({status:"success",products: products})
        }
        catch(exception){
            return res.status(500).send({message:"Error Occured in retreving products"});
        }
    }
)

/**
 * @method - GET
 * @param - /products/:PRODUCT_ID
 * @description - This Method helps in returning product details based on Id
 */
router.get(
    "/products/:PRODUCT_ID",
    async (req,res) => {
        const productId = req.params.PRODUCT_ID;
        try{
            await Product.findOne({_id:productId},function(err,product){
                if(err){return res.status(500).json({status:"error",
                        message:"Error Occured in retreving product details"})}
                    if(product){
                    return res.status(200).json({"status":"success",product:product})}
                    else{return res.status(404).json({"message":"Product Not Found"})}
            }).clone();
        }
        catch(exception){
            return res.status(500).json({message:"Error Occured in retreving product details"});
        }
    }
)

/**
 * @method - GET
 * @param - /homepage/banner
 * @description - This Method helps in returning last 3 added product details
 */
router.get(
    "/homepage/banner",
    async (req,res) => {
        try{
            let products = await Product.find({},{image:1,name:1,_id:0})
                    .sort({createdOn:-1}).limit(3);
            if(products){
                return res.status(200).json({"status":"success",product:products});
            }
        }
        catch(exception){
            return res.status(500).json({message:"Error Occured in retreving banner products"});
        }
    }
)

/**
 * @method - GET
 * @param - /homepage/banner
 * @description - This Method helps in returning last 3 added product details
 */
router.get(
    "/homepage/categories",
    async (req,res) => {
        try{
            let categoryList = await Product.find().distinct("category").clone();
            if(categoryList.length>0){
                var randomCategories = [...categoryList].sort(() => 0.5 - Math.random())
                randomCategories = randomCategories.slice(0,3);
                return res.status(200).json({status:"success",
                categories:randomCategories});
            }
                return res.status(404).json({status:"success",
                message:"No Categories Found"});
            }
        catch(exception){
            return res.status(500).json({message:"Error Occured in retreving banner products"});
        }
    }
)

/**
 * @method - GET
 * @param - /department/categories
 * @description - This Method helps in returning last 3 added product details
 */
 router.get(
    "/department/categories",
    async (req,res) => {
        try{
            let categoryList = await Product.find().distinct("category").clone();
            return res.status(200).json({status:"success",
                categories:categoryList});
            }
        catch(exception){
            return res.status(500).json({message:"Error Occured in retreving department categories"});
        }
    }
)

/**
 * @method - GET
 * @param - /homepage/banner
 * @description - This Method helps in returning last 3 added product details
 */
router.get(
    "/homepage/products",
    async (req,res) => {
        try{
            let productList = await Product.aggregate().sample(8);
            if(productList.length>0){
                return res.status(200).json({status:"success",
                products:productList});
            }
                return res.status(404).json({status:"success",
                message:"No Categories Found"});
            }
        catch(exception){
            return res.status(500).json({message:"Error Occured in retreving banner products"});
        }
    }
)

/**
 * @method - DELETE
 * @param - /v1/product
 * @description - This Method helps in deleting the product based on Id
 */
router.delete(
    "/admin/products/:id",
    async (req,res) => {
        const productId = req.params.id;
        try{
            await Product.deleteOne({_id:productId},function(err,result){
                if(err){return res.status(500).json({status:"error",
                    message:"Error Occured in deleting products"})}
                    return res.status(200).json({status:"success",
                                        message:"Product deleted successfully"})
            }).clone();
        }
        catch(exception){
            return res.status(500).send({message:"Error Occured in deleting products"});
        }
    }
)

/**
 * @method - PATCH
 * @param - /v1/product
 * @description - This Method helps in deleting the product based on Id
 */
router.patch(
    "/admin/products/:id",
    async (req,res) => {
        const data={};
        const productId = req.params.id;
        function addData(key,input)
        {
            if(typeof input === 'boolean' || typeof input ==='string' || typeof input ==='number'){
                data[key]= input;
            }
        }
        if(Object.keys(req.body).includes("product")){
            const {name,category,price,discountPrice,description,quantityAvailable,isTopProduct} =
            req.body.product;
            addData("name",name);addData("category",category);addData("price",price);
            addData("description",description);addData("quantityAvailable",quantityAvailable);
            addData("isTopProduct",isTopProduct);addData("discountPrice",discountPrice)
        }
        else{
            return res.status(404).send({message:"Mandatory details not passed"}); 
        }
        try{
            await Product.updateOne({_id:productId},data,function(err,result){
                if(err){return res.status(500).json({status:"error",
                    message:"Error Occured in Updating product details"})}
                    return res.status(200).json({status:"success",
                                        message:"Product edited successfully"})
            }).clone();
        }
        catch(exception){
            return res.status(500).send({message:"Error Occured in Updating product details"});
        }
    }
)

module.exports=router;
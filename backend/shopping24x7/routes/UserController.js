const express= require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt =  require("jsonwebtoken");
const User = require("../model/User");
const router = express.Router();
const file_store_base_location ="D:\\Learning\\learning-mern\\react\\lmsprojects\\shopping24x7\\public\\images\\profile\\";
const fs = require('fs');
var multer = require('multer');

var Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'D:\\Learning\\learning-mern\\react\\lmsprojects\\shopping24x7\\public\\images\\profile')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
var upload = multer({ storage: Storage });

/**
 * @method - POST
 * @param - /users/register
 * @description - This Method helps in Creating User If user already exists with input username
 *                Error Message will be sent
 */
router.post(
    "/users/register",
    [
        check("firstName","First Name cannot be Empty").not().isEmpty(),
        check("lastName","Last Name cannot be Empty").not().isEmpty(),
        check("password","Password cannot be Empty").not().isEmpty(),
        check("password","Password Must contain minimum 6 chracters").isLength({min:6}),
    ],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
            }
            const { firstName,lastName,password,email } = req.body;

            try{
                
                let user = await User.findOne({
                    email:email
                });
                if(user){
                    return res.status(200).json({message:" User Already Exists."});
                }
                user = new User({
                    firstName,
                    lastName,
                    password,
                    email,
                    profileImage:{
                        imageLocation:null,
                        imageURL:null
                    }
                });

                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password,salt);

                await user.save();

                const payload ={
                    user:{
                        id:user.id
                    }
                }
                jwt.sign(
                    payload,
                    "randomString",{
                        expiresIn:10000
                    },
                    function(err,token){
                        if (err) throw err;
                        res.status(200).json({status:"success",
                            message: "User Created Successfully"
                        })
                    })

            }
            catch(e)
            {
                res.status(500).send({message:"Error in Saving User"});
            }
    });

/**
 * @method - POST
 * @param - /users/login
 * @description - This Method helps in Verifying User and allows user to login
 */
router.post("/users/login",
[
    check("username","Email cannot be Empty").not().isEmpty(),
    check("password","Password cannot be Empty").not().isEmpty(),
    check("password","Password Must contain minimum 6 chracters").isLength({min:6})
],
async (req,res) =>{
const { username, password } = req.body;
//validating inout request
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({
errors: errors.array(),
});
}

try{
let user = await User.findOne({
email:username
},{profile:0});
if (!user)
return res.status(400).json({
    message: "User does not exist! Please register."
});

const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
    return res.status(400).json({
    message: "Incorrect Password!",
    });
}

const payload ={
    user:{
        id:user.id
    }
}

jwt.sign(
    payload,
    "randomString",{
        expiresIn:'30m'
    },
    function(err,token){
        if (err) throw err;
        res.status(200).json({status:"success",
            message:"user logged in successfully",
            accesstoken:token
        })
    })
}
catch(exception){
    res.status(500).json({message:"Error Occured! Please try again"});
}

}
)

/**
 * @method - GET
 * @param - /profile
 * @description - This Method helps in Verifying User and allows user to login
 */
router.get('/profile', function(req, res) {
    var token = req.headers['token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    const decoded = jwt.verify(token, "randomString");
    User.findById(decoded.user.id,{password:0,_id:0,__v:0}, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).json({status:"success",
                profile:user});
    });
    });

    
/**
 * @method - PATCH
 * @param - /profile/address
 * @description - This Method helps in Verifying User and allows user to login
 */
router.patch('/profile/address', 
        [
            check("streetAddress","StreetAddress cannot be Empty").not().isEmpty(),
            check("city","City cannot be Empty").not().isEmpty(),
            check("zipcode","Zip Code cannot be Empty").not().isEmpty(),
            check("state","Zip Code cannot be Empty").not().isEmpty(),
        ],
        async (req,res) => {
            const errors = validationResult(req.body.profile.address);
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array()
                })
            }
            const { streetAddress,city,zipcode,state } = req.body.profile.address;
            const email = req.body.profile.email;
            var address = {
                address:{
                    streetAddress: streetAddress,
                    city:city,
                    zipcode:zipcode,
                    state:state
                }}
            await User.updateOne({email :email},address,
                (err, result)=>{
                    if(err) { 
                return  res.status(500).json({message:"Error Occured! Please try again"})}
                    return res.status(200).json({status:"success",
                                message:"Profile Updated Successfully"}); 
                    }).clone()
                    .catch(err=>{return res.status(500).json(
                        {message:"Error Occured While updating Address"}
                    ) });
        });


/**
 * @method - PATCH
 * @param - /profile/image
 * @description - This Method helps in updating profile Image
 */
router.patch("/profile/image",
    upload.single("profileImage"), 
    async (req, res) => {
        if(!req.body.email || !req.file || !req.file.originalname){
            return res.status(400).json({status:"Mandatory Inputs are missing"})
        }
        const email = req.body.email;
        let oldFileLocation = null;
        let newImageLocation = file_store_base_location+req.file.originalname;
        const newimageURL = "./images/profile/"+req.file.originalname;
        const saveImage = {
            profileImage: {
                imageLocation: newImageLocation,
                imageURL: newimageURL,
            }
        };
        try{
            let user = await User.findOne({email:email})
            if(user){
            oldFileLocation = Object.keys(user).includes("profileImage") ? 
                        user.profileImage.imageLocation : null;
            await User.updateOne({email:email},saveImage, (err, result)=>{
                    if(err) { 
                        return res.status(500).json({status:"failure",
                        message:"Error Occured while updating Profile Image"});}
                    else{
                        if(oldFileLocation){
                            fs.unlink(oldFileLocation, (err)=>{
                            });
                        }
                        return res.status(200).json({status:"success",
                                message:"Profile Image Updated Successfully"}); 
                    }}).clone();
                }
            }
        catch(err) {
        }
    });

/**
 * @method - DELETE
 * @param - /profile/image
 * @description - This Method helps in updating profile Image
 */
router.delete('/profile/image',
        async (req,res) =>{
        const email = req.body.email;
        let user = await User.findOne({
                email:email
                });
                const saveImage = {
                    profileImage: {
                        imageLocation: null,
                        imageURL: null,
                    }
                };
        if (user){
            var oldFileLocation = user.profileImage ? user.profileImage.imageLocation : null;
            await User.updateOne({email:email},saveImage,
                (err,result)=>{
                    if(err){;throw err;}
                    else{
                        if(oldFileLocation){
                            fs.unlink(oldFileLocation, (err)=>{
                            });
                        }
                    res.status(200).json({status:"success",
                        message:"Profile Image deleted Successfully"});
                }
            }).clone();
        }                
    })


module.exports=router;
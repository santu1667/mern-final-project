import '../css/RegisterPage.css';
import { useRef, useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {
const description=   "Shop24x7 is online store which allows users to Create online orders." 
                    +"We had few stores available in person in TX. Customers who register "
                    +"can earn additional points and use them towards purchase. Happy Shopping!!";
const errRef = useRef();    
const successRef = useRef();
const firstNameRef = useRef();    
const lastNameRef = useRef();
const emailRef = useRef();    
const passwordRef = useRef();
const consfirmPasswordRef = useRef();    
const [firstName, setFirstName] = useState(null);
const [lastName, setLastName] = useState(null);
const [email, setEmail] = useState(null);
const [password, setPassword] = useState(null);
const [confirmPassword, setConfirmPassword] = useState(null);
const [errMsg, setErrMsg] = useState(null);
const [passwordShown, setPasswordShown] = useState(false);
const [successMessage, setSuccessMsg] =useState('');
                
// Clear Error Message after updating user, pwd
useEffect(() => {
    setErrMsg('');
}, [firstName,lastName,password,email,confirmPassword])

const registerUser= async ()=>{
    if(validateRegisterUserInput()){
    let req={firstName:firstName, lastName:lastName,password:password,email:email};
        await axios.post('http://localhost:8080/api/v1/users/register', 
                req)
                .then(response =>{
                    setSuccessMsg(response.data.message);
                    clearInputFeilds();
                })
                .catch(err => {
                    setErrMsg(err)})}
}

function clearInputFeilds(){
    firstNameRef.current.value='';lastNameRef.current.value=''
    passwordRef.current.value='';emailRef.current.value='';
    consfirmPasswordRef.current.value='';
    setFirstName('');setLastName('');setConfirmPassword('');setPassword('');setEmail('');
}

function validateRegisterUserInput(){
if(!firstName){ setErrMsg("Please enter First Name"); return false;    }
if(!lastName){setErrMsg("Please enter Last Name");  return false;    }
if(!email){setErrMsg("Please enter email"); return false;    }
if(!password){setErrMsg("Please enter Password"); return false;}  
if(password.toString().length<8){setErrMsg("Password Should be minimum 8 chars"); return false;}
if(!confirmPassword){setErrMsg('Please enter Confirm Password'); return false;}
if(password !== confirmPassword){setErrMsg('Password and Confirm Password not macthed'); return false;}
return true;}

  // To display password on click on eye(show password)
function showPassword(){
    setPasswordShown(!passwordShown);}


    
return (
    <div className="registerContainer">
    <p className="websiteDescription"><b style={{color:'green'}}>Welcome to Shop 24x7</b> {<br/>} 
    {description}</p>
    <section>
    <div>
    {errMsg && <p ref={errRef} className="registerErrMsg">{errMsg}</p>}
    {successMessage && <p ref={successRef} className="registerSuccessMsg"
    >{successMessage} Please <Link to="/login">Login</Link></p>}
    <form className="signupForm" onClick={(event)=>event.preventDefault()}>
        <h5>Create Account</h5>
        <label htmlFor="register-first-name">FirstName:</label>
        <input  type="text" ref={firstNameRef} id="register-first-name" autoComplete="off" 
        onChange={(e) => setFirstName(e.target.value)}/>

        <label htmlFor="register-last-name">LastName:</label>
        <input type="text" ref={lastNameRef} id="register-last-name" 
        onChange={(e) => setLastName(e.target.value)} required/>

        <label htmlFor="register-email">Email:</label>
        <input type="text" ref={emailRef} id="register-email" 
        onChange={(e) => setEmail(e.target.value)} required/>

        <label htmlFor="register-password">Password:</label>
        <input type={passwordShown ? "text" : "password"} ref={passwordRef} id="register-password" 
        onChange={(e) => setPassword(e.target.value)} required/>
        <i className="far fa-eye toggle-eye" id="togglePassword" onClick={showPassword} ></i>

        <label htmlFor="register-confirm-password">Confirm Password:</label>
        <input type={passwordShown ? "text" : "password"} ref={consfirmPasswordRef} id="register-confirm-password" onChange={(e) =>{setConfirmPassword(e.target.value)}} required/>
        <i className="far fa-eye toggle-eye" id="togglePassword" onClick={showPassword} ></i>

        <button className="registerButton" id="register-submit" onClick={registerUser}>Register</button>
    </form>
    </div> 
    </section>
    </div>
);
}

export default Register;

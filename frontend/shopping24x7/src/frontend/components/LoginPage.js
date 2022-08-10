import '../css/LoginPage.css';
import { useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function LoginPage(props) {
  const description=   "Shop24x7 is online store which allows users to Create online orders." 
                      +"We had few stores available in person in TX. Customers who register "
                      +"can earn additional points and use them towards purchase. Happy Shopping!!";
  const [user, setUser] = useState(null);
  const [pwd, setPwd] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const [passwordShown, setPasswordShown] = useState(false);
  let navigate = useNavigate();
                  
 //Calling API After Input Validations
  const  loginUser =async () =>{
    if(validateInput()){
    let req={username:user,password:pwd};
    if(errMsg == null || errMsg === ''){
        try{
        var response =await axios.post('http://localhost:8080/api/v1/users/login', 
                req)
        }
        catch(exception)
        {
          if(exception.response.status === 400){
            setErrMsg(exception.response.data.message)}
        }
      if(response.status===200) { 
          sessionStorage.setItem("auth-token",response.data.accesstoken)
          props.setHomeURL('/');
          navigate('/Profile');
        }
      }
    }
  }

  
  /*
   * Validate Input  - Check for Null Values
   * Password should be minimum 8 chars
   */
  function validateInput(){
    if(!user){ setErrMsg("Please enter User Name");  return false;  }
    if(!pwd){ setErrMsg("Please enter Password");       return false;  }
    if(pwd.length<8){setErrMsg("Password Should be minimum 8 chars"); return false;}
    return true;
  }
  

  // To display password on click on eye(show password)
  function showPassword(){
    setPasswordShown(!passwordShown);
  }
  
// Clear Error Message after updating user, pwd
  useEffect(() => {
    setErrMsg('');
}, [user, pwd])
    
  // UI Form 
  return (
    <div className="loginContainer">

      <p className="websiteDescription"><b style={{color:'green'}}>Welcome to Shop 24x7</b> {<br/>} 
      {description}</p>

      <section>

      <div>
      <p className={errMsg ? "errmsg" : ""}>{errMsg}</p>
      <form className="signInForm" onClick={(event)=>event.preventDefault()}>
        <h2>Login</h2>
        <label htmlFor="login-email">Username:</label>
        <input  type="text" id="login-email" autoComplete="off" 
          onChange={(e) => setUser(e.target.value)} required/>
        <label htmlFor="login-password">Password:</label>
        <input type={passwordShown ? "text" : "password"} id="login-password" 
        onChange={(e) => setPwd(e.target.value)} required/>
        <i className="far fa-eye toggle-eye" id="togglePassword" onClick={showPassword} ></i>
        <button className='signInFormButton' id="login-submit"
        onClick={loginUser}>Sign In</button>
      </form> 
        <span className="needAccountSpan">Need an Account? <Link to="/register">Register</Link>
        </span>
      </div>
      </section>
    </div>
  );
}

export default LoginPage;

import '../css/App.css';
import { Link } from "react-router-dom"
import { useEffect } from 'react';

function Logout(props) {

  useEffect(()=>{
    sessionStorage.clear();
    props.setHomeURL('/login');
    props.setIsAdmin(false);
    props.setIsUserLoggedIn(false);
    props.setSelectedProduct('');
    props.setOrderMessage('');
  })
  
  return (
      <div className='App'>
        <p> You have been logged out. <Link to="/login">Login</Link> again</p>
        
      </div>
  );
}

export default Logout;
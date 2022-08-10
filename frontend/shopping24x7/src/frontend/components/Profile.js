import '../css/Profile.css';
import 'bootstrap/dist/css/bootstrap.css';
import {Container,Row,Col} from 'react-bootstrap';
import { useEffect, useState, useRef} from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

function Profile(props) {
  const [isAddressDisplayable, setIsAddressDisplayable] = useState(true);
  const [isUserLogged,setUserLogged] = useState('');
  const [streetAddress, setStreetAddr] =useState('No Address');
  const [zipcode, setZipCode] = useState('');
  const [state,setState] = useState('');
  const [city,setCity] =useState('');
  const [user, setUser] = useState('');
  const [errMsg, setErrMsg] = useState(null);
  const errRef = useRef();
  const hiddenFileInput = useRef(null);
  const [imageSrc,setImageSrc] = useState('./images/profile/avatar.jpeg');

  async function onImageChange(event){
    if(event.target.files[0]){
      try{
        var formData = new FormData();
        formData.append('email',user.email);
        formData.append('profileImage',event.target.files[0]);
        var response =  await axios.patch('http://localhost:8080/api/v1/profile/image'
            , formData);
          if(response.status === 200){
            var createupdatedURL = URL.createObjectURL(event.target.files[0]);
            setImageSrc(createupdatedURL);
          }
      }
      catch(exception){}
  }
  }

  function displayAddressForm(){
    setErrMsg('');
    setIsAddressDisplayable(!isAddressDisplayable);
  }

  const saveAddressDetails = async ()=>{
    setErrMsg('');
    if(validateRequest("Address")){
    try{
        var req= {
          profile:
          {email:user.email,
          address: {streetAddress:streetAddress,city:city,zipcode:zipcode,state:state}
          }};
        var response =  await axios.patch('http://localhost:8080/api/v1/profile/address', 
                  req);
        if(response.status === 200){
          setIsAddressDisplayable(!isAddressDisplayable);
          var address = streetAddress +', '+city+', '+state+', '+zipcode;
          user.address = address;
          setUser(user); setErrMsg('');setStreetAddr('');setState('');setZipCode('')
        }
      }
      catch(exception){
        return;
      }   
    }
  }

  function validateRequest(input){
    if(input === 'Address'){
      if(!streetAddress || !city  || !zipcode || !state){
          setErrMsg('Address Feilds cannot be empty');
          return false;
      }
      return true;
  }
}

  useEffect( () => {
    setErrMsg('');
    var token = sessionStorage.getItem("auth-token");
    if(token != null && token !== ''){
      setUserLogged(true);
      getUserDetails(token);
    }
    else{
      setUserLogged(false);
    }
  },[]);

  const handleClick = () => {
    if(window.confirm('Do you want to Upload Profile Pic?')){
      hiddenFileInput.current.click();
    }
  };

  const handleDelete = async () => {
    if(window.confirm('Do you want to delete Profile Pic?')){
      try{
      var request = {email:user.email}
      var response =  await axios.delete('http://localhost:8080/api/v1/profile/image',
      {data:request});
      if(response.status === 200){
        setImageSrc('./images/profile/avatar.jpeg');
      }
    }
      catch(exception){
        return;
      }
    }
  };

  async function getUserDetails(token){
    await axios.get('http://localhost:8080/api/v1/profile',
          {headers: {
            'token': token,
            'Content-Type': 'application/json'
          }}).then(response=>{
            var profile = response.data.profile;
          setUser({
            firstName : profile.firstName,
            lastName : profile.lastName,
            email : profile.email,
            role : profile.role,
            imageURL : profile.profileImage.imageURL?
                      profile.profileImage.imageURL:'./images/profile/avatar.jpeg',
            phoneNumber : profile.phoneNumber ? profile.PhoneNumber:"No Record",
            address : profile.address ? profile.address.streetAddress+', '
                                + profile.address.city+', '
                                + profile.address.state+', '
                                + profile.address.zipcode :"No Address Available",
          })
          setImageSrc(profile.profileImage.imageURL?
            profile.profileImage.imageURL:'./images/profile/avatar.jpeg');
            if(profile.role === 'Admin'){
              props.setIsAdmin(true);
            }
          props.setIsUserLoggedIn(true);
          sessionStorage.setItem("role",profile.role);
          sessionStorage.setItem("user",JSON.stringify(profile));
          }).catch(err=>{
            setErrMsg("Error Occured While retreiving Profile");
          })
  }

  return (
    <>
    {isUserLogged &&
      <div className="profileContainer">
        <p ref={errRef} className={errMsg ? "errorMessage" : ""}>{errMsg}</p>
        <Container>
          <Row>
            <Col xs={3}>
              <img id="profile-image" src={imageSrc} alt="" /><br/>
              <div className="imageButtons">
              <button className="btn btn-warning" id="“profile-delete-button" onClick={(event)=>{event.preventDefault();handleDelete()}}> Delete Image</button>
              <button className="btn btn-primary" id="profile-upload-button" onClick={(event)=>{event.preventDefault();handleClick()}}> Upload</button>
              </div>
              <input type="file"  ref={hiddenFileInput} multiple accept="image/*" 
                style={{display: 'none'}} onChange={onImageChange} />
            </Col>
            <Col className="nameDetails">
              <Row>
                <Col xs={3}>
                  <label htmlFor='profile-first-name'>First Name</label><br/>
                  <span  id="profile-first-name" >{user.firstName}</span>
                </Col>
                <Col xs={6}>
                <label htmlFor='profile-last-name'>Last Name</label><br/>
                  <span id="profile-last-name">{user.lastName}</span>
                </Col>
              </Row>
              <Row>
                <Col xs={3}>
                <label htmlFor='profile-email-name'>Email</label><br/>
                  <span id="profile-email-name">{user.email}</span>
                </Col>
                { !isAddressDisplayable &&
                  <Col xs={3}>
                  <label>Phone</label><br/>
                  <span>{user.phoneNumber}</span>
                  </Col> 
                }
                { !isAddressDisplayable &&
                    <Col xs={6}>
                    <label>Interests</label><br/>
                      <span>Apple, Samsung, Laptops</span>
                    </Col>
                }
              </Row>
              { isAddressDisplayable &&
              <Row>
                <Col xs={6}>
                <label>Phone</label><br/>
                  <span>{user.phoneNumber}</span>
                </Col>
              </Row> }
              { isAddressDisplayable &&
              <Row>
                <Col xs={6}>
                    <label>Interests</label><br/>
                      <span>Apple, Samsung, Laptops</span>
                    </Col>
              </Row> }
              {isAddressDisplayable &&
              <Row>
                <Col xs={7}>
                <label>Address</label><br/>
                  <span>{ user.address}</span>
                </Col>
                <Col xs={3}>
                <button type="button" id="address-edit-button"
                className="btn btn-primary" onClick={displayAddressForm}> Edit</button>
                </Col>
              </Row>}
              {!isAddressDisplayable &&
              <Row>
                <form className="updateAddressForm" onClick={(event)=>event.preventDefault()}>
                <Row></Row>
                <Row>
                <Col><span>Update Address</span></Col>
                <Col></Col>
                </Row>
                <Row>
                <Col xs={2}><label>Street Address</label></Col>
                <Col xs={7}><input type="text" className="form-control"
                    onChange={(e)=>setStreetAddr(e.target.value)}></input></Col>
                </Row>
                <Row>
                <Col xs={2}><label>City</label></Col>
                <Col xs={7}><input type="text" className="form-control"
                  onChange={(e)=>setCity(e.target.value)}></input></Col>
                </Row>
                <Row>
                <Col xs={2}><label>State</label></Col>
                <Col xs={7}><input type="text" className="form-control"
                  onChange={(e)=>setState(e.target.value)}></input></Col>
                </Row>
                <Row>
                <Col xs={2}><label>Zip</label></Col>
                <Col xs={7}><input type="text" className="form-control"
                  onChange={(e)=>setZipCode(e.target.value)}></input></Col>
                
                
                </Row>
                <Row className="imageButtons">
                <Col><button type="button" className="btn btn-primary" 
                onClick={saveAddressDetails}>   Save</button>
                <button type="button" className="btn btn-primary" 
                onClick={displayAddressForm}> Cancel</button></Col>
                </Row>
                </form>
              </Row>}
            </Col>
          </Row>
        </Container>
        </div>
        }

        {!isUserLogged && 
          <div className="profileLogin">
            <p ref={errRef} className={errMsg ? "errmsg" : ""}>{errMsg}</p>
            <p> Please <Link to="/login">Login</Link> to view Your Profile</p>
          </div>
        }
        </>
)}

export default Profile;
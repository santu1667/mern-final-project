import '../../css/Department.css';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

function Department() {

  const navigate = useNavigate();
  const [categoryList,setCategoryList] = useState([]);

  useEffect(()=>{
    retreiveDepartments();
  },[])

  async function retreiveDepartments(){
    await axios.get('http://localhost:8080/api/v1/department/categories')
    .then(response => setCategoryList(response.data.categories))
    .catch(error =>{})
  }

  function getCategoryImage(category){
    switch(category){
    case "Mobiles": 
        return "./images/categories/Mobiles.jpg";
    case "Video Games": 
        return "./images/categories/Video Games.png";
    case "Toys": 
        return "./images/categories/Toys.jpg";
    default :
        return "./images/categories/NI-Placeholder.png";
    }
}
  function navigateToURL(categoryName){
    const path = '/Categories?categoryName='+categoryName;
    navigate(path);
  }

  return (
    <>
    <h5 className="departmentHeading"> Click on Department to browse Products</h5>
    <div className="departmentContainer">
    {categoryList && categoryList.map((item) => (
        <div key={item.id} className='departmentItem'>
        <img key={Math.random()} src={getCategoryImage(item)} alt=""
                onClick={(event)=>
                    {event.preventDefault();navigateToURL(item)} }></img>
        <p key={Math.random()}> {item}</p>
      </div>
      )
      )}
  </div></>
  );
}

export default Department;
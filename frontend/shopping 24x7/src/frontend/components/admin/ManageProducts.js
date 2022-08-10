import '../../css/ManageProducts.css';
import axios from 'axios';
import {useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';

function ManageProducts(props) {

  const [productsList,setProductsList] = useState([]);
  const [errMsg, setErrMsg] = useState('')
  const [successMsg,setSuccessMsg] = useState('');
  const navigate = useNavigate();

  useEffect(()=>{
    retreiveProducts();
  },[])

  function navigateToAddProduct(){
    navigate('/admin/add-new-product')
  }

  const retreiveProducts = async ()=>{
    await axios.get('http://localhost:8080/api/v1/products')
    .then(response =>{
        setProductsList(response.data.products)})
    .catch(error => setErrMsg("Error Occured while retreving Prodcuts"))
  }

  function editProduct(inputProduct){
    props.setSelectedProduct(inputProduct);
    var path = '/admin/products/'+inputProduct._id+'/edit';
    navigate(path);
  }

  async function deleteProduct(inputproduct){
    setErrMsg('');
    setSuccessMsg('');
    var apiURL = 'http://localhost:8080/api/v1/admin/products/'+inputproduct._id
    await axios.delete(apiURL)
    .then(response =>{
        if(response.status===200){
          setSuccessMsg('Product '+inputproduct.name+' is deleted Successfully')
          var newList=[];
          for(let index in productsList){
            if(productsList[index]._id !==inputproduct._id){
              newList.push(productsList[index])} }}
              setProductsList(newList);
    }).catch(error => setErrMsg('Error Occured while deleting the Product'))
  }

return (
  <>
  {successMsg &&  <p className='manageProductSuccessMessage'>{successMsg}</p>}
  {errMsg &&  <p className='manageProductErrorMsg'>{errMsg}</p>}
  
<div className='manageProductsContainer'>
<div className='headingContainer'>
<h4> Manage Products</h4>
<button className="btn btn-primary" onClick={navigateToAddProduct}> Add New Product</button>
</div>
{productsList && productsList.map((product) => (
      <div key={Math.random()}className="manageProductItems">
        <div key={Math.random()} className="manageProductDescription">
          <span key={Math.random()}> {product.quantityAvailable}X {product.name}</span>
          <label key={Math.random()}>Price ${product.price}</label>
          <label key={Math.random()}>Discount ${product.discountPrice}</label>
        </div >
            <p  key={Math.random()} className="editText" onClick={(event)=>
              {event.preventDefault();editProduct(product)}}>edit </p> |
            <p  key={Math.random()} className="removeText" onClick={(event)=>
              {event.preventDefault();deleteProduct(product)}}>delete</p>
        </div>
      ))}
</div>
</>
  );
}

export default ManageProducts;
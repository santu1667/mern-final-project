import '../../css/EditProduct.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function EditProduct(props) {
const [productName,setProductName] = useState('');
const [productDescription, setProductDescription] = useState('');
const [category, setCategory] = useState('');
const [price,setPrice] = useState(0);
const [discountPrice,setDiscountPrice] = useState(0);
const [isTopProduct,setIsTopProduct] = useState(false);
const [errMsg,setErrMsg] = useState('');
const navigate= useNavigate();

useState(()=>{
    setIsTopProduct(props.selectedProduct.isTopProduct);
    setProductName(props.selectedProduct.name);
    setCategory(props.selectedProduct.category);
    setDiscountPrice(props.selectedProduct.discountPrice);
    setPrice(props.selectedProduct.price);
    setProductDescription(props.selectedProduct.description);
})

useEffect(()=>{
    setErrMsg('');
},[price,productDescription,discountPrice,category,productName])

async function updateProduct(){
if(validateInput()){
    var request = {product:{name:productName,category:category,price:price,discountPrice:discountPrice,
    description:productDescription,isTopProduct:isTopProduct}}
    var apiURL ='http://localhost:8080/api/v1/admin/products/'+props.selectedProduct._id;
    axios.patch(apiURL,request)
    .then(response => {
        if(response.status===200){
            navigate('/admin/products');
        }
    }
    ).catch(err=>{
        setErrMsg('Error Occured While Saving the Product')})
}
}
function validateInput(){
    if(!productName || !productDescription || !category){
        setErrMsg('Mandatory Input Feilds are Missing');
        return false;
    }
    if(!price || isNaN(price) || !discountPrice || isNaN(discountPrice)){
        setErrMsg('Price and Discount Price should be numeric');
        return false;
    }
    return true;
}

return (
    <>
        {errMsg &&  <p className='editProductErrorMessage'>{errMsg}</p>}
    <div className="editProductContainer">
        <div className='productDetailsContainer'>
        <h5><b> Edit Product</b></h5>
            <div className="product-item">
                <label>Product Name</label>
                <input type="text" value={productName || ''} 
                        onChange={(e)=>setProductName(e.target.value)}></input>
            </div>
            <div className="product-item">
                <label>Category</label>
                <input type="text" value={category || ''} 
                onChange={(e)=>setCategory(e.target.value)}></input>
            </div>
            <div className="product-item">
                <label>Price</label>
                <input type="text" value={price || ''} 
                onChange={(e)=>setPrice(e.target.value)}></input>
            </div>
            <div className="product-item">
                <label>Discount Price</label>
                <input type="text" value={discountPrice || ''} 
                    onChange={(e)=>setDiscountPrice(e.target.value)}></input>
            </div>
            <div className="product-item">
                <label>Product Description</label>
                <input type="textarea" value={productDescription || ''} 
                    onChange={(e)=>setProductDescription(e.target.value)}></input>
            </div>
            <div className="isTopProduct">
            <input type="checkbox" id="isTopProduct" value={isTopProduct} onChange={e=>setIsTopProduct(e.target.checked)}></input>
            <label className="isTopProduct">Is Top Product</label>
            </div>
            <button id="edit-button" className="btn btn-primary" onClick={(event)=>{event.preventDefault();
                    updateProduct()}}>Update Product</button>
        </div>
    </div>
    </>
);
}

export default EditProduct;
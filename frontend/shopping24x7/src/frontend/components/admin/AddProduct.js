import { useEffect, useRef, useState } from 'react';
import '../../css/AddProduct.css';
import axios from 'axios';
import { Link } from "react-router-dom"

function AddProduct() {
const [productName,setProductName] = useState('');
const [productDescription, setProductDescription] = useState('');
const [category, setCategory] = useState('');
const [price,setPrice] = useState(0);
const [discountPrice,setDiscountPrice] = useState(0);
const [isTopProduct,setIsTopProduct] = useState(false);
const [productImage,setIsProductImage]= useState('../images/products/NI-Placeholder.png');
const [errMsg,setErrMsg] = useState('');
const [successMessage, setSuccessMsg] = useState('');
const productNameRef = useRef();
const productDescriptionRef = useRef();
const priceRef = useRef();
const categoryRef = useRef();


useEffect(()=>{
    setErrMsg('');
},[productDescription,productName,price])

async function addProduct(){
    if(validateInput()){
        var formData = new FormData();
        formData.append('name',productName);
        formData.append('category',category);
        formData.append('price',parseInt(price));
        formData.append('discountPrice',parseInt(discountPrice));
        formData.append('description',productDescription);
        formData.append('isTopProduct',isTopProduct);
        await axios.post('http://localhost:8080/api/v1/admin/products'
            , formData)
            .then(response=>{
                if(response.status===200){
                    setSuccessMsg('Product had been Created Successfully');
                    clearInputs();
                }
                })
                .catch(err=>{})
    }
}

function clearInputs(){
setProductDescription('');setProductName('');setPrice('');setIsTopProduct(false);
priceRef.current.value='';productNameRef.current.value='';
productDescriptionRef.current.value='';categoryRef.current.value='';
}

function validateInput(){
    if(!productName || !productDescription || !price || !category){
        setErrMsg('Mandatory Feilds are Missing');
        return false;
    }
    if(isNaN(price) || isNaN(discountPrice)){
        setErrMsg('Price and Discount Price should be numberic');
        return false;
    }
    return true;
}

function handleImageChange(event){
    if(event.target.files[0]){
        var createupdatedURL = URL.createObjectURL(event.target.files[0]);
        setIsProductImage(createupdatedURL);
    }
    
}

return (
    <>
    {errMsg && <p className='addProductContainerErrorMsg'>{errMsg}</p>}
    {successMessage && <p className='addProductContainerSuccessMsg'>{successMessage}
    . Go to <Link to="/admin/products">Manage Products</Link> to View Added Product</p>}
    <div className="addProductContainer">
        <div className='productDetailsContainer'>
        <h5><b> Add New Product</b></h5>
            <div className="product-item">
                <label>Product Name</label>
                <input type="text" ref={productNameRef} onChange={(e)=>setProductName(e.target.value)}></input>
            </div>
            <div className="product-item">
                <label>Category</label>
                <input type="text" ref={categoryRef} onChange={(e)=>setCategory(e.target.value)}></input>
            </div>
            <div className="product-item">
                <label>Price</label>
                <input type="text" ref={priceRef}onChange={(e)=>setPrice(e.target.value)}></input>
            </div>
            <div className="product-item">
                <label>Discount Price</label>
                <input type="text" onChange={(e)=>setDiscountPrice(e.target.value)}></input>
            </div>
            <div className="product-item">
                <label>Product Description</label>
                <input type="textarea" ref={productDescriptionRef} onChange={(e)=>setProductDescription(e.target.value)}></input>
            </div>
            <div className='product-image'>
                <label>Product Image</label>
                <input type="file"  multiple accept="image/*" onChange={handleImageChange}></input>
            </div>
            <div className="isTopProduct">
            <input type="checkbox" id="isTopProduct" value={isTopProduct} onChange={e=>setIsTopProduct(e.target.checked)}></input>
            <label className="isTopProduct">Is Top Product</label>
            </div>
            <button id="add-new-button" className='addProductButton' onClick={addProduct}>Add Product</button>
        </div>
        <div>
            <img src={productImage} alt="productname" />
        </div>
    </div>
    </>
);
}

export default AddProduct;
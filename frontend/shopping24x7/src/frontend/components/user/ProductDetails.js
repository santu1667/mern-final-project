import '../../css/ProductDetails.css';
import {useEffect,useState} from 'react';
import axios from 'axios';
import {useParams,useNavigate } from "react-router-dom"

function ProductDetails(props) {

const [imageURL,setImageURL] = useState("../images/products/NI-Placeholder.png")
const navigate = useNavigate();

let params =useParams();

  useEffect(()=>{
    getProuctDetails();
  },[])

  async function getProuctDetails(){
    var requestURL = 'http://localhost:8080/api/v1/products/'+params.productId;
    await axios.get(requestURL)
    .then(response =>{
      props.setSelectedProduct(response.data.product);
      let url='.'+response.data.product.image;
      setImageURL(url);
    })
    .catch(error=> {});
  }

  function handleBuyNow(){
    sessionStorage.removeItem("temporaryProductId");
    sessionStorage.setItem("temporaryProductId",props.selectedProduct._id);
    navigate('/checkout');
  }

  function handleAddToCart(){
    props.cart.push(props.selectedProduct);
    props.setCart(props.cart);
    props.setCartCount(props.cart.length);
  }

  return (
    <div className='productDetailsContainer'>
    <h3><b>{props.selectedProduct.category+' - '+props.selectedProduct.name}</b></h3>
      <div id="product-page-banner" className='productImageContainer'>
          <img src={imageURL} alt=""></img>
      </div>
      <div className='productDetails'>
        <div className='prodcutDetailsSection1'>
          <p>Price:${props.selectedProduct.price-props.selectedProduct.discountPrice}  
            {props.selectedProduct.discountPrice>0 && <label>${props.selectedProduct.price}</label>}</p>
            <button id="product-page-buynow" className="btn btn-warning" onClick={(event)=>{event.preventDefault();handleBuyNow()}}>Buy Now</button>
                <button id="product-page-add-to-cart"  className="btn btn-primary" onClick={(event)=>{event.preventDefault();handleAddToCart()}}>Add to Cart</button>
        </div>
        <div className='prodcutDetailsSection2'>
          <p>{props.selectedProduct.description}</p>
        </div>
          
      </div>
    </div>
  );
}

export default ProductDetails;

import { useNavigate } from 'react-router-dom';
import '../../css/Products.css';
import { useEffect, useState} from 'react';
import axios from 'axios';

function Products(props){
    const navigate = useNavigate();
    const [productList,setProductList] = useState();
    
    useEffect(()=>{
        retreiveProducts();
    },[])

    const retreiveProducts = async () =>{
        await axios.get('http://localhost:8080/api/v1/homepage/products')
        .then(res =>{
            setProductList(res.data.products)
        })
        .catch(err=>{})
    }

    const navigateToURL = (product) =>
    {
        const path = 'products/'+product._id;
        navigate(path);
    }
    const addtoCart = (product)=>{
        props.cart.push(product);
        props.setCart(props.cart);
        props.setCartCount(props.cart.length);
        const myCartJSON = JSON.stringify(props.cart)
        sessionStorage.setItem('cart',myCartJSON);
    }
    return( 
        <>
        <h5> Top Selling Products</h5>
        <div className="productContainer">
        {productList && productList.map((item) => (
            <div key={item.id} className='productItem'>
            {item.isTopProduct && <p className='isTopProductText'>#1 in {item.category}</p>}
            <img  key={Math.random()} src={item.image} alt=""
                    onClick={(event)=>
                        {event.preventDefault();navigateToURL(item)} }></img>
            <hr></hr>
            <p key={Math.random()}> {item.name}</p>
            <p key={Math.random()}>Price: ${item.price-item.discountPrice}</p>
            <button key={Math.random()} onClick={()=>{addtoCart(item)}}> Add to Cart</button>
            </div>
        )
        )}
    </div></>)
}

export default Products;
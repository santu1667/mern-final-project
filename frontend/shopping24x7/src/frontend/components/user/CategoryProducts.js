import '../../css/CategoryProducts.css'
import {useEffect,useState,useRef} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function CategoryProducts(props){
    const [productList,setProductList] = useState();
    const inputRef = useRef();
    const [filteringProductList, setfilteringProductList] = useState([]);
    const [filteredSearchList, setFilteredSearchList] = useState();
    const[filteredList, setFilteredList]=useState();
    const priceFilterList = ["$5-$25","$26-$60","$61-$100","$101-$250","$251-$500","$501-$1000","$1001 and More"];
    const [checkedPrices, setCheckedPrices] = useState([]);
    const queryParams = new URLSearchParams(window.location.search);
    const categoryName = queryParams.get("categoryName");
    const navigate = useNavigate();

    useEffect(()=>{
        retreiveProductDetails();
    },[])

    const addToCart = (product)=>{
        props.cart.push(product);
        props.setCart(props.cart);
        props.setCartCount(props.cart.length);
        const myCartJSON = JSON.stringify(props.cart)
        sessionStorage.setItem('cart',myCartJSON);
    }

    const retreiveProductDetails =async ()=>{
        try{
            await axios.get('http://localhost:8080/api/v1/products')
            .then(res => {
                const productsList = res.data.products;
                setProductList(productList);
                filterProductsOnCategory(categoryName,productsList);
            })
        }
        catch(err){}
    }

    const handlePriceFilter = (event)=>{
        var priceCheckedList = [...checkedPrices];
        var checkboxChanged = event.target;
        if (checkboxChanged.checked) {
            priceCheckedList = [...checkedPrices, checkboxChanged.value];
        } else {
            priceCheckedList.splice(checkedPrices.indexOf(checkboxChanged.value), 1);
        }
        setCheckedPrices(priceCheckedList);
        filterProductsOnPrice(priceCheckedList);
        
    }

    const filterProductsOnPrice = (priceCheckList)=>{
        if(priceCheckList.length>0){
            const filteredProductsOnPrice =[];
            for(var i=0;i<priceCheckList.length;i++){
                var priceString = priceCheckList[i];
                var priceStringValues = priceString.replace(/[A-Zaz$]/g, "");
                const lowerPrice = parseInt(priceStringValues.split("-")[0]);
                const higherPrice = parseInt(priceStringValues.split("-")[1]);
                for(var j=0;j<filteredSearchList.length;j++){
                    var productPrice = filteredSearchList[j].price-
                                        filteredSearchList[j].discountPrice;
                    if(Number.isNaN(higherPrice) && 
                            productPrice>=lowerPrice){
                        filteredProductsOnPrice.push(filteredSearchList[j])
                    }
                    else if(productPrice>=lowerPrice && productPrice<=higherPrice){
                        filteredProductsOnPrice.push(filteredSearchList[j])
                    }
                }
            }
            setfilteringProductList(filteredProductsOnPrice);
        }
        else{
            setfilteringProductList(filteredSearchList);
        }
        
    }

    const searchProducts = (event)=>{
        var searchedProducts = [];
        let searchKey = event.target.value;
        if(searchKey){
            for(let index in filteredList){
                var productName = filteredList[index].name;
                if(productName.toLowerCase().includes(searchKey.toLowerCase())){
                    searchedProducts.push(filteredList[index])
                }
            }
            setfilteringProductList(searchedProducts);
            setFilteredSearchList(searchedProducts);
        }else{
            setfilteringProductList(filteredList);
            setFilteredSearchList(filteredList);
        }
    }

    const filterProductsOnCategory= (category,productList) => {
        var categoryProductFilteredList = [];
        if(productList.length>0){
            for(let index in productList){
                if(productList[index].category === category){
                    categoryProductFilteredList.push(productList[index]);
                }
            }
        }
        setfilteringProductList(categoryProductFilteredList);
        setFilteredSearchList(categoryProductFilteredList);
        setFilteredList(categoryProductFilteredList);
    }

    function navigateToURL(product){
        const path = '/products/'+product._id;
        navigate(path);
    }

    return(
        <>
        <div className='categoryContainer'>
            <div className='leftPanel'>
            <div className='searchProduct'>
                <label htmlFor='searchProduct'> Search Products</label>
                <input ref={inputRef} key="searchProduct" id="searchProduct" type="text" onChange={searchProducts}></input>
            </div>
            <p>Filter by price</p>
            {priceFilterList.map((item, index) => (
            <div key={index}>
                <input value={item} type="checkbox" onChange={(handlePriceFilter)} />
                <span>{item}</span>
            </div>
        ))}
            </div>
            <div className='categoryContent'>
            {filteringProductList.length===0 && <p> No Products Found</p>}
            {filteringProductList && filteringProductList.map((product) => (
                <div key={Math.random()} className='categoryProductItem' >
                    {product.isTopProduct && <p className='isTopCategoryProductText'>#1 in {product.category}</p>}
                    <img key={Math.random()} src={product.image} alt="" 
                            onClick={(event)=>{event.preventDefault();navigateToURL(product)}}></img>
                    <hr/>
                    <p key={Math.random()}> {product.name}</p>
                        <p key={Math.random()}>Price: ${product.price-product.discountPrice}</p>
                        <button onClick={(event)=>{event.preventDefault();addToCart(product)} }>Add to Cart</button>
                </div> 
                ))}
                <div></div><div></div>
            </div>
        </div>
        </>
    )
}

export default CategoryProducts;
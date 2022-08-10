import '../../css/Cart.css';
import { useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Cart(props) {
  
  const [cartItemsList,setCartItemsList] = useState(props.cart);
  const [uniquecartItemsList,setuniquecartItemsList] = useState([]);
  const [totalPrice, setTotalPrice] =useState(0);
  const navigate = useNavigate();

  useEffect(()=>{
    if(cartItemsList.length<=0 ){
      if(sessionStorage.getItem("cart")){
      var cart=sessionStorage.getItem("cart");
      setCartItemsList(JSON.parse(cart));
      props.setCartCount(JSON.parse(cart).length);
      props.setCart(JSON.parse(cart));
      setuniquecartItemsList(getUniqueCartItemsList(JSON.parse(cart)))
      setTotalPrice(getPrice(cartItemsList));}
      }
      else{
        setuniquecartItemsList(getUniqueCartItemsList(cartItemsList));
        setTotalPrice(getPrice(cartItemsList));
      }
  },[]);
  
  function getUniqueCartItemsList(inputList){
      if(inputList.length>0){
          const countDistinct = inputList.reduce((inputList, curr) => {
            const { _id } = curr;
            if (inputList[_id]) ++inputList[_id];
            else inputList[_id] = 1;
            return inputList;
        }, {});
        const result = inputList.map((obj) => {
            obj["quantitySelected"] = countDistinct[obj._id];
            return obj;
        });
      const uniqueArray = [... new Map(result.map((item)=>[item["_id"], item])).values()]
      return uniqueArray
  }
  return [];
  }


  function updateCart(product){
      const updatedList=[];
    if(uniquecartItemsList.length>0){
      for(let item in uniquecartItemsList){
        if(uniquecartItemsList[item]._id === product._id){
          if(uniquecartItemsList[item].quantitySelected>1){
            uniquecartItemsList[item].quantitySelected = uniquecartItemsList[item].quantitySelected-1;
            updatedList.push(uniquecartItemsList[item]);
          }
        }
        else{
          updatedList.push(uniquecartItemsList[item]);
        }
      }
    setuniquecartItemsList(updatedList);
    setCartItemsList(updatedList);
    props.setCartCount(updatedList.length);
    props.setCart(updatedList);
    setTotalPrice(getPrice(updatedList));
    sessionStorage.removeItem("cart");
    sessionStorage.setItem("cart",JSON.stringify(updatedList));
  }}

  function getPrice(inputList){
    let totalPrice =0;
    if(inputList.length>0){
      for(let i in inputList){
        let effectivePrice = inputList[i].quantitySelected*(inputList[i].price-
          inputList[i].discountPrice);
        totalPrice= totalPrice+effectivePrice;
      }
      setTotalPrice(totalPrice);
      return totalPrice;
    }
    return totalPrice;
  }

  function proceedToCheckOutPage(){
    sessionStorage.setItem("uniqueCart",JSON.stringify(uniquecartItemsList));
    navigate('/checkout');
  }
  return (
    <> 
    <div className="cartContainer">
    {uniquecartItemsList.length>0 && <label><b> Cart</b></label>}
    {uniquecartItemsList && uniquecartItemsList.map((product) => (
      <div key={Math.random()}className="cartItems">
        <div key={Math.random()} className="cartDescription">
          <span> {product.quantitySelected} X {product.name}</span>
          <label>Price ${product.price}</label>
          <label>Discount ${product.discountPrice}</label>
        </div >
            <label className="cartPrice"> ${product.quantitySelected*(product.price-product.discountPrice)}</label>
            <p  onClick={(event)=>{event.preventDefault();updateCart(product)}}>remove</p>
        </div>
      ))}
      {uniquecartItemsList.length>0 &&
      <div className="cartCheckout">
        <p id="cart-grand-total">GrandTotal ${totalPrice}</p>
        <button id="cart-button" onClick={(event)=>{event.preventDefault();proceedToCheckOutPage();}} className="addProductButton" type="submit">Checkout</button>
      </div>}
      </div>


      {!props.cart.length>0 && 
          <div className="profileLogin">
            <p> Please Add Items to Your Cart</p>
          </div>
        }
      </>
  );
}

export default Cart;
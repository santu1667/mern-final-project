import { useEffect,useState } from 'react';
import '../../css/OrdersPage.css';
import { Link } from "react-router-dom"
import axios from 'axios';


function OrdersPage(props) {
    const [isUserLoggedIn,setUserLoggedIn] = useState(false);
    const [ordersList,setOrdersList] = useState([]);

    useEffect(()=>{
    if(sessionStorage.getItem("auth-token")){
        setUserLoggedIn(true);
        if(sessionStorage.getItem('user')){
            var userEmail = JSON.parse(sessionStorage.getItem('user')).email;
            retreiveOrders(userEmail);
        }}
    },[])

    async function retreiveOrders(inputemail){
        await axios.get('http://localhost:8080/api/v1/orders',
            {params:{email:inputemail}})
        .then(response =>{
            setOrdersList(response.data.orders);
        }).catch(error =>{})
    }

return (
    <div className='ordersContainer'>
        <h3>Your Orders</h3>
        <div className='orderDetails'>
            <p>{props.orderMessage}</p>
            {!isUserLoggedIn && <p>Please <Link to="/login">Login</Link> or <Link to="/register">Create</Link> New Account to view all of your orders</p>}
        {ordersList && ordersList.map((order) => (
        <div key={Math.random()}className="manageOrderItems">
        <div key={Math.random()} className="manageOrderDescription">
            <span className={order.isDelivered ? "deliveredOrder":''} key={Math.random()}># {order._id}</span>
            <label key={Math.random()}>{order.user.email}</label>
        </div >
        </div>
        ))}
        </div>
    </div>
);
}

export default OrdersPage;
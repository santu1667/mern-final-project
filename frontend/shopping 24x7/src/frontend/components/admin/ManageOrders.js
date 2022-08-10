import axios from 'axios';
import { useEffect, useState } from 'react';
import '../../css/ManageOrders.css';


function ManageOrders() {
  const [ordersList,setOrdersList] = useState([]);
  const [errMsg,setErrorMessage] = useState('');
  const [successMsg,setSuccessMsg] = useState('')

  useEffect(()=>{
    retreiveOrders();
  },[])

  const retreiveOrders = async ()=>{
    await await axios.get('http://localhost:8080/api/v1/orders')
    .then(response => {
      setOrdersList(response.data.orders);
    }).catch(error =>{setErrorMessage('Error Occured While retreiving Orders')})
  }

  async function processOrder(inputOrder){
    setErrorMessage('');setSuccessMsg('');
    var request = {isDelivered:true};
    await axios.patch('http://localhost:8080/api/v1/orders/'+inputOrder._id,request)
    .then(response =>{
      if(response.status===200){
        setSuccessMsg('Order# '+inputOrder._id+' has been processed successfully');
        let newOrderList = [];
        for(let index in ordersList){
          if(ordersList[index]._id !== inputOrder._id){
            newOrderList.push(ordersList[index]);
          }
          else{ordersList[index].isDelivered = true; newOrderList.push(ordersList[index]);}
        }  setOrdersList(newOrderList);
      }
    }).catch(error => {
      setErrorMessage('Unable to Process the Order');
    })
  }

  async function deleteOrder(inputOrder){
    setErrorMessage('');setSuccessMsg('');
    await axios.delete('http://localhost:8080/api/v1/admin/orders/'+inputOrder._id)
    .then(response =>{
      if(response.status===200){
        setSuccessMsg('Order# '+inputOrder._id+' has been deleted successfully')
        let newOrderList = [];
        for(let index in ordersList){
          if(ordersList[index]._id !== inputOrder._id){
            newOrderList.push(ordersList[index]);
          }
        } setOrdersList(newOrderList);
      }
    })
  }

  return (
    <> 
    
    {successMsg &&  <p className='orderSuccessMsg'>{successMsg}</p>}
    {errMsg &&  <p className='orderErrorMsg'>{errMsg}</p>}
  
  <div className='manageOrderContainer'>
  <h4> Manage Orders</h4>
    {ordersList.length<=0 && <p>No Orders Available</p> }
      {ordersList && ordersList.map((order) => (
    <div key={Math.random()}className="manageOrderItems">
      <div key={Math.random()} className="manageOrderDescription">
        <span className={order.isDelivered ? "deliveredOrder":''} key={Math.random()}># {order._id}</span>
        <label key={Math.random()}>{order.user.email}</label>
      </div >
      <div className='orderLinks'>
          {!order.isDelivered &&
          <p  key={Math.random()} className="processText" onClick={(event)=>
            {event.preventDefault();processOrder(order)}}>Process |</p>   }
          <p  key={Math.random()} className="deleteText" onClick={(event)=>
            {event.preventDefault();deleteOrder(order)}}>Delete</p>
      </div>
      </div>
      ))}
      </div>
      </>
  );
}

export default ManageOrders;
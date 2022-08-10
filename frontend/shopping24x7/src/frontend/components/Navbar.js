import '../css/Navbar.css';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Link } from "react-router-dom"

function Navbar(props) {
var homeURL = props.url;
var isAdmin = props.isAdmin;
var count= props.cartCount;
var isUserLoggedIn = props.isUserLoggedIn;

  return (
      <nav className='navContainer'>
        <ul className={isAdmin ? "nav-admin-list":"nav-list"}>
            <Link to={homeURL}  className="nav-item">Shop24x7</Link>
            <Link to="/" className="nav-item">Home</Link>
            {!isAdmin &&<>
            <Link to="/Department"  className="nav-item">Departments</Link>
            <Link to="/Offers"  className="nav-item">Offers</Link>
            <Link to="/Orders" className="nav-item">Orders</Link></>}
            {isAdmin &&<>
            <Link to="/admin/add-new-product" className="nav-item">AddProduct</Link>
            <Link to="/admin/products" className="nav-item">Manage Products</Link>
            <Link to="/admin/orders" className="nav-item">Manage Orders</Link></>}
            {!isUserLoggedIn &&
            <Link to="/login"  className="nav-item">Login</Link>}
            
            {isUserLoggedIn &&
            <>
            <Link to="/Profile"  className="nav-item">Profile</Link>
            <Link className='nav-item' to="/Logout">Logout</Link></>}
            {!isAdmin &&<>
            <Link to="/Cart" className="nav-item shoppingCartSymbol"><ShoppingCartIcon/></Link>
            {count>0 && <label className='cartCount'>{count}</label>}</>}
            
        </ul>
    </nav>
  );
}

export default Navbar;

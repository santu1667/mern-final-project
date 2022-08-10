import '../../css/Categories.css';
import { useNavigate } from 'react-router-dom';

function Categories(props){
    
    let navigate = useNavigate();

    function getCategoryImage(category){
        switch(category){
            case "Mobiles": 
                return "./images/categories/Mobiles.jpg";
            case "Video Games": 
                return "./images/categories/Video Games.png";
            case "Toys": 
                return "./images/categories/Toys.jpg";
            default :
                return "./images/categories/NI-Placeholder.png";
        }
    }
    const navigateToURL = (category) =>
    {
        const path = 'Categories?categoryName='+category;
        navigate(path);
    }

    return(
    <>
    <div className="categoriesHeading">
    <h5>Browse Products by Categories</h5>
    </div>
    <div className="categoriesContainer">
        {props.categoryList && props.categoryList.map((category) => (
            <div key={Math.random()} className='categoryItem' onClick={()=> navigateToURL(category)}>
            <img key={Math.random()} src={getCategoryImage(category)} alt=""></img>
            <p key={Math.random()}> {category}</p>
        </div>
        )
        )}
    </div></>
    )
}

export default Categories;
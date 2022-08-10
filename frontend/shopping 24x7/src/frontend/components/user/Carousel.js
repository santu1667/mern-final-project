import '../../css/Carousel.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function Carousel(){
    const images = [
    {
        id: 1,
        src:
        "https://gmedia.playstation.com/is/image/SIEPDC/ps5-family-hero-banner-desktop-01-en-17jan22?$800px$",
        alt: "PlayStation"
    },
    {
        id: 2,
        src:"https://www.mkt-jcpenney.com/prod/mkt/images/semi-annual-jewelry-sale-up-to-70-off-after-extra-30-off-with-jcpenney-credit-card-coupon-select-styles-90fabe63-0f7d-4d8e-ae2a-60c36666ab85.jpeg",
        alt: "Apple"
    },
    { 
        id: 3,
        src:
        "https://target.scene7.com/is/image/Target/GUEST_f97d1f67-4f3b-4b39-a389-3750048a895c?wid=2160&qlt=80&fmt=webp",
        alt: "Laptop"
    }
];

    var settings = {
        dots: true,
        infinite: true,
        arrows:false,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 100,
        lazyLoad: false,
        cssEase: "linear",
    };

return (
    <div className="carouselImages">
        <Slider {...settings}>
            {images.map((item) => (
                <div key={item.id}>
                <img src={item.src}  alt={item.alt} />
                </div>
            ))}
        </Slider>
    </div>
  );
}


export default Carousel;
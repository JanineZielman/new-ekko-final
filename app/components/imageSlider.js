import Slider from "react-slick";

export default function ImageSlider({ item }) {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    centerMode: true,
    centerPadding: "25%",
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          centerMode: false,
        }
      }
     ]
  };

  var Moment = require('moment');
  require('moment/locale/nb');
  
  return (
    <Slider {...settings}>
      {item.map((slide, i) => {
        return(
          slide.gallery ?
            slide.gallery.map((slideItem, i) => (
              <div className="slide-wrapper">
                <span className="credits">{slideItem.title}</span>
                <img src={slideItem.url}/>
                <a className='info-box' href={`${slide.performances ? `/ostre/${slide.slug}` : `/festival/${slide.slug}`}`}>
                  <p className='time cap'>{Moment(item.date).format("dddd D.M. yy")}</p>
                  <h2>{slide.title}</h2>
                  <h2 className='artists'>
                    {slide.performances?.map((performance,j) => {
                      return(
                        <span>
                          {performance.artist[0].title}
                        </span>
                      )
                    })}
                  </h2>
                </a>
              </div>
            ))
          :
            <div className="slide-wrapper">
              <span className="credits">{slide.title}</span>
              <img src={slide.url}/>
            </div>
            
        )
      })}
    </Slider>
  );
}
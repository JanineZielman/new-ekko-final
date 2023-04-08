import Slider from "react-slick";

export default function ImageSlider({ item }) {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    centerMode: true,
    centerPadding: "60px",
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <Slider {...settings}>
      {item.map((slide, i) => {
        return(
          <div className="slide-wrapper">
            <img src={slide.url}/>
          </div>
        )
      })}
    </Slider>
  );
}
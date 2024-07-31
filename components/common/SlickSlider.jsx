import Image from "next/image";
import React, { Component } from "react";
import Slider from "react-slick";
// import ReactImageZoom from "react-image-zoom";
// import Zoom from "react-img-zoom";
// import ReactImageMagnify from "react-image-magnify";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import InnerImageZoom from "react-inner-image-zoom";
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button type="button" className="slick-down slick-arrow" onClick={onClick}>
      <i className="fa-solid fa-chevron-down"></i>
    </button>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button type="button" className="slick-up slick-arrow" onClick={onClick}>
      <i className="fa-solid fa-chevron-up"></i>
    </button>
  );
}

class SlickSlider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null,
      photos: [],
    };
    this.slider1 = React.createRef();
    this.slider2 = React.createRef();
  }

  scrollToIndex = (index) => {
    this.slider1.current.slickGoTo(index);
  };

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2,
      photos: this.props.photos,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.forceUpdate != prevProps.forceUpdate) {
      this.scrollToIndex(0)
    }
  }

  render() {
    const { rimProps, rsProps, photos, noVaraint, withVaraint, colorWiseImg, originalImage } = this.props;

    const mergedImage = [...photos, ...noVaraint]

    console.log('mergedImage: ', noVaraint)
    // console.log('choiceOptionSlick:===== ', colorWiseImg)

    const settings1 = {
      slidesToShow: 1,
      autoplaySpeed: 2000,
      speed: 500,
      arrows: false,
      slidesToScroll: 1,
      asNavFor: this.slider2.current, // Accessing current of ref
      swipeToSlide: true,
      ref: this.slider1,
      className: "slider-for"
    };

    const settings2 = {
      className: "slider-nav",
      asNavFor: this.slider1.current, // Accessing current of ref
      slidesToShow: mergedImage.length < 6 ? mergedImage.length : 5,
      swipeToSlide: true,
      focusOnSelect: true,
      arrows: false,
      vertical: true,
      infinite: true,
      autoplaySpeed: 2000,
      speed: 500,
      loop: true,
      // nextArrow: <SampleNextArrow />,
      // prevArrow: <SamplePrevArrow />,
      ref: this.slider2,
      easing: 'ease', // You can customize easing function here

    };
    
    return (
      <>
        {
          mergedImage &&
          <>
            <Slider {...settings2}>
              {mergedImage.map((photo, index) => (
                <div key={index} className="d-block">
                  <img src={photo?.path} alt="products" className="img-fluid" />
                </div>
              ))}
            </Slider>
            <Slider {...settings1}>
              {mergedImage.map((photo, index) => (
                <div key={index}>
                  <InnerImageZoom
                    src={photo?.path}
                    zoomSrc={photo?.path}
                    zoomType="hover"
                    zoomScale={1.5}
                    zoomMargin={20}
                  />
                </div>
              ))}
            </Slider>

          </>
        }

      </>
    );
  }
}
export default SlickSlider;

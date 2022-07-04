import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from "clsx";
import React, { Component } from "react";
// import Swiper core and required modules
import SwiperCore, {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import DefaultImage from "../../assets/images/common/default.png";
import CustomImage from "../UI/CustomImage/CustomImage";
import "./Slider.css";

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);

class Slider extends Component {
  state = {
    params: {
      spaceBetween: 10,
      // navigation: this.props.navigation ? true : false,
      navigation: {
        nextEl: ".arrow-right",
        prevEl: ".arrow-left",
      },
      pagination: this.props.pagination ? { clickable: true } : false,
      loop: true,
      autoplay: { delay: 5000 },
      // Responsive breakpoints
      breakpoints: {
        100: {
          slidesPerView:
            this.props.params.slidesPerView < 1
              ? this.props.params.slidesPerView
              : 1,

          centerInsufficientSlides: true,
        },
        400: {
          slidesPerView:
            this.props.params.slidesPerView < 2
              ? this.props.params.slidesPerView
              : 1,

          centerInsufficientSlides: true,
        },
        768: {
          slidesPerView:
            this.props.params.slidesPerView < 3
              ? this.props.params.slidesPerView
              : 3,
          centeredSlides: true,
        },
        // when window width is >= 1000px
        1000: {
          slidesPerView: this.props.params.slidesPerView,
          spaceBetween: 20,
        },
      },
      ...this.props.params,
    },
  };

  updateSlidesPerView() {}

  componentDidMount() {
    document.addEventListener("resize", this.updateSlidesPerView);
  }

  render() {
    let swiperSlides = null;
    if (this.props.images) {
      swiperSlides =
        this.props.images.length > 0 ? (
          this.props.images.map((image, i) => {
            return (
              <SwiperSlide key={i}>
                <CustomImage
                  noLazyLoad
                  style={{ width: this.props.imageWidth + "%", height: this.props.imageHeight ? this.props.imageHeight : "60vh" }}
                  src={image}
                  alt="Banner"
                />
              </SwiperSlide>
            );
          })
        ) : (
          <CustomImage
            noLazyLoad
            style={{ width: this.props.imageWidth + "%", height: "60vh" }}
            src={DefaultImage}
            useCustomSrc
            alt="Banner"
          />
        );
    }

    if (this.props.components) {
      swiperSlides = this.props.components.map((component, i) => {
        return <SwiperSlide key={i}>{component}</SwiperSlide>;
      });
    }

    let wrapperClasses = ["SwiperCover"];
    if(this.props.innerNavigation){
      wrapperClasses.push("InnerNavigationCover");
    }
    if(this.props.className){
      wrapperClasses.push(this.props.className);
    }

    return (
      <div
        className={clsx(wrapperClasses)}
      >
        <div className="arrow-left">
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
        <Swiper
          className={this.props.innerNavigation ? "InnerNavigation" : null}
          {...this.state.params}
        >
          {swiperSlides}
        </Swiper>
        <div className="arrow-right">
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>
    );
  }
}
export default Slider;

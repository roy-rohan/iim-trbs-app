import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";
import React, { Component } from "react";
import ReactPlayer from "react-player";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withToastManager } from "react-toast-notifications";
import AboutUs from "../../assets/images/home/AboutUs.PNG";
import BusinessEventsIcon from "../../assets/images/home/summary-icons/business-events.png";
import ManagementEventsIcon from "../../assets/images/home/summary-icons/managment.png";
import PanelDiscussionIcon from "../../assets/images/home/summary-icons/panel-discussions.png";
import SpeakersIcon from "../../assets/images/home/summary-icons/speakers.png";
import WorkshopIcon from "../../assets/images/home/summary-icons/workshops.png";
import Slider from "../../components/Slider/Slider";
import Button from "../../components/UI/Button/Button";
import Card from "../../components/UI/Card/Card";
import CustomImage from "../../components/UI/CustomImage/CustomImage";
import Modal from "../../components/UI/Modal/Modal";
import * as actions from "../../store/actions/index";
import * as errorMessages from "../../utils/errorMessages";
import classes from "./Home.module.css";
import * as services from "./Home.service";

class Home extends Component {
  state = {
    showVideo: false,
    topEvents: [],
    topWorkshops: [],
    topSpeakers: [],
    topConnexions: [],
    homePageContent: null,
    sliderIamges: [],
  };

  componentDidMount() {
    services
      .fetchTopEvents()
      .then((res) => {
        this.setState({
          topEvents: res.data ? res.data : [],
        });
      })
      .catch((err) => {
        this.props.toastManager.add(errorMessages.home.EVENTS_NOT_LOADED, {
          appearance: "warning",
          autoDismiss: true,
        });
      });

    services
      .fetchTopWorkshops()
      .then((res) => {
        this.setState({
          topWorkshops: res.data ? res.data : [],
        });
      })
      .catch((err) => {
        this.props.toastManager.add(errorMessages.home.WORKSHOPS_NOT_LOADED, {
          appearance: "warning",
          autoDismiss: true,
        });
      });
    services
      .fetchTopSpeakers()
      .then((res) => {
        this.setState({
          topSpeakers: res.data ? res.data : [],
        });
      })
      .catch((err) => {
        this.props.toastManager.add(errorMessages.home.SPEAKERS_NOT_LOADED, {
          appearance: "warning",
          autoDismiss: true,
        });
      });

    services
      .fetchTopConnexions()
      .then((res) => {
        this.setState({
          topConnexions: res.data ? res.data : [],
        });
      })
      .catch((err) => {
        this.props.toastManager.add(errorMessages.home.CONNEXIONS_NOT_LOADED, {
          appearance: "warning",
          autoDismiss: true,
        });
      });

    services
      .fetchHomePageContent()
      .then((res) => {
        this.setState({
          homePageContent: res.data ? res.data : null,
        });
      })
      .catch((err) => {
        this.props.toastManager.add("Home page content could not be loaded", {
          appearance: "warning",
          autoDismiss: true,
        });
      });

    services
      .fetchHomePageSliderImages()
      .then((res) => {
        this.setState({
          sliderIamges: res.data ? res.data.map((image) => image.path) : [],
        });
      })
      .catch((err) => {});
  }

  openVideoPlayer() {
    this.setState({ showVideo: true });
  }

  closeVideoPlayer() {
    this.setState({ showVideo: false });
  }

  strategizerHandler() {
    window.location = "/strategizer";
  }

  addToCartHandler(product, type) {
    let newCartItem = {
      price: +product.price,
      quantity: 1,
      product_id: product[type + "_id"],
      product_slug: product.slug,
      product_type: type,
      product_name: product.title ? product.title : product.name,
      product_image: product.image_url,
      venue: product.venue,
      event_date: product[type + "_date"]
        ? product[type + "_date"]
        : product["date"],
    };

    this.props.onAddCartItem(this.props.cart, newCartItem);
  }

  render() {
    const topEventsContent = this.state.topEvents
      ? this.state.topEvents.map((event, i) => {
          return (
            <Card
              key={i}
              link={"/events/" + event.slug}
              image={event.image_url}
              title={event.title}
              shortDesc={event.short_description}
              isAuth={this.props.isAutenticated && event.price > 0}
              addToCartHandler={() =>
                this.addToCartHandler.bind(this, event, "event")()
              }
            />
          );
        })
      : null;

    const topWorkshopsContent = this.state.topWorkshops
      ? this.state.topWorkshops.map((workshop, i) => {
          return (
            <Card
              key={i}
              link={"/workshops/" + workshop.slug}
              image={workshop.image_url}
              title={workshop.title}
              shortDesc={workshop.short_description}
              isAuth={this.props.isAutenticated && workshop.price > 0}
              addToCartHandler={() =>
                this.addToCartHandler.bind(this, workshop, "workshop")()
              }
            />
          );
        })
      : null;

    const topSpeakersContent = this.state.topSpeakers
      ? this.state.topSpeakers.map((speaker, i) => {
          return (
            <Card
              key={i}
              link={"/speakers/" + speaker.slug}
              image={speaker.image_url}
              title={speaker.name}
              shortDesc={speaker.topic}
              isAuth={this.props.isAutenticated && speaker.price > 0}
              addToCartHandler={() =>
                this.addToCartHandler.bind(this, speaker, "speaker")()
              }
            />
          );
        })
      : null;

    const topConnexionContent = this.state.topConnexions
      ? this.state.topConnexions.map((connexion, i) => {
          return (
            <Card
              key={i}
              link={"/connexions/" + connexion.slug}
              image={connexion.image_url}
              title={connexion.name}
              shortDesc={connexion.topic}
              isAuth={this.props.isAutenticated && connexion.price > 0}
              addToCartHandler={() =>
                this.addToCartHandler.bind(this, connexion, "connexion")()
              }
            />
          );
        })
      : null;

    return (
      <div className={classes.Home}>
        <Slider
          images={this.state.sliderIamges}
          params={{
            slidesPerView: 1,
          }}
          navigation={true}
          pagination={true}
          imageWidth={100}
          innerNavigation={true}
          className={classes.HomeSlider}
          imageHeight={"100%"}
        ></Slider>
        <section className={classes.AboutUsSection}>
          <div className={classes.TextGroup}>
            <h1 className={classes.TextHeader}>About The Red Brick Summit</h1>
            {/* <p>
              It is that time of the year again- a rare blossom in the months of
              autumn. The time to take a stroll down the red-bricked walls,
              witnessing the best-in-business luminaries. The time to amalgamate
              learnings and layout the path of a visionary. The time to outwit,
              outplay, and outlast. After its first virtual success in 2020, the
              Red Brick Summit (TRBS), the Mecca of Management fests in India,
              is back for its 5th edition this year, from 9th October to 10th
              October 2021.
            </p>
            <p>
              The winds of IIM Ahmedabad have always carried with them the
              spirits of adrenaline and enthusiasm. We invite you to this iconic
              edifice that has served as an emblem of academic excellence for
              over 50 years.
            </p>
            <p>Watch out for this space to know more!</p> */}
            {parse(
              this.state.homePageContent
                ? this.state.homePageContent?.about
                : "<p>Loading...</p>"
            )}
          </div>
          <div className={classes.AboutVideo}>
            {/* <img
              src={AboutUs}
              alt="about video"
              onClick={this.openVideoPlayer.bind(this)}
            /> */}
            <CustomImage
              useCustomSrc
              src={AboutUs}
              alt="about video"
              onClick={this.openVideoPlayer.bind(this)}
            />
            <Modal
              show={this.state.showVideo}
              modalClosed={this.closeVideoPlayer.bind(this)}
            >
              <ReactPlayer
                width={"100%"}
                controls
                height={"80vh"}
                url={
                  this.state.homePageContent
                    ? this.state.homePageContent.video_link
                    : "https://www.youtube.com/watch?v=0DBp_dwDSCk"
                }
                playing={this.state.showVideo}
              ></ReactPlayer>
              <div className={classes.CloseBtnWrapper}>
                <button
                  className={classes.CloseBtn}
                  onClick={this.closeVideoPlayer.bind(this)}
                >
                  Close
                </button>
              </div>
            </Modal>
          </div>
        </section>
        <section className={classes.SummarySection}>
          <div className={classes.SummaryCard}>
            <img src={BusinessEventsIcon} alt="Business Events" />
            <p className={classes.SummaryCount}>
              {this.state.homePageContent
                ? this.state.homePageContent.event_count + "+"
                : "Loading..."}
            </p>
            <p className={classes.SummaryTitle}>Business Events</p>
          </div>
          <div className={classes.SummaryCard}>
            <img src={SpeakersIcon} alt="Speakers" />
            <p className={classes.SummaryCount}>
              {" "}
              {this.state.homePageContent
                ? this.state.homePageContent.speaker_count + "+"
                : "Loading..."}
            </p>
            <p className={classes.SummaryTitle}>Speakers</p>
          </div>
          <div className={classes.SummaryCard}>
            <img src={WorkshopIcon} alt="Workshops" />
            <p className={classes.SummaryCount}>
              {" "}
              {this.state.homePageContent
                ? this.state.homePageContent.workshop_count + "+"
                : "Loading..."}
            </p>
            <p className={classes.SummaryTitle}>Workshops</p>
          </div>
          <div className={classes.SummaryCard}>
            <img src={PanelDiscussionIcon} alt="Panel Discussions" />
            <p className={classes.SummaryCount}>
              {" "}
              {this.state.homePageContent
                ? this.state.homePageContent.panel_disc_count + "+"
                : "Loading..."}
            </p>
            <p className={classes.SummaryTitle}>Panel Discussions</p>
          </div>
          <div className={classes.SummaryCard}>
            <img src={ManagementEventsIcon} alt="Management Symposium" />
            <p className={classes.SummaryCount}>
              {this.state.homePageContent
                ? this.state.homePageContent.mng_symp_count
                : "Loading..."}
            </p>
            <p className={classes.SummaryTitle}>Management Symposium</p>
          </div>
        </section>
        <section className={[classes.TopListing, classes.TopEvents].join(" ")}>
          <h1 className={classes.SectionHeader}>Events</h1>
          <div className={classes.SliderSection}>
            {topEventsContent ? (
              <Slider
                components={topEventsContent}
                params={{
                  slidesPerView: 4,
                  loop: false,
                }}
                navigation={true}
              ></Slider>
            ) : null}
          </div>
          <Button
            link="/events"
            exact
            params={{ btnType: "Primary", btnAlign: "Center" }}
          >
            View All <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </section>
        <section
          className={[classes.TopListing, classes.TopWorkshops].join(" ")}
        >
          <h1 className={classes.SectionHeader}>Workshops</h1>
          <div className={classes.SliderSection}>
            {topWorkshopsContent ? (
              <Slider
                components={topWorkshopsContent}
                params={{
                  slidesPerView: 4,
                  loop: false,
                }}
                navigation={true}
              ></Slider>
            ) : null}
          </div>
          <Button
            link="/workshops"
            exact
            params={{ btnType: "Primary", btnAlign: "Center" }}
          >
            View All <FontAwesomeIcon icon={faArrowRight} />
          </Button>
          {/* <div className={classes.RegisterWorkshop}>
            <p className={classes.SectionDesc}>
              Click <NavLink to="/workshops">HERE</NavLink> for Workshop
              Registration
            </p>
          </div> */}
        </section>
        <section
          className={[classes.TopListing, classes.TopSpeakers].join(" ")}
        >
          <h1 className={classes.SectionHeader}>Speakers</h1>
          <div className={classes.SliderSection}>
            {topSpeakersContent ? (
              <Slider
                components={topSpeakersContent}
                params={{
                  slidesPerView: 4,
                  loop: false,
                }}
                navigation={true}
              ></Slider>
            ) : null}
          </div>
          <Button
            link="/speakers"
            exact
            params={{ btnType: "Primary", btnAlign: "Center" }}
          >
            View All <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </section>
        <section
          className={[classes.TopListing, classes.TopWorkshops].join(" ")}
        >
          <h1 className={classes.SectionHeader}>Connexions</h1>
          <div className={classes.SliderSection}>
            {topConnexionContent ? (
              <Slider
                components={topConnexionContent}
                params={{
                  slidesPerView: 4,
                  loop: false,
                }}
                navigation={true}
              ></Slider>
            ) : null}
          </div>
          <Button
            link="/connexions"
            exact
            params={{ btnType: "Primary", btnAlign: "Center" }}
          >
            View All <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </section>
        {/* <div
          className={classes.Strategizer}
          onClick={() => this.strategizerHandler()}
        >
          <p>Strategizer</p>
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAutenticated: state.auth.token !== null,
    cart: state.auth.cart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddCartItem: (cart, newCartItem) =>
      dispatch(actions.addCartItem(cart, newCartItem)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withToastManager(Home)));

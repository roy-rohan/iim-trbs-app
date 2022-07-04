import React, { Component } from "react";
import parse from "html-react-parser";
import classes from "./EventDetail.module.css";
import * as services from "./EventDetail.service";
import * as errorMessages from "../../../utils/errorMessages";
import * as actions from "../../../store/actions/index";

import { withRouter } from "react-router-dom";
import { withToastManager } from "react-toast-notifications";
import DefaultImage from "../../../assets/images/common/default.png";

import ICForm from "../../../components/Form/ICForm/ICForm";
import Modal from "../../../components/UI/Modal/Modal";
import CustomImage from "../../../components/UI/CustomImage/CustomImage";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import moment from "moment";
import Loader from "../../../assets/images/loader.gif";
class EventDetail extends Component {
  state = {
    basicActive: "Date & Time",
    event: null,
    showModal: false,
    tabs: [
      "Date & Time",
      "Rules",
      "Prizes",
      "Event Format",
      "Contact",
      "Register",
    ],
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.match.params.eventSlug) {
      services
        .fetchEventDetail(this.props.match.params.eventSlug)
        .then((res) => {
          this.fetchImages(res.data[0].event_id);
          this.setState({
            event: res.data[0],
          });
        })
        .catch((err) => {
          this.props.toastManager.add(errorMessages.event.EVENT_NOT_FOUND, {
            appearance: "error",
            autoDismiss: true,
          });
        });
    }
  }

  fetchImages(eventId) {
    services
      .fetchImages(eventId)
      .then((response) => {
        let timeline_image = response.data.filter(
          (image) => image.type === "event-timeline"
        );
        if (timeline_image.length === 1) {
          let updatedEvent = this.state.event;
          updatedEvent.timeline_image_url = timeline_image[0].path;
          this.setState({ event: updatedEvent });
        }
      })
      .catch((error) => {});
  }

  addToCartHandler() {
    // if (+this.state.event.price === 0) {
    //   return;
    // }

    let newCartItem = {
      price: +this.state.event.price,
      quantity: 1,
      product_id: this.state.event.event_id,
      product_slug: this.state.event.slug,
      product_type: "event",
      product_name: this.state.event.title,
      product_image: this.state.event.image_url,
      venue: this.state.event.venue,
      event_date: this.state.event.event_date,
    };

    this.props.onAddCartItem(this.props.cart, newCartItem);
  }

  handleBasicClick(value) {
    if (value === this.state.basicActive) {
      return;
    }

    this.setState({
      basicActive: value,
    });
  }

  notifyClickHandler() {
    this.setState({ showModal: true });
  }

  onNotifyModalClosed() {
    this.setState({ showModal: false });
  }

  render() {
    let eventContent = this.state.event ? (
      <div className={classes.Content}>
        <div className={classes.TopSection}>
          <CustomImage
            src={
              this.state.event.image_url
                ? this.state.event.image_url
                : DefaultImage
            }
            useCustomeSrc={this.state.event.image_url ? false : true}
            cssClass={classes.EventImage}
            alt="Event"
          />
          <div className={classes.TextSection}>
            <p className={classes.EventTitle}>{this.state.event.title}</p>
            <div className={classes.EventDesc}>
              {parse(this.state.event.full_description)}
            </div>
          </div>
        </div>
        <div className={classes.BottomSection}>
          <div className={classes.Tabs}>
            {this.state.tabs.map((tab, i) => {
              return (
                <div
                  key={i}
                  onClick={() => this.handleBasicClick(tab)}
                  className={[
                    classes.TabItem,
                    this.state.basicActive === tab
                      ? classes.ActiveTabItem
                      : null,
                  ].join(" ")}
                >
                  {tab}
                </div>
              );
            })}
          </div>

          <div className={classes.TabContentWrapper}>
            <div
              className={classes.TabContent}
              style={{
                display:
                  this.state.basicActive === "Date & Time" ? "block" : "none",
              }}
            >
              <p>{parse(this.state.event.remark_one)}</p>
              <p>Start Date: {this.state.event.event_date}</p>
              <p>Start End Date: {this.state.event.event_end_date}</p>
              <p>
                Event Start Time:{" "}
                {moment(this.state.event.event_time).format("h:mm a")}
              </p>
              <p>
                Event End Time:{" "}
                {moment(this.state.event.event_end_time).format("h:mm a")}
              </p>
              <p>{parse(this.state.event.remark_two)}</p>
            </div>
            <div
              className={classes.TabContent}
              style={{
                display: this.state.basicActive === "Rules" ? "block" : "none",
              }}
            >
              {parse(this.state.event.rules)}
            </div>
            <div
              className={classes.TabContent}
              style={{
                display: this.state.basicActive === "Prizes" ? "block" : "none",
              }}
            >
              {parse(this.state.event.prizes)}
            </div>
            <div
              className={classes.TabContent}
              style={{
                display:
                  this.state.basicActive === "Event Format" ? "block" : "none",
              }}
            >
              {parse(this.state.event.event_format)}
            </div>
            <div
              className={classes.TabContent}
              style={{
                display:
                  this.state.basicActive === "Contact" ? "block" : "none",
              }}
            >
              {parse(this.state.event.contact)}
            </div>
            <div
              className={classes.TabContent}
              style={{
                display:
                  this.state.basicActive === "Register" ? "block" : "none",
              }}
            >
              <div>{parse(this.state.event.register)}</div>
              {this.props.isAutenticated && this.state.event?.price > 0 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.addToCartHandler()}
                >
                  Add To Cart
                </Button>
              ) : this.props.isAutenticated ? null : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.props.history.push("/login")}
                >
                  Login to Register
                </Button>
              )}
            </div>
          </div>
        </div>
        {this.state.event.timeline_image_url ? (
          <div className={classes.TimelineImageSection}>
            <CustomImage
              src={
                this.state.event.timeline_image_url
                  ? this.state.event.timeline_image_url
                  : DefaultImage
              }
              useCustomSrc={this.state.event.timeline_image_url ? false : true}
              cssClass={classes.EventTimelineImage}
              alt="Event"
            />
          </div>
        ) : null}
        <Modal
          show={this.state.showModal}
          modalClosed={this.onNotifyModalClosed.bind(this)}
        >
          <ICForm
            eventName={this.state.event ? this.state.event.title : null}
            formSubmitted={this.onNotifyModalClosed.bind(this)}
          />
        </Modal>
      </div>
    ) : null;

    return (
      <div className={classes.EventDetail}>
        <div className={classes.PageHeaderWrapper}>
          <h1 className={classes.PageHeading}>Event Detail</h1>
        </div>
        {eventContent != null ? (
          eventContent
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <img style={{ width: "150px" }} src={Loader} alt="comming soon" />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.auth.cart,
    isAutenticated: state.auth.token !== null,
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
)(withRouter(withToastManager(EventDetail)));

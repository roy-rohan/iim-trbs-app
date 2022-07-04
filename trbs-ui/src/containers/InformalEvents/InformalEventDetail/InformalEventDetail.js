import React, { Component } from "react";
import parse from "html-react-parser";
import classes from "./InformalEventDetail.module.css";
import * as services from "./InformalEventDetail.service";
import * as errorMessages from "../../../utils/errorMessages";
import * as actions from "../../../store/actions/index";

import { withRouter } from "react-router-dom";
import { withToastManager } from "react-toast-notifications";
import DefaultImage from "../../../assets/images/common/default.png";
import Loader from "../../../assets/images/loader.gif";

import ICForm from "../../../components/Form/ICForm/ICForm";
import Modal from "../../../components/UI/Modal/Modal";
import CustomImage from "../../../components/UI/CustomImage/CustomImage";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import moment from "moment";

class InformalEventDetail extends Component {
  state = {
    basicActive: "Date & Time",
    informalEvent: null,
    showModal: false,
    tabs: [
      "Date & Time",
      "Background Information",
      "FAQ",
      "Terms and Condition",
      "Contact",
      "Register",
    ],
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.match.params.informalEventSlug) {
      services
        .fetchInformalEventDetail(this.props.match.params.informalEventSlug)
        .then((res) => {
          this.fetchImages(res.data[0].informal_event_id);
          this.setState({
            informalEvent: res.data[0],
          });
        })
        .catch((err) => {
          this.props.toastManager.add(
            errorMessages.informalEvent.WORKSHOPS_NOT_LOADED,
            {
              appearance: "error",
              autoDismiss: true,
            }
          );
        });
    }
  }

  fetchImages(informalEventId) {
    services
      .fetchImages(informalEventId)
      .then((response) => {
        let timeline_image = response.data.filter(
          (image) => image.type === "informal_event-timeline"
        );
        if (timeline_image.length === 1) {
          let updatedInformalEvent = this.state.informalEvent;
          updatedInformalEvent.timeline_image_url = timeline_image[0].path;
          this.setState({ informalEvent: updatedInformalEvent });
        }
      })
      .catch((error) => {});
  }

  addToCartHandler() {
    // if (+this.state.informalEvent.price === 0) {
    //   return;
    // }

    let newCartItem = {
      price: +this.state.informalEvent.price,
      quantity: 1,
      product_id: this.state.informalEvent.informal_event_id,
      product_slug: this.state.informalEvent.slug,
      product_type: "informal_event",
      product_name: this.state.informalEvent.title,
      product_image: this.state.informalEvent.image_url,
      venue: this.state.informalEvent.venue,
      event_date: this.state.informalEvent.event_date,
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
    let informalEventContent = this.state.informalEvent ? (
      <div className={classes.Content}>
        <div className={classes.TopSection}>
          <CustomImage
            src={
              this.state.informalEvent.image_url
                ? this.state.informalEvent.image_url
                : DefaultImage
            }
            useCustomeSrc={this.state.informalEvent.image_url ? false : true}
            cssClass={classes.InformalEventImage}
            alt="InformalEvent"
          />
          <div className={classes.TextSection}>
            <p className={classes.InformalEventTitle}>
              {this.state.informalEvent.title}
            </p>
            <div className={classes.InformalEventDesc}>
              {parse(this.state.informalEvent.full_description)}
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
              <p>Start Date: {this.state.informalEvent.informalEvent_date}</p>
              <p>
                Start End Date:{" "}
                {this.state.informalEvent.informalEvent_end_date}
              </p>
              <p>
                InformalEvent Start Time:{" "}
                {moment(this.state.informalEvent.informalEvent_time).format(
                  "h:mm a"
                )}
              </p>
              <p>
                InformalEvent End Time:{" "}
                {moment(this.state.informalEvent.informalEvent_end_time).format(
                  "h:mm a"
                )}
              </p>
            </div>
            <div
              className={classes.TabContent}
              style={{
                display:
                  this.state.basicActive === "Background Information"
                    ? "block"
                    : "none",
              }}
            >
              {parse(this.state.informalEvent.background_info)}
            </div>
            <div
              className={classes.TabContent}
              style={{
                display: this.state.basicActive === "FAQ" ? "block" : "none",
              }}
            >
              {parse(this.state.informalEvent.faq)}
            </div>
            <div
              className={classes.TabContent}
              style={{
                display:
                  this.state.basicActive === "Terms and Condition"
                    ? "block"
                    : "none",
              }}
            >
              {parse(this.state.informalEvent.terms_condition)}
            </div>
            <div
              className={classes.TabContent}
              style={{
                display:
                  this.state.basicActive === "Contact" ? "block" : "none",
              }}
            >
              {parse(this.state.informalEvent.contact)}
            </div>
            <div
              className={classes.TabContent}
              style={{
                display:
                  this.state.basicActive === "Register" ? "block" : "none",
              }}
            >
              {this.props.isAutenticated &&
              this.state.informalEvent?.price > 0 ? (
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
        {this.state.informalEvent.timeline_image_url ? (
          <div className={classes.TimelineImageSection}>
            <CustomImage
              src={
                this.state.informalEvent.timeline_image_url
                  ? this.state.informalEvent.timeline_image_url
                  : DefaultImage
              }
              useCustomSrc={
                this.state.informalEvent.timeline_image_url ? false : true
              }
              cssClass={classes.InformalEventTimelineImage}
              alt="InformalEvent"
            />
          </div>
        ) : null}
        <Modal
          show={this.state.showModal}
          modalClosed={this.onNotifyModalClosed.bind(this)}
        >
          <ICForm
            informalEventName={
              this.state.informalEvent ? this.state.informalEvent.title : null
            }
            formSubmitted={this.onNotifyModalClosed.bind(this)}
          />
        </Modal>
      </div>
    ) : null;

    return (
      <div className={classes.InformalEventDetail}>
        <div className={classes.PageHeaderWrapper}>
          <h1 className={classes.PageHeading}>Informal Event Detail</h1>
        </div>
        {informalEventContent != null ? (
          informalEventContent
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
)(withRouter(withToastManager(InformalEventDetail)));

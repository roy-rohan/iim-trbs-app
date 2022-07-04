import React, { Component } from "react";
import parse from "html-react-parser";
import classes from "./WorkshopDetail.module.css";
import * as services from "./WorkshopDetail.service";
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

class WorkshopDetail extends Component {
  state = {
    basicActive: "Date & Time",
    workshop: null,
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
    services
      .fetchWorkshopDetail(this.props.match.params.workshopSlug)
      .then((res) => {
        this.fetchImages(res.data[0].workshop_id);
        this.setState({
          workshop: res.data[0],
        });
      })
      .catch((err) => {
        this.props.toastManager.add(
          errorMessages.workshop.WORKSHOPS_NOT_LOADED,
          {
            appearance: "error",
            autoDismiss: true,
          }
        );
      });
  }

  fetchImages(workshopId) {
    services
      .fetchImages(workshopId)
      .then((response) => {
        let timeline_image = response.data.filter(
          (image) => image.type === "workshop-timeline"
        );
        if (timeline_image.length === 1) {
          let updatedWorkshop = this.state.workshop;
          updatedWorkshop.timeline_image_url = timeline_image[0].path;
          this.setState({ workshop: updatedWorkshop });
        }
      })
      .catch((error) => {});
  }

  addToCartHandler() {
    // if (+this.state.workshop.price === 0) {
    //   return;
    // }

    let newCartItem = {
      price: +this.state.workshop.price,
      quantity: 1,
      product_id: this.state.workshop.workshop_id,
      product_slug: this.state.workshop.slug,
      product_type: "workshop",
      product_name: this.state.workshop.title,
      product_image: this.state.workshop.image_url,
      venue: this.state.workshop.venue,
      event_date: this.state.workshop.workshop_date,
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
    let workshopContent = this.state.workshop ? (
      <div className={classes.Content}>
        <div className={classes.TopSection}>
          <CustomImage
            src={
              this.state.workshop.image_url
                ? this.state.workshop.image_url
                : DefaultImage
            }
            useCustomeSrc={this.state.workshop.image_url ? false : true}
            cssClass={classes.WorkshopImage}
            alt="Workshop"
          />
          <div className={classes.TextSection}>
            <p className={classes.WorkshopTitle}>{this.state.workshop.title}</p>
            <div className={classes.WorkshopDesc}>
              {parse(this.state.workshop.full_description)}
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
              <p>Start Date: {this.state.workshop.workshop_date}</p>
              <p>Start End Date: {this.state.workshop.workshop_end_date}</p>
              <p>
                Workshop Start Time:{" "}
                {moment(this.state.workshop.workshop_time).format("h:mm a")}
              </p>
              <p>
                Workshop End Time:{" "}
                {moment(this.state.workshop.workshop_end_time).format("h:mm a")}
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
              {parse(this.state.workshop.background_info)}
            </div>
            <div
              className={classes.TabContent}
              style={{
                display: this.state.basicActive === "FAQ" ? "block" : "none",
              }}
            >
              {parse(this.state.workshop.faq)}
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
              {parse(this.state.workshop.terms_condition)}
            </div>
            <div
              className={classes.TabContent}
              style={{
                display:
                  this.state.basicActive === "Contact" ? "block" : "none",
              }}
            >
              {parse(this.state.workshop.contact)}
            </div>
            <div
              className={classes.TabContent}
              style={{
                display:
                  this.state.basicActive === "Register" ? "block" : "none",
              }}
            >
              {this.props.isAutenticated && this.state.workshop?.price > 0 ? (
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
        {this.state.workshop.timeline_image_url ? (
          <div className={classes.TimelineImageSection}>
            <CustomImage
              src={
                this.state.workshop.timeline_image_url
                  ? this.state.workshop.timeline_image_url
                  : DefaultImage
              }
              useCustomSrc={
                this.state.workshop.timeline_image_url ? false : true
              }
              cssClass={classes.WorkshopTimelineImage}
              alt="Workshop"
            />
          </div>
        ) : null}
        <Modal
          show={this.state.showModal}
          modalClosed={this.onNotifyModalClosed.bind(this)}
        >
          <ICForm
            workshopName={
              this.state.workshop ? this.state.workshop.title : null
            }
            formSubmitted={this.onNotifyModalClosed.bind(this)}
          />
        </Modal>
      </div>
    ) : null;

    return (
      <div className={classes.WorkshopDetail}>
        <div className={classes.PageHeaderWrapper}>
          <h1 className={classes.PageHeading}>Workshop Detail</h1>
        </div>
        {workshopContent != null ? (
          workshopContent
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
)(withRouter(withToastManager(WorkshopDetail)));

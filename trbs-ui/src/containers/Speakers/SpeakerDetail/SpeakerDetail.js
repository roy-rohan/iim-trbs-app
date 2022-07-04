import { Button } from "@material-ui/core";
import parse from "html-react-parser";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withToastManager } from "react-toast-notifications";
import DefaultImage from "../../../assets/images/common/default.png";
import Loader from "../../../assets/images/loader.gif";
import axios from "../../../axios-iim";
import CustomImage from "../../../components/UI/CustomImage/CustomImage";
import * as actions from "../../../store/actions/index";
import * as errorMessages from "../../../utils/errorMessages";
import * as classes from "./SpeakerDetail.module.css";

class SpeakerDetail extends Component {
  state = {
    speaker: null,
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.match.params.speakerSlug) {
      axios
        .post(
          "/speakers/read.php",
          JSON.stringify({
            filters: [
              {
                field_name: "slug",
                value: this.props.match.params.speakerSlug,
                op: "=",
              },
            ],
            filter_op: "",
            sort: [],
          })
        )
        .then((res) => {
          this.setState({
            speaker: res.data[0],
          });
        })
        .catch((err) => {
          this.props.toastManager.add(
            errorMessages.speaker.SPEAKERS_NOT_FOUND,
            {
              appearance: "error",
              autoDismiss: true,
            }
          );
        });
    }
  }

  addToCartHandler() {
    let newCartItem = {
      price: +this.state.speaker.price,
      quantity: 1,
      product_id: this.state.speaker.speaker_id,
      product_slug: this.state.speaker.slug,
      product_type: "speaker",
      product_name: this.state.speaker.name,
      product_image: this.state.speaker.image_url,
      venue: this.state.speaker.venue,
      event_date: this.state.speaker.date,
    };

    this.props.onAddCartItem(this.props.cart, newCartItem);
  }
  render() {
    let content = this.state.speaker ? (
      <>
        {" "}
        <div className={classes.ImageContainer}>
          <div className={Image}>
            <CustomImage
              src={
                this.state.speaker.image_url
                  ? this.state.speaker.image_url
                  : DefaultImage
              }
              useCustomeSrc={this.state.speaker.image_url ? false : true}
              cssClass={classes.SpeakerImage}
              alt="Speaker"
            />
          </div>
          <div className={classes.ShortInfo}>
            <h2>{this.state.speaker.name}</h2>
            <p>
              {this.state.speaker.date +
                " | " +
                moment(this.state.speaker.time).format("HH:mm A")}
            </p>
          </div>
        </div>
        <div className={classes.FullInfo}>
          <h2 className={classes.Topic}>{this.state.speaker.topic}</h2>
          <div className={classes.Introduction}>
            {parse(this.state.speaker.introduction)}
          </div>
          <div className={classes.Biography}>
            {parse(this.state.speaker.biography)}
          </div>
          <div className={classes.Designation}>
            {parse(this.state.speaker.designation)}
          </div>
          <div className={classes.Timing}>
            <p>
              <b>Session Timing : </b>
              <span>
                {parse(
                  this.state.speaker.date +
                    " | " +
                    moment(this.state.speaker.time).format("HH:mm A")
                )}
              </span>
            </p>

            <p className={classes.Duration}>
              <b>Duration : </b> <span>{this.state.speaker.duration}</span>
            </p>
          </div>
          <div className={classes.Registration}>
            <p>
              <b>Registration Procedure : </b>
            </p>
            {parse(this.state.speaker.registration)}
            <div className={classes.ActionButton}>
              {this.props.isAutenticated && this.state.speaker?.price > 0 ? (
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
      </>
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
    );
    return <div className={classes.Container}>{content}</div>;
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
)(withToastManager(SpeakerDetail));

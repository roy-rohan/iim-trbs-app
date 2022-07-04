import { Button, TextField } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import MatBackdrop from "../../../../../components/UI/Backdrop/MatBackdrop/MatBackdrop";
import * as actions from "../../../../../store/actions/index";
import * as classes from "./AddCoupon.module.css";
import { initalValues } from "./InitialData";
import axios from "../../../../../axios-iim";

class AddCoupon extends Component {
  state = {
    initialValues: initalValues,
    isFormValid: true,
    generatedCoupons: null,
    volume: 0,
  };

  constructor() {
    super();
    this.submitBtnRef = React.createRef();
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.props.stopLoading();
  }

  onFormSubmit(coupon) {
    coupon.preventDefault();
    this.submitBtnRef.current.textContent = "Please wait...";
    let isValid = this.validate();
    if (isValid) {
      // make a request
      let couponData = {};
      if (this.state.initialValues) {
        Object.keys(this.state.initialValues).forEach((key) => {
          couponData[key] = this.state.initialValues[key].value;
        });
        this.submitBtnRef.current.textContent = "Submit";
        this.setState({ volume: +this.state.initialValues.volume.value });
        console.log(this.state.volume, "before");
        this.props.onAddCoupon(couponData, this.successHandler.bind(this));
      } else {
        this.submitBtnRef.current.textContent = "Submit";
      }
    } else {
      window.scrollTo(0, 0);
    }
    this.submitBtnRef.current.textContent = "Submit";
  }

  validate() {
    let values = this.state.initialValues;
    let isValid = true;
    Object.keys(values).forEach((key) => {
      if (values[key].required) {
        let fieldValue = values[key].value;
        if (fieldValue === null || fieldValue === "") {
          values[key].error = true;
          values[key].errorMessage = "Required";
          isValid = false;
        } else {
          values[key].error = false;
          values[key].errorMessage = "";
        }
      } else {
        values[key].error = false;
        values[key].errorMessage = "";
      }
    });
    this.setState({ initalValues: values });
    return isValid;
  }

  successHandler() {
    this.formRef.current.reset();
    this.props.onSendMessage("Coupon Generated Successfully", "success");
    axios
      .post(
        "/admin/coupons/read.php",
        JSON.stringify({
          filters: [],
          filter_op: "",
          sort: [{
            field_name: "created_at",
            op: "DESC"
          }],
        })
      )
      .then((response) => {
        const fetchedCoupons = [];
        for (let key in response.data) {
          fetchedCoupons.push({
            ...response.data[key],
            id: key,
          });
        }
        this.setState({
          generatedCoupons: fetchedCoupons.slice(
            0,
            fetchedCoupons.length < 4
              ? fetchedCoupons.length
              : this.state.volume
          ),
        });
      })
      .catch((error) => {});
  }

  fieldChangHandler(key, coupon) {
    let updatedValues = this.state.initialValues;
    Object.keys(updatedValues).forEach((fieldKey) => {
      if (fieldKey === key) {
        updatedValues[fieldKey].value = coupon.target.value;
      }
    });
    this.setState({ initalValues: updatedValues });
  }

  render() {
    return (
      <div className={classes.AddCoupon}>
        <MatBackdrop open={this.props.loading}></MatBackdrop>
        <div className={classes.PageHeader}>
          <h2>Add Coupon</h2>
        </div>
        <form
          ref={this.formRef}
          className={classes.Form}
          onChange={() => this.validate.bind(this)()}
        >
          <TextField
            error={this.state.initialValues.discount.error}
            id="discount"
            name="discount"
            label="Discount"
            type="number"
            onChange={(coupon) =>
              this.fieldChangHandler.bind(this, "discount", coupon)()
            }
            helperText={this.state.initialValues.discount.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <TextField
            error={this.state.initialValues.volume.error}
            id="volume"
            name="volume"
            label="Volume"
            type="number"
            onChange={(coupon) =>
              this.fieldChangHandler.bind(this, "volume", coupon)()
            }
            helperText={this.state.initialValues.volume.errorMessage}
            variant="outlined"
            fullWidth
          />
          <div className={classes.Spacer}></div>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            onClick={this.onFormSubmit.bind(this)}
            ref={this.submitBtnRef}
          >
            Submit
          </Button>
        </form>
        {this.state.generatedCoupons ? (
          this.state.generatedCoupons.length > 0 ? (
            <div className={classes.CouponsGeneratedContainer}>
              <h2>Coupon Codes Generated: </h2>
              <ul className={classes.CouponList}>
                {this.state.generatedCoupons.map((coupon, index) => {
                  return <li key={index}>{coupon.coupon_code}</li>;
                })}
              </ul>
            </div>
          ) : (
            <div>No Coupon was generated</div>
          )
        ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAddCoupon: (couponData, cb) =>
      dispatch(actions.addCoupon(couponData, cb)),
    onSendMessage: (message, messageType) =>
      dispatch(actions.sendMessage(message, messageType)),
    stopLoading: () => dispatch(actions.stopLoading()),
  };
};

export default connect(null, mapDispatchToProps)(AddCoupon);

import { CircularProgress } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actions from "../../../store/actions/index";
class PaymentHandler extends Component {
  componentDidMount() {
    let rawQueryParam = this.props.location.search;
    try {
      if (rawQueryParam) {
        let startingIndex = +rawQueryParam.indexOf("?");
        if (startingIndex >= 0) {
          let queryParams = this.props.location.search.substring(
            +startingIndex + 1
          );
          let arrOfParams = queryParams.split("&");
          let params = {};
          for (let paramGrp of arrOfParams) {
            let param = paramGrp.split("=")[0];
            let value = paramGrp.split("=")[1];
            params[param] = value;
          }

          let description = params["description"];

          let orderDetailList = description.split(",");
          for (let orderDetail of orderDetailList) {
            let param = orderDetail.split(":")[0];
            let value = orderDetail.split(":")[1];
            params[param] = value;
          }

          let transaction = {
            txn_id: params.txn_id,
            mode: "online",
            user_id: params.user_id,
            status: params.status === "success" ? 1 : 0,
            description: params.description,
            order_id: params.order_id,
          };
          this.props.onAddPaymentDetails(
            transaction,
            this.redirectPage.bind(this)
          );
        }
      }
    } catch (error) {
      // console.log("someting went wrong");
    }
  }

  redirectPage() {
    this.props.history.push("/profile");
  }

  render() {
    return <CircularProgress />;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAddPaymentDetails: (transaction, cb) =>
      dispatch(actions.createPaymentDetails(transaction, cb)),
  };
};

export default connect(null, mapDispatchToProps)(withRouter(PaymentHandler));

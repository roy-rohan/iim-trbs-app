import { CircularProgress } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "../../../../axios-iim";
import * as actions from "../../../../store/actions/index";
import { extractQueryParams } from "../../../../utils/queryUtil";
import * as classes from "./ValidatePasswordChangeLink.module.css";

class ValidatePasswordChangeLink extends Component {
  sanitizeToken = (token) => {
    let sanitizedToken = token
      .replaceAll("=%3Cbr%20/%3E", "")
      .replaceAll("=<br%20/>", "");
    return sanitizedToken;
  };

  componentDidMount() {
    let queryParams = extractQueryParams(
      this.sanitizeToken(this.props.location.search.substring(1))
    );
    axios
      .post(
        "/users/validatePasswordChangeToken.php",
        JSON.stringify({
          token: queryParams.token,
        })
      )
      .then((response) => {
        let emailId = response.data.email_id;
        localStorage.setItem("userEmailId", emailId);
        this.redirectTo("/setNewPassword");
      })
      .catch((error) => {
        this.props.onSendMessage("Link not valid.");
        this.redirectTo("/");
      });
  }

  redirectTo(link) {
    this.props.history.push(link);
  }

  render() {
    let content = <CircularProgress className={classes.Spinner} />;
    return <div className={classes.PageWrapper}>{content}</div>;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSendMessage: (message, type) =>
      dispatch(actions.sendMessage(message, type)),
  };
};

export default withRouter(
  connect(null, mapDispatchToProps)(ValidatePasswordChangeLink)
);

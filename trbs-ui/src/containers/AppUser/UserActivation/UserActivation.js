import { CircularProgress } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import * as classes from "./UserActivation.module.css";
import * as actions from "../../../store/actions/index";
import { extractQueryParams } from "../../../utils/queryUtil";
import { Component } from "react";

class UserActivation extends Component {
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
    this.props.onActivateAccount(queryParams.token, this.props.onLoginHandler);
  }

  redirectTo() {
    return <Redirect to={this.props.authRedirectPath} />;
  }

  render() {
    let content = this.props.loading ? (
      <CircularProgress className={classes.Spinner} />
    ) : (
      this.redirectTo()
    );
    return <div className={classes.PageWrapper}>{content}</div>;
  }
}

const mapStateToprops = (state) => {
  return {
    loading: state.auth.loading,
    isAuthenticated: state.auth.token !== null,
    authRedirectPath: state.auth.authRedirectPath,
  };
};

const mapDispatchToprops = (dispatch) => {
  return {
    onActivateAccount: (token, cb) =>
      dispatch(actions.activateAccount(token, cb)),
    onLoginHandler: (token) => dispatch(actions.loginHandler(token)),
  };
};

export default withRouter(
  connect(mapStateToprops, mapDispatchToprops)(UserActivation)
);

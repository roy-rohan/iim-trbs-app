import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import * as actions from "../../store/actions";
const Logout = (props) => {
  let history = useHistory();
  useEffect(() => {
    props.onLogout();
    history.push("/");
  }, [props, history]);
  return <></>;
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);

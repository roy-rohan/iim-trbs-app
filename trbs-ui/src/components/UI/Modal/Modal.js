import React, { Component, Fragment } from "react";

import classes from "./Modal.module.css";
import Backdrop from "../Backdrop/Backdrop";

class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.show !== this.props.show ||
      nextProps.children !== this.props.children
    );
  }

  componentWillUpdate() {
    // console.log("[Modal] WillUpdate");
  }

  render() {
    return (
      <Fragment>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div
          className={classes.Modal}
          style={{
            transform: this.props.show
              ? "translateX(-50%) translateY(-50%)"
              : "translateX(-50%) translateY(-100%)",
            opacity: this.props.show ? "1" : "0",
            top: this.props.show ? "50%" : "-100vh",
          }}
        >
          {this.props.children}
        </div>
      </Fragment>
    );
  }
}

export default Modal;

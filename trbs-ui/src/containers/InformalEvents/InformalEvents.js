import React, { Component } from "react";
import { connect } from "react-redux";
import { withToastManager } from "react-toast-notifications";
import * as actions from "../../store/actions/index";
import * as errorMessages from "../../utils/errorMessages";
import classes from "./InformalEvents.module.css";
import InformalEventSection from "./InformalEventSection/InformalEventSection";

class InformalEvents extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.onFetchCategories();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.categories !== this.props.categories;
  }

  showError() {
    this.props.toastManager.add(
      errorMessages.informalEvent.INFORMAL_EVENTS_NOT_LOADED,
      {
        appearance: "warning",
        autoDismiss: true,
      }
    );
  }

  render() {
    let informalEventSections = null;
    if (!this.props.loading) {
      if (this.props.error) {
        this.showError();
      }

      informalEventSections = this.props.categories.map((category, i) => {
        return <InformalEventSection category={category} key={i} />;
      });
    } else {
      informalEventSections = (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <p className={classes.ComingSoon}>
            Informal Events will be added soon.
          </p>
        </div>
      );
    }

    return (
      <div className={classes.InformalEventWrapper}>
        <div className={classes.PageHeaderWrapper}>
          <h1 className={classes.PageHeading}>Informal Event</h1>
        </div>
        <div className={classes.ContentWrapper}>
          {informalEventSections != null &&
          informalEventSections.length !== 0 ? (
            informalEventSections
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <p className={classes.ComingSoon}>
                Informal Events will be added soon.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.informalEvent.error,
    categories: state.informalEvent.categories,
    loading: state.informalEvent.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchCategories: () => dispatch(actions.fetchInformalEventCategories()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withToastManager(InformalEvents));

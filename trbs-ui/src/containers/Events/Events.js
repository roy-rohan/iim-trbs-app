import React, { Component } from "react";
import { connect } from "react-redux";
import { withToastManager } from "react-toast-notifications";
import Loader from "../../assets/images/loader.gif";
import * as actions from "../../store/actions/index";
import * as errorMessages from "../../utils/errorMessages";
import classes from "./Events.module.css";
import EventSection from "./EventSection/EventSection";

class Events extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.onFetchCategories();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.categories !== this.props.categories;
  }

  showError() {
    this.props.toastManager.add(errorMessages.event.EVENTS_NOT_LOADED, {
      appearance: "warning",
      autoDismiss: true,
    });
  }

  render() {
    let eventSections = (
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
    if (!this.props.loading) {
      if (this.props.error) {
        this.showError();
      }

      eventSections = this.props.categories.map((category, i) => {
        return <EventSection category={category} key={i} />;
      });
    } else {
      eventSections = (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {/* <img style={{ width: "150px" }} src={Loader} alt="comming soon" /> */}
          <p className={classes.ComingSoon}>Events will be added soon.</p>s
        </div>
      );
    }

    return (
      <div className={classes.EventsWrapper}>
        <div className={classes.PageHeaderWrapper}>
          <h1 className={classes.PageHeading}>Events</h1>
        </div>
        <div className={classes.ContentWrapper}>
          {eventSections != null ? (
            eventSections
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {/* <img style={{ width: "150px" }} src={Loader} alt="comming soon" /> */}
              <p className={classes.ComingSoon}>Events will be added soon.</p>s
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.event.error,
    categories: state.event.categories,
    loading: state.event.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchCategories: () => dispatch(actions.fetchEventCategories()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withToastManager(Events));

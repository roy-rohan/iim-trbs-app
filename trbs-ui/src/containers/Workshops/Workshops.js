import React, { Component } from "react";
import classes from "./Workshops.module.css";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import * as errorMessages from "../../utils/errorMessages";

import { withToastManager } from "react-toast-notifications";
import CircularProgress from "@material-ui/core/CircularProgress";

import WorkshopSection from "./WorkshopSection/WorkshopSection";

class Workshops extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.onFetchCategories();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.categories !== this.props.categories;
  }

  showError() {
    this.props.toastManager.add(errorMessages.workshop.WORKSHOPS_NOT_LOADED, {
      appearance: "warning",
      autoDismiss: true,
    });
  }

  render() {
    let workshopSections = <CircularProgress />;
    if (!this.props.loading) {
      if (this.props.error) {
        this.showError();
      }

      workshopSections = this.props.categories.map((category, i) => {
        return <WorkshopSection category={category} key={i} />;
      });
    } else {
      workshopSections = <CircularProgress />;
    }

    return (
      <div className={classes.WorkshopWrapper}>
        <div className={classes.PageHeaderWrapper}>
          <h1 className={classes.PageHeading}>Workshop</h1>
        </div>
        <div className={classes.ContentWrapper}>
          {workshopSections != null ? (
            workshopSections
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
    error: state.workshop.error,
    categories: state.workshop.categories,
    loading: state.workshop.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchCategories: () => dispatch(actions.fetchWorkshopCategories()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withToastManager(Workshops));

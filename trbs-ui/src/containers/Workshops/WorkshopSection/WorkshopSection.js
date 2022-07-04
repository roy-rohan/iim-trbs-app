import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Loader from "../../../assets/images/loader.gif";
import axios from "../../../axios-iim";
import Card from "../../../components/UI/Card/Card";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions/index";
import classes from "./WorkshopSection.module.css";

class WorkshopSection extends Component {
  state = {
    workshops: [],
  };

  componentDidMount() {
    this.props.onFetchWorkshop(
      this.props.category,
      JSON.stringify({
        filters: [
          { field_name: "e.type", value: this.props.category, op: "=" },
          { field_name: "e.visible", value: 1, op: "=" },
        ],
        filter_op: "AND",
        sort: [{ field_name: "e.view_order", op: "ASC" }],
      })
    );
  }

  render() {
    let workshops = (
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
      workshops =
        this.props.workshops && this.props.workshops[this.props.category]
          ? this.props.workshops[this.props.category].map((workshop, i) => {
              return (
                <div className={classes.CardWrapper} key={i}>
                  <Card
                    link={this.props.match.url + "/" + workshop.slug}
                    image={workshop.image_url}
                    title={workshop.title}
                    shortDesc={workshop.short_description}
                  />
                </div>
              );
            })
          : null;
    }

    return (
      <div className={classes.WorkshopSectionWrapper}>
        <div className={classes.WorkshopSection}>
          <h1 className={classes.WorkshopType}>{this.props.category}</h1>
          <div className={classes.Workshops}>{workshops}</div>
        </div>
        <hr style={{ marginBottom: "1.8rem" }} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    workshops: state.workshop.workshops,
    loading: state.workshop.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchWorkshop: (category, queryCriteria) =>
      dispatch(actions.fetchWorkshops(category, queryCriteria)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(withRouter(WorkshopSection), axios));

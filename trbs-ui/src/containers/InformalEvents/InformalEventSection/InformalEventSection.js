import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import axios from "../../../axios-iim";
import Card from "../../../components/UI/Card/Card";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions/index";
import Loader from "../../../assets/images/loader.gif";
import classes from "./InformalEventSection.module.css";

class InformalEventSection extends Component {
  state = {
    informalEvents: [],
  };

  componentDidMount() {
    this.props.onFetchInformalEvent(
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
    let informalEvents = (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <img style={{ width: "150px" }} src={Loader} alt="comming soon" />
      </div>
    );

    if (!this.props.loading) {
      informalEvents =
        this.props.informalEvents &&
        this.props.informalEvents[this.props.category]
          ? this.props.informalEvents[this.props.category].map(
              (informalEvent, i) => {
                return (
                  <div className={classes.CardWrapper} key={i}>
                    <Card
                      link={this.props.match.url + "/" + informalEvent.slug}
                      image={informalEvent.image_url}
                      title={informalEvent.title}
                      shortDesc={informalEvent.short_description}
                    />
                  </div>
                );
              }
            )
          : null;
    }

    return (
      <div className={classes.InformalEventSectionWrapper}>
        <div className={classes.InformalEventSection}>
          <h1 className={classes.InformalEventType}>{this.props.category}</h1>
          <div className={classes.InformalEvents}>{informalEvents}</div>
        </div>
        <hr style={{ marginBottom: "1.8rem" }} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    informalEvents: state.informalEvent.informalEvents,
    loading: state.informalEvent.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchInformalEvent: (category, queryCriteria) =>
      dispatch(actions.fetchInformalEvents(category, queryCriteria)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(withRouter(InformalEventSection), axios));

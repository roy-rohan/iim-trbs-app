import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Loader from "../../../assets/images/loader.gif";
import axios from "../../../axios-iim";
import Card from "../../../components/UI/Card/Card";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions/index";
import classes from "./EventSection.module.css";

class EventsSection extends Component {
  state = {
    events: [],
  };

  componentDidMount() {
    this.props.onFetchEvents(
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
    let events = (
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
      events =
        this.props.events && this.props.events[this.props.category]
          ? this.props.events[this.props.category].map((event, i) => {
              return (
                <div className={classes.CardWrapper} key={i}>
                  <Card
                    link={this.props.match.url + "/" + event.slug}
                    image={event.image_url}
                    title={event.title}
                    shortDesc={event.short_description}
                  />
                </div>
              );
            })
          : null;
    }

    return (
      <div className={classes.EventsSectionWrapper}>
        <div className={classes.EventSection}>
          <h1 className={classes.EventType}>{this.props.category}</h1>
          <div className={classes.Events}>{events}</div>
        </div>
        <hr style={{ marginBottom: "1.8rem" }} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.event.events,
    loading: state.event.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchEvents: (category, queryCriteria) =>
      dispatch(actions.fetchEvents(category, queryCriteria)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(withRouter(EventsSection), axios));

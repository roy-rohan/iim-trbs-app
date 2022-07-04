import { Button } from "@material-ui/core";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { withToastManager } from "react-toast-notifications";
import CustomImage from "../../components/UI/CustomImage/CustomImage";
import * as actions from "../../store/actions/index";
import classes from "./Speakers.module.css";
import Loader from "../../assets/images/loader.gif";
import TextFormat from "../../components/UI/TextFormat/TextFormat";

class Speakers extends Component {
  getCharsAllowed = (factor) => {
    return window.innerWidth / factor;
  };

  componentDidMount() {
    window.scrollTo(0, 1);
    this.props.onFetchSpeakers(
      "all_speakers",
      JSON.stringify({
        filters: [{ field_name: "e.visible", value: 1, op: "=" }],
        filter_op: "",
        sort: [{ field_name: "e.view_order", op: "ASC" }],
      })
    );
  }
  onCardClickHandler(slug) {
    this.props.history.push({
      pathname: this.props.match.url + "/" + slug,
    });
  }
  render() {
    return (
      <div className={classes.Speakers}>
        <div className={classes.PageHeaderWrapper}>
          <h1 className={classes.PageHeading}>Speakers</h1>
        </div>
        <div className={classes.ContentWrapper}>
          {this.props.speakers ? (
            this.props.speakers["all_speakers"].map((speaker, index) => {
              return (
                <div
                  key={index}
                  className={classes.Card}
                  onClick={this.onCardClickHandler.bind(this, speaker.slug)}
                >
                  <div className={classes.CardImage}>
                    <CustomImage
                      src={speaker.image_url}
                      cssClass={classes.Image}
                      alt="card"
                    />
                  </div>
                  <div className={classes.Info}>
                    <h2 className={classes.CardName}>
                      <TextFormat
                        ellipsis={"..."}
                        charsAllowed={this.getCharsAllowed(70)}
                        className={classes.CardTitle}
                      >
                        {speaker.name}
                      </TextFormat>
                    </h2>
                    <p className={classes.CardTopic}>
                      <TextFormat
                        ellipsis={"..."}
                        charsAllowed={this.getCharsAllowed(50)}
                        className={classes.CardTitle}
                      >
                        {speaker.topic}
                      </TextFormat>
                    </p>
                    <p className={classes.CardTime}>
                      {speaker.date +
                        " " +
                        moment(speaker.time).format("HH:mm A")}
                    </p>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.onCardClickHandler.bind(this, speaker.slug)}
                  >
                    View Details
                  </Button>
                </div>
              );
            })
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <img style={{ width: "150px" }} src={Loader} alt="comming soon" />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.speaker.error,
    speakers: state.speaker.speakers,
    loading: state.speaker.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchSpeakers: (category, queryCriteria) =>
      dispatch(actions.fetchSpeakers(category, queryCriteria)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withToastManager(Speakers)));

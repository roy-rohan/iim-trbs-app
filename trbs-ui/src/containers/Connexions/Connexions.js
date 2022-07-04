import { Button } from "@material-ui/core";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { withToastManager } from "react-toast-notifications";
import Loader from "../../assets/images/loader.gif";
import CustomImage from "../../components/UI/CustomImage/CustomImage";
import TextFormat from "../../components/UI/TextFormat/TextFormat";
import * as actions from "../../store/actions/index";
import classes from "./Connexions.module.css";

class Connexions extends Component {
  getCharsAllowed = (factor) => {
    return window.innerWidth / factor;
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.onFetchCategories(
      JSON.stringify({
        filters: [
          { field_name: "e.type", value: this.props.category, op: "=" },
        ],
        filter_op: "",
        sort: [],
      })
    );
    this.props.onFetchConnexions(
      "all_connexions",
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
    let connextions =
      this.props.categories && this.props.connexions
        ? this.props.categories.map((category, index) => {
            return {
              category: category,
              data: this.props.connexions["all_connexions"].filter(
                (connextion) => connextion.type === category
              ),
            };
          })
        : [];
    return (
      <div className={classes.Connexions}>
        <div className={classes.PageHeaderWrapper}>
          <h1 className={classes.PageHeading}>Connexions</h1>
        </div>
        <div className={classes.ContentWrapper}>
          {connextions.map((connexion, index) => {
            return (
              <div className={classes.Section}>
                <h1 className={classes.SectionHeader}>{connexion.category}</h1>
                <div className={classes.ConnexionsRow}>
                  {connexion.data ? (
                    connexion.data.map((item, index) => (
                      <div
                        key={index}
                        className={classes.Card}
                        onClick={this.onCardClickHandler.bind(this, item.slug)}
                      >
                        <div className={classes.CardImage}>
                          <CustomImage
                            src={item.image_url}
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
                              {item.name}
                            </TextFormat>
                          </h2>
                          <p className={classes.CardTopic}>
                            <TextFormat
                              ellipsis={"..."}
                              charsAllowed={this.getCharsAllowed(50)}
                              className={classes.CardTitle}
                            >
                              {item.topic}
                            </TextFormat>
                          </p>
                          <p className={classes.CardTime}>
                            {item.date +
                              " " +
                              moment(item.time).format("HH:mm A")}
                          </p>
                        </div>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.onCardClickHandler.bind(
                            this,
                            item.slug
                          )}
                        >
                          View Details
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        style={{ width: "150px" }}
                        src={Loader}
                        alt="comming soon"
                      />
                    </div>
                  )}
                </div>
                <hr style={{ margin: "2rem" }} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.connexion.error,
    connexions: state.connexion.connexions,
    categories: state.connexion.categories,
    loading: state.connexion.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchCategories: () => dispatch(actions.fetchConnexionCategories()),
    onFetchConnexions: (category, queryCriteria) =>
      dispatch(actions.fetchConnexions(category, queryCriteria)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withToastManager(Connexions)));

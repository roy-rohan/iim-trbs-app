import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { withToastManager } from "react-toast-notifications";
import Loader from "../../assets/images/loader.gif";
import CustomImage from "../../components/UI/CustomImage/CustomImage";
import * as actions from "../../store/actions/index";
import classes from "./Sponsers.module.css";

class Sponsers extends Component {
  componentDidMount() {
    window.scrollTo(0, 1);
    this.props.onFetchCategories(
      JSON.stringify({
        filters: [
          { field_name: "e.type", value: this.props.category, op: "=" },
        ],
        filter_op: "",
        sort: [],
      })
    );
    this.props.onFetchSponsers(
      "all_sponsers",
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
  sponserClickHandler(item) {
    window.open(item.link, "_blank");
  }
  render() {
    let sponsers =
      this.props.categories && this.props.sponsers
        ? this.props.categories.map((category, index) => {
            return {
              category: category,
              data: this.props.sponsers["all_sponsers"].filter(
                (sponser) => sponser.type === category
              ),
            };
          })
        : [];
    return (
      <div className={classes.Sponsers}>
        <div className={classes.PageHeaderWrapper}>
          <h1 className={classes.PageHeading}>Sponsors</h1>
        </div>
        <div className={classes.ContentWrapper}>
          {sponsers.map((sponser, index) => {
            return (
              <div className={classes.Section}>
                <h1 className={classes.SectionHeader}>{sponser.category}</h1>
                <div className={classes.SponsersRow}>
                  {sponser.data ? (
                    sponser.data.map((item, index) => (
                      <div
                        key={index}
                        className={classes.Card}
                        onClick={this.sponserClickHandler.bind(this, item)}
                      >
                        <div className={classes.CardImage}>
                          <CustomImage
                            src={item.image_url}
                            cssClass={classes.Image}
                            alt="card"
                          />
                        </div>
                        <div className={classes.Info}>
                          <h2 className={classes.CardName}>{item.title}</h2>
                        </div>
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
    error: state.sponser.error,
    sponsers: state.sponser.sponsers,
    categories: state.sponser.categories,
    loading: state.sponser.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchCategories: () => dispatch(actions.fetchSponserCategories()),
    onFetchSponsers: (category, queryCriteria) =>
      dispatch(actions.fetchSponsers(category, queryCriteria)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withToastManager(Sponsers)));

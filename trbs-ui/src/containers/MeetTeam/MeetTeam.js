import React, { Component } from "react";
import * as classes from "./MeetTeam.module.css";
import CustomImage from "../../components/UI/CustomImage/CustomImage";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

class MeetTeam extends Component {
  state = {};
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.onFetchMembers(
      "all_members",
      JSON.stringify({
        filters: [{ field_name: "e.visible", value: 1, op: "=" }],
        filter_op: "",
        sort: [],
      })
    );
  }
  render() {
    console.log(this.props.members);
    return (
      <div>
        <h1 className={classes.PageHeader}>Meet the Team</h1>
        <div className={classes.MeetTeam}>
          {this.props.members
            ? this.props.members["all_members"].map((person, i) => {
                return (
                  <div className={classes.Card} key={i}>
                    <CustomImage
                      src={person.image_url}
                      cssClass={classes.Image}
                    />
                    <div className={classes.TextSection}>
                      <p className={classes.Name}>{person.name}</p>
                      <p className={classes.Designation}>
                        {person.designation}
                      </p>
                      {/* <p className={classes.EmailId}>{person.emailId}</p> */}
                    </div>
                  </div>
                );
              })
            : "Loading..."}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    members: state.member.members,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchMembers: (category, queryCriteria) =>
      dispatch(actions.fetchMembers(category, queryCriteria)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetTeam);

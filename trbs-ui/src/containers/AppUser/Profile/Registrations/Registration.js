import React, { Component } from "react";
import * as classes from "./Registration.module.css";
import axios from "../../../../axios-iim";
import { connect } from "react-redux";
import EventBookings from "./EventBookings/EventBookings";
import WorkshopBookings from "./WorkshopBookings/WorkshopBookings";
import SpeakerBookings from "./Speakerbookings/SpeakerBookings";
import InformalEventBookings from "./InformalEventBookings/InformalEventBookings";
class Registrations extends Component {
  state = {
    bookings: [],
    activeHeadeTab: "Events",
    tabs: ["Events", "Workshops", "Connexions", "Informal Events"],
  };

  componentDidMount() {
    axios
      .post(
        "/users/booking/read.php",
        JSON.stringify({
          filters: [
            {
              field_name: "user_id",
              value: this.props.user.app_user_id,
              op: "=",
            }, {
              field_name: "status",
              value: "initiated",
              op: "<>",
            }
          ],
          filter_op: "AND",
          sort: [
            {
              field_name: "product_type",
              op: "ASC",
            },
          ],
        })
      )
      .then((bookings) => {
        let updatedState = this.state;
        updatedState.bookings = bookings.data;
        this.setState({ updatedState });
      });
  }

  handleBasicHeaderTabClick(tab) {
    let updatedState = this.state;
    updatedState.activeHeadeTab = tab;
    this.setState({ updatedState });
  }

  render() {
    return (
      <div className={classes.Wrapper}>
        <div className={classes.TabHeader}>
          {this.state.tabs.map((tab, i) => {
            return (
              <div
                key={i}
                className={[
                  classes.Tab,
                  this.state.activeHeadeTab === tab
                    ? classes.ActiveTabItem
                    : null,
                ].join(" ")}
                onClick={() => this.handleBasicHeaderTabClick(tab)}
              >
                {tab}
              </div>
            );
          })}
        </div>
        <div className={classes.TabContentContainer}>
          <div
            className={classes.Registrations}
            style={{
              display:
                this.state.activeHeadeTab === "Events" ? "block" : "none",
            }}
          >
            <EventBookings data={this.state.bookings} />
          </div>
          <div
            className={classes.Accomodations}
            style={{
              display:
                this.state.activeHeadeTab === "Workshops" ? "block" : "none",
            }}
          >
            <WorkshopBookings data={this.state.bookings} />
          </div>
          <div
            className={classes.Certificates}
            style={{
              display:
                this.state.activeHeadeTab === "Connexions" ? "block" : "none",
            }}
          >
            <SpeakerBookings data={this.state.bookings} />
          </div>
          <div
            className={classes.Certificates}
            style={{
              display:
                this.state.activeHeadeTab === "Informal Events"
                  ? "block"
                  : "none",
            }}
          >
            <InformalEventBookings data={this.state.bookings} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(Registrations);

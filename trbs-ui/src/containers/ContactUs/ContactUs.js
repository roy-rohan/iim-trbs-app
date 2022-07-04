import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios-iim";
import Role from "../../components/Footer/Role/Role";
import ContactForm from "../../components/Form/ContactForm/ContactForm";
import * as actions from "../../store/actions/index";
import classes from "./Contact.module.css";

class ContactUs extends Component {
  state = {
    peopleInvolved: [],
  };
  componentDidMount() {
    axios
      .post(
        "/contact-role/read.php",
        JSON.stringify({
          filters: [],
          filter_op: "",
          sort: [],
        })
      )
      .then((res) => {
        const fetchedRoles = [];
        for (let key in res.data) {
          fetchedRoles.push({
            roleDesc: res.data[key].designation,
            contact_role_id: res.data[key].contact_role_id,
            inCharge: res.data[key].contact_people
              .filter((cp) => cp.visible === "1")
              .map((cp) => {
                return {
                  name: cp.poc,
                  email: cp.email,
                };
              }),
          });
        }
        this.setState({
          peopleInvolved: [...this.state.peopleInvolved, ...fetchedRoles],
        });
      });
    window.scrollTo(0, 0);
  }

  render() {
    let roles = this.state.peopleInvolved.map((role, i) => {
      return (
        <Role
          roleDesc={role.roleDesc}
          inCharge={role.inCharge}
          email={role.inCharge.email}
          key={i}
          styleType="Contact Us"
        />
      );
    });

    return (
      <div className={classes.ContactUs}>
        <div className={classes.PageHeaderWrapper}>
          <h1 className={classes.PageHeading}>Contact Us</h1>
        </div>
        <div className={classes.ContentWrapper}>
          <div className={classes.ContactLinks}>{roles}</div>
          <div className={classes.FormWrapper}>
            <ContactForm></ContactForm>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    contactPersons: state.contactPerson.contactPersons,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchContactPersons: (category, queryCriteria) =>
      dispatch(actions.fetchContactPersons(category, queryCriteria)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);

import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import classes from "./App.module.css";
import { AnimatePresence } from "framer-motion";
import * as actions from "./store/actions";

import AboutUs from "./containers/AboutUs/AboutUs";
import Connexions from "./containers/Connexions/Connexions";
import ContactUs from "./containers/ContactUs/ContactUs";
import EventDetail from "./containers/Events/EventDetail/EventDetail";
import Events from "./containers/Events/Events";
import Highlights from "./containers/Highlights/Highlights";
import Home from "./containers/Home/Home";
import InformalEvents from "./containers/InformalEvents/InformalEvents";
import Speakers from "./containers/Speakers/Speakers";
import Sponsers from "./containers/Sponsers/Sponsers";
import Workshops from "./containers/Workshops/Workshops";
import axios from "./axios-iim";

import Layout from "./hoc/Layout/Layout";
import Loader from "./assets/images/loader.gif";
import PageNotFound from "./containers/PageNotFound/PageNotFound";
import LoginForm from "./components/Form/LoginForm/LoginForm";
import RegisterForm from "./components/Form/RegisterForm/RegisterForm";
import UserActivation from "./containers/AppUser/UserActivation/UserActivation";
import { connect } from "react-redux";
import Profile from "./containers/AppUser/Profile/Profile";
import Logout from "./containers/Logout/Logout";
import Cart from "./containers/AppUser/Profile/Cart/Cart";
import PaymentHandler from "./containers/AppUser/PaymentHandler/PaymentHandler";
import OrderDetail from "./containers/AppUser/Profile/OrderDetail/OrderDetail";
import Strategizer from "./containers/Strategizer/Strategizer";
import Dashboard from "./containers/Admin/Dashboard/Dashboard";
import MeetTeam from "./containers/MeetTeam/MeetTeam";
import ForgotPassword from "./components/Form/ForgotPassword/ForgotPasswordForm";
import ValidatePasswordChangeLink from "./components/Form/ForgotPassword/ValidatePasswordChangeLink/ValidatePasswordChangeLink";
import SetNewPassword from "./components/Form/ForgotPassword/SetNewPassword/SetNewPassword";
import WorkshopDetail from "./containers/Workshops/WorkshopDetail/WorkshopDetail";
import InformalEventDetail from "./containers/InformalEvents/InformalEventDetail/InformalEventDetail";
import SpeakerDetail from "./containers/Speakers/SpeakerDetail/SpeakerDetail";
import ConnextionDetail from "./containers/Connexions/ConnexionDetail/ConnextionDetail";
import EditProfile from "./containers/AppUser/Profile/EditProfile/EditProfile";

class App extends Component {
  state = {
    loading: true,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);

    setInterval(() => {
      if (this.props.isAutenticated) {
        axios
          .post(
            "/users/verify_token.php",
            JSON.stringify({ token: this.props.token })
          )
          .then((tokenResponse) => {
            console.log("User session is active.");
          })
          .catch((error) => {
            alert("Session has expired. You will be logged out.");
            this.props.onLogout();
            window.location.href = "/login";
          });
      }
    }, 60000);
  }

  render() {
    let routes = [
      <Route key="/" path="/" exact component={Home} />,
      <Route key="/about" path="/about" exact component={AboutUs} />,
      <Route key="/events" path="/events" exact component={Events} />,
      <Route
        key="/events/:eventSlug"
        path={"/events/:eventSlug"}
        exact
        component={EventDetail}
      />,
      <Route
        key="/informal-events"
        path="/informal-events"
        exact
        component={InformalEvents}
      />,
      <Route
        key="/informal-events/:informalEventSlug"
        path={"/informal-events/:informalEventSlug"}
        exact
        component={InformalEventDetail}
      />,
      <Route key="/workshops" path="/workshops" exact component={Workshops} />,
      <Route
        key="/workshops/:workshopSlug"
        path={"/workshops/:workshopSlug"}
        exact
        component={WorkshopDetail}
      />,
      <Route key="/speakers" path="/speakers" exact component={Speakers} />,
      <Route
        key="/speakers/:speakerSlug"
        path={"/speakers/:speakerSlug"}
        exact
        component={SpeakerDetail}
      />,
      <Route
        key="/highlights"
        path="/highlights"
        exact
        component={Highlights}
      />,
      <Route
        key="/connexions"
        path="/connexions"
        exact
        component={Connexions}
      />,
      <Route
        key="/connexions/:connexionSlug"
        path={"/connexions/:connexionSlug"}
        exact
        component={ConnextionDetail}
      />,
      <Route key="/sponsers" path="/sponsers" exact component={Sponsers} />,
      <Route key="/meet-team" path="/meet-team" exact component={MeetTeam} />,
      <Route
        key="/contact-us"
        path="/contact-us"
        exact
        component={ContactUs}
      />,
      <Route
        key="/payment/paymentconfirmation"
        path="/payment/paymentconfirmation"
        component={PaymentHandler}
      />,
      <Route key="/login" path="/login" exact component={LoginForm} />,
      <Route key="/register" path="/register" exact component={RegisterForm} />,
      <Route
        key="/forgotPassword"
        path="/forgotPassword"
        exact
        component={ForgotPassword}
      />,
      <Route key="/vpcl" path="/vpcl" component={ValidatePasswordChangeLink} />,
      <Route
        key="/setNewPassword"
        path="/setNewPassword"
        exact
        component={SetNewPassword}
      />,
      <Route
        key="/strategizer"
        path="/strategizer"
        exact
        component={Strategizer}
      />,
      <Route
        key="/user/activate"
        path="/user/activate"
        component={UserActivation}
      />,
      <Route key="/*" path="*" component={PageNotFound} />,
    ];

    if (this.props.isAutenticated) {
      let authenticatedRoutes = [
        <Route key="/profile" path="/profile" exact component={Profile} />,
        <Route key="/profile/edit" path="/profile/edit" exact component={EditProfile} />,
        <Route key="/cart" path="/cart" exact component={Cart} />,
        <Route
        key="/orderdetail/:id"
        path="/orderdetail/:id"
        exact
        component={OrderDetail}
        />,
        <Route key="/logout" path="/logout" exact component={Logout} />,
      ];
      if(this.props.isAdmin) {
        authenticatedRoutes.push(<Route   key="/dashboard" path="/dashboard" component={Dashboard} />)
      }
      routes = [...authenticatedRoutes, ...routes];
    }
    
    return (
      <div className={classes.App}>
        {this.state.loading ? (
          <div className={classes.LoaderWrapper}>
            <img src={Loader} alt="loader" />
          </div>
        ) : (
          <Layout>
            <AnimatePresence>
              <Switch
                location={this.props.location}
                key={this.props.location.pathname}
              >
                {routes}
              </Switch>
            </AnimatePresence>
          </Layout>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAutenticated: state.auth.token !== null,
    isAdmin: state.auth?.user?.role === "admin",
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(actions.logout()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

import React, { Component } from "react";
import classes from "./Footer.module.css";
// import Role from "./Role/Role";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import axios from "../../axios-iim";

import FooterLogo from "../../assets/images/footer/iim-logo.png";
import { NavLink } from "react-router-dom";

mapboxgl.accessToken =
  "pk.eyJ1Ijoicm9oYW45NzIiLCJhIjoiY2twcGhnY2ZqMDEyczJwcXF4eTdnbjRmcSJ9.qZ5TCOsCovpFGsad5ZDc8g";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 72.53255572328,
      lat: 23.033954396625898,
      zoom: 14,
      roles: [],
    };
    this.mapContainer = React.createRef();
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    new mapboxgl.Map({
      container: this.mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    // Hide the mapbox attribution
    this.mapContainer.current.getElementsByClassName(
      "mapboxgl-control-container"
    )[0].style.display = "none";

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
            inCharge: res.data[key].contact_people.map((cp) => {
              return {
                name: cp.poc,
                email: cp.email,
              };
            }),
          });
        }
        this.setState({
          roles: [...this.state.roles, ...fetchedRoles],
        });
      });
  }

  mapClicked() {
    const coordinates = this.state.lat + "," + this.state.lng;
    const location =
      "https://www.google.com.sa/maps/search/" + coordinates + "?hl=en";
    window.open(location);
  }

  render() {
    // let roles = this.state.roles.map((role, i) => {
    //   return (
    //     <Role
    //       roleDesc={role.roleDesc}
    //       inCharge={role.inCharge}
    //       email={role.email}
    //       key={i}
    //       styleType="Footer"
    //     />
    //   );
    // });

    return (
      <footer
        style={{ display: this.props.displayStyle }}
        className={classes.Footer}
      >
        {/* <div className={classes.Roles}>{roles}</div> */}
        <div className={classes.LinksSection}>
          <div className={classes.FooterLinks}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/meet-team">Meet the team</NavLink>
            <NavLink to="/contact-us">Contact Us</NavLink>
          </div>
          <div className={classes.LocationGroup}>
            <img src={FooterLogo} alt="footer-logo" />
            <p className={classes.TextHead}>Getting There</p>
            <p className={classes.TextDesc}>
              Address: Vastrapur, Ahmedabad, Gujarat 380015
            </p>
            <div
              onClick={this.mapClicked.bind(this)}
              ref={this.mapContainer}
              className={classes.Map}
            ></div>
          </div>
        </div>
      </footer>
    );
  }
}
export default Footer;

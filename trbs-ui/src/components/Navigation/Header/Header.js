import React, { Component } from "react";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import HamburgerMenu from "../HamburgerMenu/HamburgerMenu";

import classes from "./Header.module.css";

class Header extends Component {
  state = {
    navOpen: false,
  };

  componentDidMount() {
    this.toggleNavbarOnPageResize();
    window.addEventListener("resize", this.toggleNavbarOnPageResize.bind(this));
  }

  toggleNavbarOnPageResize() {
    if (window.innerWidth >= this.props.mobileViewportWidth) {
      this.setState({ navOpen: true });
      this.props.toggleContent(true);
    } else {
      this.setState({ navOpen: false });
    }
  }

  toggleNavbar = () => {
    let updatedState = { navOpen: !this.state.navOpen };
    this.setState(updatedState);
    this.props.toggleContent(this.state.navOpen);
  };

  closeNavbar = () => {
    if (window.innerWidth <= this.props.mobileViewportWidth) {
      this.setState({ navOpen: false });
      this.props.toggleContent(true);
    }
  };
  render() {
    return (
      <header className={classes.Header}>
        <Logo></Logo>
        <NavigationItems
          isNavOpen={this.state.navOpen}
          closeNav={() => this.closeNavbar()}
        ></NavigationItems>
        <HamburgerMenu
          isNavOpen={this.state.navOpen}
          toggleMenu={() => this.toggleNavbar()}
        ></HamburgerMenu>
        <div style={{ display: "none" }}>{this.props.messageType}</div>
      </header>
    );
  }
}

export default Header;

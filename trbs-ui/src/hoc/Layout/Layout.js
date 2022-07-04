import React, { Component, Fragment } from "react";
import { ToastProvider } from "react-toast-notifications";
import Footer from "../../components/Footer/Footer";
import Messenger from "../../components/Messenger/Messenger";
import Header from "../../components/Navigation/Header/Header";

class Layout extends Component {
  state = {
    showContent: true,
  };

  toggleMainContent(flag) {
    this.setState((prevState) => ({
      showContent: flag === undefined ? !prevState.showContent : flag,
    }));
  }

  render() {
    const mobileViewportWidth = 768;
    return (
      <Fragment>
        <ToastProvider>
          <Header
            mobileViewportWidth={mobileViewportWidth}
            toggleContent={this.toggleMainContent.bind(this)}
          />
          <Messenger />
          <main style={{ display: this.state.showContent ? "block" : "none" }}>
            {this.props.children}
          </main>
          <Footer displayStyle={this.state.showContent ? "block" : "none"} />
        </ToastProvider>
      </Fragment>
    );
  }
}

export default Layout;

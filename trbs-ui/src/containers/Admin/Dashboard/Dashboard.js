import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  withStyles
} from "@material-ui/core";
import {
  Add,
  ArrowUpward, Assessment, BrandingWatermark, CastConnectedTwoTone, ContactSupport, DashboardOutlined, DeveloperBoard, Event, EventAvailable, ExpandLess,
  ExpandMore, GroupSharp, ListAlt, LocalOffer, Mic, Web
} from "@material-ui/icons";
import ListAltIcon from "@material-ui/icons/ListAlt";
import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import ListLink from "../../../components/UI/ListLink/ListLink";
import EditAboutPage from "./AboutUsPage/EditAboutPage";
import BookingsReport from "./Bookings/BookingsReport";
import AddCollege from "./Colleges/AddCollege/AddCollege";
import CollegeSummary from "./Colleges/CollegeSummary/CollegeSummary";
import EditCollege from "./Colleges/EditCollege/EditCollege";
import AddConnexion from "./Connexions/AddConnexion/AddConnexion";
import ConnexionSummary from "./Connexions/ConnexionSummary/ConnexionSummary";
import EditConnexion from "./Connexions/EditConnexion/EditConnexion";
import AddContactPerson from "./ContactPerson/AddContactPerson/AddContactPerson";
import ContactPersonSummary from "./ContactPerson/ContactPersonSummary/ContactPersonSummary";
import EditContactPerson from "./ContactPerson/EditContactPerson/EditContactPerson";
import AddContactRole from "./ContactRole/AddContactRole/AddContactRole";
import ContactRoleSummary from "./ContactRole/ContactRoleSummary/ContactRoleSummary";
import AddCoupon from "./Coupons/AddCoupon/AddCoupon";
import CouponSummary from "./Coupons/CouponSummary/CouponSummary";
import cssClasses from "./Dashboard.module.css";
import AddEvent from "./Events/AddEvent/AddEvent";
import EditEvent from "./Events/EditEvent/EditEvent";
import EventSummary from "./Events/EventSummary/EventSummary";
import EditHomePage from "./HomePage/EditHomePage";
import AddHomePageSlider from "./HomePageSlider/AddHomePageSlider/AddHomePageSlider";
import EditHomePageSlider from "./HomePageSlider/EditHomePageSlider/EditHomePageSlider";
import HomePageSliderSummary from "./HomePageSlider/HomePageSliderSummary/HomePageSliderSummary";
import AddInformalEvent from "./InformalEvents/AddInformalEvent/AddInformalEvent";
import EditInformalEvent from "./InformalEvents/EditInformalEvent/EditInformalEvent";
import InformalEventSummary from "./InformalEvents/InformalEventSummary/InformalEventSummary";
import AddMember from "./Members/AddMember/AddMember";
import EditMember from "./Members/EditMember/EditMember";
import MemberSummary from "./Members/MemberSummary/MemberSummary";
import PaymentsReport from "./Payments/PaymentsReport";
import RegistrationsReport from "./Registrations/RegistrationsReport";
import AddSpeaker from "./Speakers/AddSpeaker/AddSpeaker";
import EditSpeaker from "./Speakers/EditSpeaker/EditSpeaker";
import SpeakerSummary from "./Speakers/SpeakerSummary/SpeakerSummary";
import AddSponser from "./Sponsers/AddSponser/AddSponser";
import EditSponser from "./Sponsers/EditSponser/EditSponser";
import SponserSummary from "./Sponsers/SponserSummary/SponserSummary";
import AddStrategizer from "./Strategizer/AddStrategizer/AddStrategizer";
import EditStrategizer from "./Strategizer/EditStrategizer/EditStrategizer";
import StrategizerSummary from "./Strategizer/StrategizerSummary/StrategizerSummary";
import AddWorkshop from "./Workshops/AddWorkshop/AddWorkshop";
import EditWorkshop from "./Workshops/EditWorkshop/EditWorkshop";
import WorkshopSummary from "./Workshops/WorkshopSummary/WorkshopSummary";
import AddCertificate from "./Certificate/AddCertificate/AddCertificate";
import CertificateSummary from "./Certificate/CertificateSummary/CertificateSummary";
import EditCertificate from "./Certificate/EditCertificate/EditCertificate";
import SendCertificate from "./Certificate/SendCertificate/SendCertificate";

class Dashboard extends Component {
  state = {
    eventsMenu: false,
    workshopsMenu: false,
    informalEventsMenu: false,
    speakersMenu: false,
    connexionsMenu: false,
    strategizerMenu: false,
    sponsersMenu: false,
    membersMenu: false,
    reportsMenu: false,
    couponsMenu: false,
    collegeMenu: false,
    certificateMenu: false,
    contactPersonsMenu: false,
    contentMenu: false,
    hideSidebar: true,
    sidebarClasses: [cssClasses.List, cssClasses.HideSidebarText],
  };

  toggleCollapse(component) {
    this.setState((prevState) => {
      return { ...prevState, [component]: !prevState[component] };
    });
  }

  toggleSidebar() {
    let modifiedSidebarClasses = [...this.state.sidebarClasses];
    if (this.state.hideSidebar) {
      modifiedSidebarClasses = [cssClasses.List];
    } else {
      modifiedSidebarClasses.push(cssClasses.HideSidebarText);
    }
    this.setState((prevState) => {
      return {
        ...prevState,
        hideSidebar: !prevState.hideSidebar,
        sidebarClasses: modifiedSidebarClasses,
      };
    });
  }

  render() {
    const list = () => (
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={this.state.sidebarClasses.join(" ")}
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            className={cssClasses.ListHead}
          >
            <DashboardOutlined onClick={() => this.toggleSidebar()} />
            <p>Dashboard</p>
          </ListSubheader>
        }
      >
        <div className={cssClasses.ListItemWrapper}>
          <ListItem
            className={cssClasses.ListItem}
            onClick={() => this.toggleCollapse("eventsMenu")}
          >
            <ListItemIcon className={cssClasses.MenuIcon}>
              <Event />
            </ListItemIcon>
            <ListItemText className={cssClasses.MenuText} primary="Events" />
            {this.state.eventsMenu ? (
              <ExpandLess className={cssClasses.MenuArrow} />
            ) : (
              <ExpandMore className={cssClasses.MenuArrow} />
            )}
          </ListItem>
          <Collapse in={this.state.eventsMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListLink to="/dashboard/addEvent" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <Add />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Add Event"
                />
              </ListLink>
              <ListLink to="/dashboard/eventSummary" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Event Summary"
                />
              </ListLink>
            </List>
          </Collapse>
          <ListItem
            className={cssClasses.ListItem}
            onClick={() => this.toggleCollapse("workshopsMenu")}
          >
            <ListItemIcon className={cssClasses.MenuIcon}>
              <DeveloperBoard />
            </ListItemIcon>
            <ListItemText className={cssClasses.MenuText} primary="Workshops" />
            {this.state.workshopsMenu ? (
              <ExpandLess className={cssClasses.MenuArrow} />
            ) : (
              <ExpandMore className={cssClasses.MenuArrow} />
            )}
          </ListItem>
          <Collapse in={this.state.workshopsMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListLink to="/dashboard/addWorkshop" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <Add />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Add Workshop"
                />
              </ListLink>
              <ListLink to="/dashboard/workshopSummary" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Workshop Summary"
                />
              </ListLink>
            </List>
          </Collapse>
          <ListItem
            className={cssClasses.ListItem}
            onClick={() => this.toggleCollapse("informalEventsMenu")}
          >
            <ListItemIcon className={cssClasses.MenuIcon}>
              <EventAvailable />
            </ListItemIcon>
            <ListItemText
              className={cssClasses.MenuText}
              primary="Informal Events"
            />
            {this.state.informalEventsMenu ? (
              <ExpandLess className={cssClasses.MenuArrow} />
            ) : (
              <ExpandMore className={cssClasses.MenuArrow} />
            )}
          </ListItem>
          <Collapse
            in={this.state.informalEventsMenu}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              <ListLink to="/dashboard/addInformalEvent" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <Add />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Add Informal Events"
                />
              </ListLink>
              <ListLink to="/dashboard/informalEventSummary" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Informal Events Summary"
                />
              </ListLink>
            </List>
          </Collapse>
          <ListItem
            className={cssClasses.ListItem}
            onClick={() => this.toggleCollapse("speakersMenu")}
          >
            <ListItemIcon className={cssClasses.MenuIcon}>
              <Mic />
            </ListItemIcon>
            <ListItemText className={cssClasses.MenuText} primary="Speakers" />
            {this.state.speakersMenu ? (
              <ExpandLess className={cssClasses.MenuArrow} />
            ) : (
              <ExpandMore className={cssClasses.MenuArrow} />
            )}
          </ListItem>
          <Collapse in={this.state.speakersMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListLink to="/dashboard/addSpeaker" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <Add />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Add Speaker"
                />
              </ListLink>
              <ListLink to="/dashboard/speakerSummary" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Speaker Summary"
                />
              </ListLink>
            </List>
          </Collapse>
          <ListItem
            className={cssClasses.ListItem}
            onClick={() => this.toggleCollapse("connexionsMenu")}
          >
            <ListItemIcon className={cssClasses.MenuIcon}>
              <CastConnectedTwoTone />
            </ListItemIcon>
            <ListItemText
              className={cssClasses.MenuText}
              primary="Connexions"
            />
            {this.state.connexionsMenu ? (
              <ExpandLess className={cssClasses.MenuArrow} />
            ) : (
              <ExpandMore className={cssClasses.MenuArrow} />
            )}
          </ListItem>
          <Collapse in={this.state.connexionsMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListLink to="/dashboard/addConnexion" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <Add />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Add Connexion"
                />
              </ListLink>
              <ListLink to="/dashboard/connexionSummary" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Connexion Summary"
                />
              </ListLink>
            </List>
          </Collapse>
          <ListItem
            className={cssClasses.ListItem}
            onClick={() => this.toggleCollapse("strategizerMenu")}
          >
            <ListItemIcon className={cssClasses.MenuIcon}>
              <ArrowUpward />
            </ListItemIcon>
            <ListItemText
              className={cssClasses.MenuText}
              primary="Strategizers"
            />
            {this.state.strategizerMenu ? (
              <ExpandLess className={cssClasses.MenuArrow} />
            ) : (
              <ExpandMore className={cssClasses.MenuArrow} />
            )}
          </ListItem>
          <Collapse
            in={this.state.strategizerMenu}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              <ListLink to="/dashboard/addStrategizer" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <Add />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Add Strategizer"
                />
              </ListLink>
              <ListLink to="/dashboard/strategizerSummary" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Strategizer Summary"
                />
              </ListLink>
            </List>
          </Collapse>
          <ListItem
            className={cssClasses.ListItem}
            onClick={() => this.toggleCollapse("sponsersMenu")}
          >
            <ListItemIcon className={cssClasses.MenuIcon}>
              <BrandingWatermark />
            </ListItemIcon>
            <ListItemText className={cssClasses.MenuText} primary="Sponsors" />
            {this.state.sponsersMenu ? (
              <ExpandLess className={cssClasses.MenuArrow} />
            ) : (
              <ExpandMore className={cssClasses.MenuArrow} />
            )}
          </ListItem>
          <Collapse in={this.state.sponsersMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListLink to="/dashboard/addSponser" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <Add />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Add Sponsor"
                />
              </ListLink>
              <ListLink to="/dashboard/sponserSummary" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Sponsor Summary"
                />
              </ListLink>
            </List>
          </Collapse>
          <ListItem
            className={cssClasses.ListItem}
            onClick={() => this.toggleCollapse("membersMenu")}
          >
            <ListItemIcon className={cssClasses.MenuIcon}>
              <GroupSharp />
            </ListItemIcon>
            <ListItemText className={cssClasses.MenuText} primary="Team" />
            {this.state.membersMenu ? (
              <ExpandLess className={cssClasses.MenuArrow} />
            ) : (
              <ExpandMore className={cssClasses.MenuArrow} />
            )}
          </ListItem>
          <Collapse in={this.state.membersMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListLink to="/dashboard/addMember" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <Add />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Add Member"
                />
              </ListLink>
              <ListLink to="/dashboard/memberSummary" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Member Summary"
                />
              </ListLink>
            </List>
          </Collapse>
          <ListItem
            className={cssClasses.ListItem}
            onClick={() => this.toggleCollapse("reportsMenu")}
          >
            <ListItemIcon className={cssClasses.MenuIcon}>
              <Assessment />
            </ListItemIcon>
            <ListItemText className={cssClasses.MenuText} primary="Reports" />
            {this.state.reportsMenu ? (
              <ExpandLess className={cssClasses.MenuArrow} />
            ) : (
              <ExpandMore className={cssClasses.MenuArrow} />
            )}
          </ListItem>
          <Collapse in={this.state.reportsMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListLink to="/dashboard/bookingsReport" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Bookings"
                />
              </ListLink>
              <ListLink to="/dashboard/paymentsReport" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Payments"
                />
              </ListLink>
              <ListLink to="/dashboard/registrationsReport" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Registration"
                />
              </ListLink>
            </List>
          </Collapse>
          <ListItem
            className={cssClasses.ListItem}
            onClick={() => this.toggleCollapse("couponsMenu")}
          >
            <ListItemIcon className={cssClasses.MenuIcon}>
              <LocalOffer />
            </ListItemIcon>
            <ListItemText className={cssClasses.MenuText} primary="Coupons" />
            {this.state.couponsMenu ? (
              <ExpandLess className={cssClasses.MenuArrow} />
            ) : (
              <ExpandMore className={cssClasses.MenuArrow} />
            )}
          </ListItem>
          <Collapse in={this.state.couponsMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListLink to="/dashboard/addCoupon" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Add Coupon"
                />
              </ListLink>
              <ListLink to="/dashboard/couponsSummary" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Coupons Summary"
                />
              </ListLink>
            </List>
          </Collapse>
          <ListItem
            className={cssClasses.ListItem}
            onClick={() => this.toggleCollapse("collegeMenu")}
          >
            <ListItemIcon className={cssClasses.MenuIcon}>
              <LocalOffer />
            </ListItemIcon>
            <ListItemText className={cssClasses.MenuText} primary="College" />
            {this.state.collegeMenu ? (
              <ExpandLess className={cssClasses.MenuArrow} />
            ) : (
              <ExpandMore className={cssClasses.MenuArrow} />
            )}
          </ListItem>
          <Collapse in={this.state.collegeMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListLink to="/dashboard/addCollege" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Add College"
                />
              </ListLink>
              <ListLink to="/dashboard/collegesSummary" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="College Summary"
                />
              </ListLink>
            </List>
          </Collapse>
          <ListItem
            className={cssClasses.ListItem}
            onClick={() => this.toggleCollapse("contactPersonsMenu")}
          >
            <ListItemIcon className={cssClasses.MenuIcon}>
              <ContactSupport />
            </ListItemIcon>
            <ListItemText
              className={cssClasses.MenuText}
              primary="Contact Person"
            />
            {this.state.contactPersonsMenu ? (
              <ExpandLess className={cssClasses.MenuArrow} />
            ) : (
              <ExpandMore className={cssClasses.MenuArrow} />
            )}
          </ListItem>
          <Collapse
            in={this.state.contactPersonsMenu}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              <ListLink to="/dashboard/addContactPerson" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Add Contact Person"
                />
              </ListLink>
              <ListLink to="/dashboard/contactPersonSummary" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Contact Person Summary"
                />
              </ListLink>
              <ListLink to="/dashboard/contactRoleSummary" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Contact Roles"
                />
              </ListLink>
              <ListLink to="/dashboard/addContactRole" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Add Contact Role"
                />
              </ListLink>
            </List>
          </Collapse>
          <ListItem
            className={cssClasses.ListItem}
            onClick = {
              () => this.toggleCollapse("certificateMenu")
            }
          >
            <ListItemIcon className={cssClasses.MenuIcon}>
              <LocalOffer />
            </ListItemIcon>
            <ListItemText className={cssClasses.MenuText} primary="Certificates" />
            {this.state.certificateMenu ? (
              <ExpandLess className={cssClasses.MenuArrow} />
            ) : (
              <ExpandMore className={cssClasses.MenuArrow} />
            )}
          </ListItem>
          < Collapse in = {
            this.state.certificateMenu
          }
          timeout = "auto"
          unmountOnExit >
            <List component="div" disablePadding>
              <ListLink to="/dashboard/addCertificate" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary = "Add Certificate"
                />
              </ListLink>
              <ListLink to="/dashboard/certificateSummary" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary = "Certificates Summary"
                />
              </ListLink>
              <ListLink to = "/dashboard/sendCertificate"
              button >
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary = "Send Certificates"
                />
              </ListLink>
            </List>
          </Collapse>
          <ListItem
            className={cssClasses.ListItem}
            onClick={() => this.toggleCollapse("contentMenu")}
          >
            <ListItemIcon className={cssClasses.MenuIcon}>
              <Web />
            </ListItemIcon>
            <ListItemText
              className={cssClasses.MenuText}
              primary="Page Content"
            />
            {this.state.contentMenu ? (
              <ExpandLess className={cssClasses.MenuArrow} />
            ) : (
              <ExpandMore className={cssClasses.MenuArrow} />
            )}
          </ListItem>
          <Collapse in={this.state.contentMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListLink to="/dashboard/editHomePage" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Edit Home Page"
                />
              </ListLink>
              <ListLink to="/dashboard/editAboutPage" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Edit About Page"
                />
              </ListLink>
              <ListLink to="/dashboard/addSliderImage" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Add Slider Image"
                />
              </ListLink>
              <ListLink to="/dashboard/sliderImageSummary" button>
                <ListItemIcon className={cssClasses.MenuIcon}>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText
                  className={cssClasses.MenuText}
                  primary="Show Slider Images"
                />
              </ListLink>
            </List>
          </Collapse>
        </div>
      </List>
    );
    return (
      <div className={cssClasses.Dashboard}>
        <div className={cssClasses.Sidebar}>{list()}</div>
        <div className={cssClasses.DashboardContent}>
          <Switch>
            <Route path="/dashboard/addEvent" component={AddEvent}></Route>
            <Route path="/dashboard/editEvent" component={EditEvent}></Route>
            <Route
              path="/dashboard/eventSummary"
              exact
              component={EventSummary}
            ></Route>
            <Route
              path="/dashboard/addWorkshop"
              component={AddWorkshop}
            ></Route>
            <Route
              path="/dashboard/editWorkshop"
              component={EditWorkshop}
            ></Route>
            <Route
              path="/dashboard/workshopSummary"
              exact
              component={WorkshopSummary}
            ></Route>
            <Route
              path="/dashboard/addInformalEvent"
              component={AddInformalEvent}
            ></Route>
            <Route
              path="/dashboard/editInformalEvent"
              component={EditInformalEvent}
            ></Route>
            <Route
              path="/dashboard/informalEventSummary"
              exact
              component={InformalEventSummary}
            ></Route>
            <Route path="/dashboard/addSpeaker" component={AddSpeaker}></Route>
            <Route
              path="/dashboard/editSpeaker"
              component={EditSpeaker}
            ></Route>
            <Route
              path="/dashboard/speakerSummary"
              exact
              component={SpeakerSummary}
            ></Route>
            <Route
              path="/dashboard/addConnexion"
              component={AddConnexion}
            ></Route>
            <Route
              path="/dashboard/editConnexion"
              component={EditConnexion}
            ></Route>
            <Route
              path="/dashboard/connexionSummary"
              exact
              component={ConnexionSummary}
            ></Route>
            <Route
              path="/dashboard/addStrategizer"
              component={AddStrategizer}
            ></Route>
            <Route
              path="/dashboard/editStrategizer"
              component={EditStrategizer}
            ></Route>
            <Route
              path="/dashboard/strategizerSummary"
              exact
              component={StrategizerSummary}
            ></Route>
            <Route path="/dashboard/addSponser" component={AddSponser}></Route>
            <Route
              path="/dashboard/editSponser"
              component={EditSponser}
            ></Route>
            <Route
              path="/dashboard/sponserSummary"
              exact
              component={SponserSummary}
            ></Route>
            <Route path="/dashboard/addMember" component={AddMember}></Route>
            <Route path="/dashboard/editMember" component={EditMember}></Route>
            <Route
              path="/dashboard/memberSummary"
              exact
              component={MemberSummary}
            ></Route>
            <Route
              path="/dashboard/bookingsReport"
              exact
              component={BookingsReport}
            ></Route>
            <Route
              path="/dashboard/paymentsReport"
              exact
              component={PaymentsReport}
            ></Route>
            <Route
              path="/dashboard/registrationsReport"
              exact
              component={RegistrationsReport}
            ></Route>
            <Route
              path="/dashboard/addCoupon"
              exact
              component={AddCoupon}
            ></Route>
            <Route
              path="/dashboard/couponsSummary"
              exact
              component={CouponSummary}
            ></Route>
            <Route
              path="/dashboard/addCertificate"
              exact
              component = {
                AddCertificate
              }
            ></Route>
            <Route
              path = "/dashboard/certificateSummary"
              exact
              component={CertificateSummary}
            ></Route>
            <Route
              path = "/dashboard/editCertificate"
              exact
              component={EditCertificate}
            ></Route>
            <Route
              path = "/dashboard/sendCertificate"
              exact
              component={SendCertificate}
            ></Route>
            <Route path="/dashboard/addCollege" component={AddCollege}></Route>
            <Route
              path="/dashboard/editCollege"
              component={EditCollege}
            ></Route>
            <Route
              path="/dashboard/collegesSummary"
              component={CollegeSummary}
            ></Route>
            <Route
              path="/dashboard/addContactPerson"
              exact
              component={AddContactPerson}
            ></Route>
            <Route
              path="/dashboard/contactPersonSummary"
              exact
              component={ContactPersonSummary}
            ></Route>
            <Route
              path="/dashboard/editContactPerson"
              component={EditContactPerson}
            ></Route>
            <Route
              path="/dashboard/contactRoleSummary"
              exact
              component={ContactRoleSummary}
            ></Route>
            <Route
              path="/dashboard/addContactRole"
              component={AddContactRole}
            ></Route>
            <Route
              path="/dashboard/editHomePage"
              component={EditHomePage}
            ></Route>
            <Route
              path="/dashboard/editAboutPage"
              component={EditAboutPage}
            ></Route>
            <Route
              path="/dashboard/addSliderImage"
              component={AddHomePageSlider}
            ></Route>
            <Route
              path="/dashboard/sliderImageSummary"
              component={HomePageSliderSummary}
            ></Route>
            <Route
              path="/dashboard/editSliderImage"
              component={EditHomePageSlider}
            ></Route>
          </Switch>
        </div>
      </div>
    );
  }
}
export default withStyles(null, { withTheme: true })(Dashboard);

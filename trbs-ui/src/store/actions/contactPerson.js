import { sendMessage } from ".";
import axios from "../../axios-iim";
import * as actionTypes from "./actionTypes";
import { startLoading, stopLoading } from "./common";

export const addContactPersonSuccess = (category, contactPersons) => {
  return {
    type: actionTypes.ADD_CONTACT_PERSON_SUCCESS,
    contactPersons: contactPersons,
    category: category,
  };
};

export const addContactPersonFail = (error) => {
  return {
    type: actionTypes.ADD_CONTACT_PERSON_FAIL,
    error: error,
  };
};

export const addContactPersonStart = () => {
  return {
    type: actionTypes.ADD_CONTACT_PERSON_START,
  };
};

export const fetchContactPersonSuccess = (category, contactPersons) => {
  return {
    type: actionTypes.FETCH_CONTACT_PERSON_SUCCESS,
    contactPersons: contactPersons,
    category: category,
  };
};

export const fetchContactPersonFail = (error) => {
  return {
    type: actionTypes.FETCH_CONTACT_PERSON_FAIL,
    error: error,
  };
};

export const fetchContactPersonStart = () => {
  return {
    type: actionTypes.FETCH_CONTACT_PERSON_START,
  };
};

export const fetchContactPersons = (category, queryCriteria) => {
  return (dispatch) => {
    dispatch(fetchContactPersonStart());
    const queryParams = "";
    axios
      .post("/contact-person/read.php" + queryParams, queryCriteria)
      .then((res) => {
        const fetchedContactPersons = [];
        for (let key in res.data) {
          fetchedContactPersons.push({
            ...res.data[key],
            id: key,
          });
        }
        dispatch(fetchContactPersonSuccess(category, fetchedContactPersons));
      })
      .catch((err) => {
        dispatch(fetchContactPersonFail(err));
      });
  };
};

export const addContactPerson = (contactPerson, cb) => {
  return (dispatch) => {
    dispatch(addContactPersonStart());

    let contactPersonData = {
      contact_role_id: contactPerson.contact_role_id,
      poc: contactPerson.poc,
      email: contactPerson.email,
      visible: contactPerson.visible,
    };
    dispatch(startLoading());
    axios
      .post("/contact-person/create.php", JSON.stringify(contactPersonData))
      .then((response) => {
        cb(response.data.id);
      })
      .catch((error) => {
        dispatch(stopLoading());
      });
  };
};

export const editContactPerson = (contactPerson, cb) => {
  return (dispatch) => {
    dispatch(addContactPersonStart());

    let contactPersonData = {
      contact_person_id: contactPerson.contact_person_id,
      contact_role_id: contactPerson.contact_role_id,
      poc: contactPerson.poc,
      email: contactPerson.email,
      visible: +contactPerson.visible,
    };
    dispatch(startLoading());
    axios
      .post("/contact-person/update.php", JSON.stringify(contactPersonData))
      .then((response) => {
        cb();
      })
      .catch((error) => {
        dispatch(stopLoading());
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

export const deleteContactPerson = (contactPersonId) => {
  return (dispatch) => {
    axios
      .post(
        "/contact-person/delete.php",
        JSON.stringify({ contact_person_id: contactPersonId })
      )
      .then((response) => {
        dispatch(sendMessage("ContactPerson Deleted", "success"));
        setTimeout(() => {
          window.location.href = "/dashboard/contactPersonSummary";
        }, 1000);
      })
      .catch((error) => {
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

export const addContactRole = (contactRole, cb) => {
  return (dispatch) => {
    dispatch(addContactPersonStart());

    let contactRoleData = {
      designation: contactRole.designation,
      priority: contactRole.priority,
    };
    dispatch(startLoading());
    axios
      .post("/contact-role/create.php", JSON.stringify(contactRoleData))
      .then((response) => {
        cb(response.data.id);
      })
      .catch((error) => {
        dispatch(stopLoading());
      });
  };
};

export const deleteContactRole = (contactRoleId) => {
  return (dispatch) => {
    axios
      .post(
        "/contact-role/delete.php",
        JSON.stringify({ contact_role_id: contactRoleId })
      )
      .then((response) => {
        dispatch(sendMessage("Contact Role Deleted", "success"));
        setTimeout(() => {
          window.location.href = "/dashboard/contactRoleSummary";
        }, 1000);
      })
      .catch((error) => {
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

export const editHomePage = (homePage, cb) => {
  return (dispatch) => {
    let homePageData = {
      home_page_id: homePage.home_page_id,
      about: homePage.about,
      event_count: homePage.event_count,
      workshop_count: homePage.workshop_count,
      speaker_count: homePage.speaker_count,
      panel_disc_count: homePage.panel_disc_count,
      mng_symp_count: homePage.mng_symp_count,
      video_link: homePage.video_link,
    };
    dispatch(startLoading());
    axios
      .post("/content/home-page/update.php", JSON.stringify(homePageData))
      .then((response) => {
        cb();
      })
      .catch((error) => {
        dispatch(stopLoading());
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

export const editAboutPage = (aboutPage, cb) => {
  return (dispatch) => {
    let aboutPageData = {
      about_page_id: aboutPage.about_page_id,
      about: aboutPage.about,
      event_desc: aboutPage.event_desc,
      workshop_desc: aboutPage.workshop_desc,
      speaker_desc: aboutPage.speaker_desc,
      video_link: aboutPage.video_link,
    };
    dispatch(startLoading());
    axios
      .post("/content/about-page/update.php", JSON.stringify(aboutPageData))
      .then((response) => {
        cb();
      })
      .catch((error) => {
        dispatch(stopLoading());
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

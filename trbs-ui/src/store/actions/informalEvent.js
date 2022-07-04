import moment from "moment";
import { sendMessage } from ".";
import axios from "../../axios-iim";
import * as actionTypes from "./actionTypes";
import { createSlug, startLoading, stopLoading } from "./common";

export const addInformalEventSuccess = (category, events) => {
  return {
    type: actionTypes.ADD_INFORMAL_EVENTS_SUCCESS,
    events: events,
    category: category,
  };
};

export const addInformalEventFail = (error) => {
  return {
    type: actionTypes.ADD_INFORMAL_EVENTS_FAIL,
    error: error,
  };
};

export const addInformalEventStart = () => {
  return {
    type: actionTypes.ADD_INFORMAL_EVENTS_START,
  };
};

export const fetchInformalEventSuccess = (category, informalEvents) => {
  return {
    type: actionTypes.FETCH_INFORMAL_EVENTS_SUCCESS,
    informalEvents: informalEvents,
    category: category,
  };
};

export const fetchInformalEventFail = (error) => {
  return {
    type: actionTypes.FETCH_INFORMAL_EVENTS_FAIL,
    error: error,
  };
};

export const fetchInformalEventStart = () => {
  return {
    type: actionTypes.FETCH_INFORMAL_EVENTS_START,
  };
};

export const fetchCategoriesSuccess = (categories) => {
  return {
    type: actionTypes.FETCH_INFORMAL_EVENTS_CATEGORIES_SUCCESS,
    categories: categories,
  };
};

export const fetchCategoriesStart = () => {
  return {
    type: actionTypes.FETCH_INFORMAL_EVENTS_CATEGORIES_START,
  };
};

export const fetchCategoriesFail = (error) => {
  return {
    type: actionTypes.FETCH_INFORMAL_EVENTS_CATEGORIES_FAIL,
    error: error,
  };
};

export const fetchInformalEventCategories = () => {
  return (dispatch) => {
    dispatch(fetchCategoriesStart());
    axios
      .get("/informal-events/read-category.php")
      .then((res) => {
        const fetchedCategories = [];
        for (let category in res.data) {
          fetchedCategories.push(res.data[category]);
        }
        dispatch(fetchCategoriesSuccess(fetchedCategories));
      })
      .catch((err) => {
        dispatch(fetchCategoriesFail(err));
      });
  };
};

export const fetchInformalEvents = (category, queryCriteria) => {
  return (dispatch) => {
    dispatch(fetchInformalEventStart());
    const queryParams = "";
    axios
      .post("/informal-events/read.php" + queryParams, queryCriteria)
      .then((res) => {
        const fetchedInformalEvents = [];
        for (let key in res.data) {
          fetchedInformalEvents.push({
            ...res.data[key],
            id: key,
          });
        }
        dispatch(fetchInformalEventSuccess(category, fetchedInformalEvents));
      })
      .catch((err) => {
        dispatch(fetchInformalEventFail(err));
      });
  };
};

export const addInformalEvent = (informalEvent, cb) => {
  return (dispatch) => {
    dispatch(addInformalEventStart());

    let workshopData = {
      title: informalEvent.title,
      type: informalEvent.type,
      slug: createSlug(informalEvent.slug),
      short_description: informalEvent.short_description,
      full_description: informalEvent.full_description,
      organizer: informalEvent.organizer,
      duration: informalEvent.duration,
      event_date: moment(informalEvent.event_date).format("YYYY-MM-DD"),
      event_time: moment(informalEvent.event_time).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      event_end_date: moment(informalEvent.event_end_date).format("YYYY-MM-DD"),
      event_end_time: moment(informalEvent.event_end_time).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      background_info: informalEvent.background_info,
      terms_condition: informalEvent.terms_condition,
      faq: informalEvent.faq,
      contact: informalEvent.contact,
      conclave: informalEvent.conclave,
      venue: informalEvent.venue,
      view_order: +informalEvent.view_order ? +informalEvent.view_order : 0,
      price: informalEvent.price,
      visible: informalEvent.visible,
      is_active: true,
      show_in_home_page: informalEvent.show_in_home_page,
    };
    dispatch(startLoading());
    axios
      .post("/informal-events/create.php", JSON.stringify(workshopData))
      .then((response) => {
        cb(response.data.id);
      })
      .catch((error) => {
        dispatch(stopLoading());
      });
  };
};

export const editInformalEvent = (informalEvent, cb) => {
  return (dispatch) => {
    dispatch(addInformalEventStart());

    let eventData = {
      informal_event_id: informalEvent.informal_event_id,
      title: informalEvent.title,
      type:
        informalEvent.type === "NEW"
          ? informalEvent.new_type
          : informalEvent.type,
      slug: createSlug(informalEvent.slug),
      short_description: informalEvent.short_description,
      full_description: informalEvent.full_description,
      organizer: informalEvent.organizer,
      duration: informalEvent.duration,
      event_date: moment(informalEvent.event_date).format("YYYY-MM-DD"),
      event_time: moment(informalEvent.event_time).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      event_end_date: moment(informalEvent.event_end_date).format("YYYY-MM-DD"),
      event_end_time: moment(informalEvent.event_end_time).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      background_info: informalEvent.background_info,
      terms_condition: informalEvent.terms_condition,
      faq: informalEvent.faq,
      contact: informalEvent.contact,
      conclave: informalEvent.conclave,
      venue: +informalEvent.view_order ? +informalEvent.view_order : 0,
      view_order: informalEvent.view_order,
      price: informalEvent.price,
      visible: informalEvent.visible,
      is_active: true,
      show_in_home_page: informalEvent.show_in_home_page,
    };
    dispatch(startLoading());
    axios
      .post("/informal-events/update.php", JSON.stringify(eventData))
      .then((response) => {
        cb();
      })
      .catch((error) => {
        dispatch(stopLoading());
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

export const deleteInformalEvent = (informalEventId) => {
  return (dispatch) => {
    axios
      .post(
        "/informal-events/delete.php",
        JSON.stringify({ id: informalEventId })
      )
      .then((response) => {
        dispatch(sendMessage("InformalEvent Deleted", "success"));
        setTimeout(() => {
          window.location.href = "/dashboard/informalEventSummary";
        }, 1000);
      })
      .catch((error) => {
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

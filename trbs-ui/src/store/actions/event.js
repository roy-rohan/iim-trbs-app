import moment from "moment";
import { sendMessage } from ".";
import axios from "../../axios-iim";
import * as actionTypes from "./actionTypes";
import { createSlug, nullCheck, startLoading, stopLoading } from "./common";

export const addEventSuccess = (category, events) => {
  return {
    type: actionTypes.ADD_EVENT_SUCCESS,
    events: events,
    category: category,
  };
};

export const addEventFail = (error) => {
  return {
    type: actionTypes.ADD_EVENT_FAIL,
    error: error,
  };
};

export const addEventStart = () => {
  return {
    type: actionTypes.ADD_EVENT_START,
  };
};

export const fetchEventsSuccess = (category, events) => {
  return {
    type: actionTypes.FETCH_EVENTS_SUCCESS,
    events: events,
    category: category,
  };
};

export const fetchEventsFail = (error) => {
  return {
    type: actionTypes.FETCH_EVENTS_FAIL,
    error: error,
  };
};

export const fetchEventsStart = () => {
  return {
    type: actionTypes.FETCH_EVENTS_START,
  };
};

export const fetchCategoriesSuccess = (categories) => {
  return {
    type: actionTypes.FETCH_EVENTS_CATEGORIES_SUCCESS,
    categories: categories,
  };
};

export const fetchCategoriesStart = () => {
  return {
    type: actionTypes.FETCH_EVENTS_CATEGORIES_START,
  };
};

export const fetchCategoriesFail = (error) => {
  return {
    type: actionTypes.FETCH_EVENTS_CATEGORIES_FAIL,
    error: error,
  };
};

export const fetchEventCategories = () => {
  return (dispatch) => {
    dispatch(fetchCategoriesStart());
    axios
      .get("/events/read-category.php")
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

export const fetchEvents = (category, queryCriteria) => {
  return (dispatch) => {
    dispatch(fetchEventsStart());
    const queryParams = "";
    axios
      .post("/events/read.php" + queryParams, queryCriteria)
      .then((res) => {
        const fetchedEvents = [];
        for (let key in res.data) {
          fetchedEvents.push({
            ...res.data[key],
            id: key,
          });
        }
        dispatch(fetchEventsSuccess(category, fetchedEvents));
      })
      .catch((err) => {
        dispatch(fetchEventsFail(err));
      });
  };
};

export const addEvent = (event, cb) => {
  return (dispatch) => {
    dispatch(addEventStart());

    let eventData = {
      title: event.title,
      slug: createSlug(event.slug),
      type: event.type === "NEW" ? event.new_type : event.type,
      short_description: event.short_description,
      full_description: event.full_description,
      remark_one: event.remark_one,
      remark_two: event.remark_two,
      event_time: moment(event.event_time).format("YYYY-MM-DD HH:mm:ss"),
      event_date: moment(event.event_date).format("YYYY-MM-DD"),
      event_end_date: moment(event.event_end_date).format("YYYY-MM-DD"),
      event_end_time: moment(event.event_end_time).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      rules: event.rules,
      prizes: event.prizes,
      event_format: event.event_format,
      contact: event.contact,
      register: event.register,
      organising_club: event.organising_club,
      event_duration: event.event_duration,
      venue: event.venue,
      view_order: +event.view_order ? +event.view_order : 0,
      is_active: 1,
      team_size: nullCheck(event.team_size, ""),
      show_in_home_page: +event.show_in_home_page,
      visible: +event.visible,
      event_timeline: event.event_timeline,
      price: event.price,
    };
    dispatch(startLoading());
    axios
      .post("/events/create.php", JSON.stringify(eventData))
      .then((response) => {
        cb(response.data.id);
      })
      .catch((error) => {
        dispatch(stopLoading());
      });
  };
};

export const editEvent = (event, cb) => {
  return (dispatch) => {
    dispatch(addEventStart());

    let eventData = {
      event_id: event.event_id,
      title: event.title,
      slug: createSlug(event.slug),
      type: event.type === "NEW" ? event.new_type : event.type,
      short_description: event.short_description,
      full_description: event.full_description,
      remark_one: event.remark_one,
      remark_two: event.remark_two,
      event_time: moment(event.event_time).format("YYYY-MM-DD HH:mm:ss"),
      event_date: moment(event.event_date).format("YYYY-MM-DD"),
      event_end_date: moment(event.event_end_date).format("YYYY-MM-DD"),
      event_end_time: moment(event.event_end_time).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      rules: event.rules,
      prizes: event.prizes,
      event_format: event.event_format,
      contact: event.contact,
      register: event.register,
      organising_club: event.organising_club,
      event_duration: event.event_duration,
      venue: event.venue,
      view_order: +event.view_order ? +event.view_order : 0,
      is_active: 1,
      team_size: nullCheck(event.team_size, ""),
      show_in_home_page: +event.show_in_home_page,
      visible: +event.visible,
      event_timeline: event.event_timeline,
      price: event.price,
    };
    dispatch(startLoading());
    axios
      .post("/events/update.php", JSON.stringify(eventData))
      .then((response) => {
        cb();
      })
      .catch((error) => {
        dispatch(stopLoading());
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

export const deleteEvent = (eventId) => {
  return (dispatch) => {
    axios
      .post("/events/delete.php", JSON.stringify({ id: eventId }))
      .then((response) => {
        dispatch(sendMessage("Event Deleted", "success"));
        setTimeout(() => {
          window.location.href = "/dashboard/eventSummary";
        }, 1000);
      })
      .catch((error) => {
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

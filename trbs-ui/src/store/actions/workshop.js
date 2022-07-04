import moment from "moment";
import { sendMessage } from ".";
import axios from "../../axios-iim";
import * as actionTypes from "./actionTypes";
import { createSlug, startLoading, stopLoading } from "./common";

export const addWorkshopSuccess = (category, events) => {
  return {
    type: actionTypes.ADD_WORKSHOP_SUCCESS,
    events: events,
    category: category,
  };
};

export const addWorkshopFail = (error) => {
  return {
    type: actionTypes.ADD_WORKSHOP_FAIL,
    error: error,
  };
};

export const addWorkshopStart = () => {
  return {
    type: actionTypes.ADD_WORKSHOP_START,
  };
};

export const fetchWorkshopSuccess = (category, workshops) => {
  return {
    type: actionTypes.FETCH_WORKSHOP_SUCCESS,
    workshops: workshops,
    category: category,
  };
};

export const fetchWorkshopFail = (error) => {
  return {
    type: actionTypes.FETCH_WORKSHOP_FAIL,
    error: error,
  };
};

export const fetchWorkshopStart = () => {
  return {
    type: actionTypes.FETCH_WORKSHOP_START,
  };
};

export const fetchCategoriesSuccess = (categories) => {
  return {
    type: actionTypes.FETCH_WORKSHOP_CATEGORIES_SUCCESS,
    categories: categories,
  };
};

export const fetchCategoriesStart = () => {
  return {
    type: actionTypes.FETCH_WORKSHOP_CATEGORIES_START,
  };
};

export const fetchCategoriesFail = (error) => {
  return {
    type: actionTypes.FETCH_WORKSHOP_CATEGORIES_FAIL,
    error: error,
  };
};

export const fetchWorkshopCategories = () => {
  return (dispatch) => {
    dispatch(fetchCategoriesStart());
    axios
      .get("/workshops/read-category.php")
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

export const fetchWorkshops = (category, queryCriteria) => {
  return (dispatch) => {
    dispatch(fetchWorkshopStart());
    const queryParams = "";
    axios
      .post("/workshops/read.php" + queryParams, queryCriteria)
      .then((res) => {
        const fetchedWorkshops = [];
        for (let key in res.data) {
          fetchedWorkshops.push({
            ...res.data[key],
            id: key,
          });
        }
        dispatch(fetchWorkshopSuccess(category, fetchedWorkshops));
      })
      .catch((err) => {
        dispatch(fetchWorkshopFail(err));
      });
  };
};

export const addWorkshop = (workshop, cb) => {
  return (dispatch) => {
    dispatch(addWorkshopStart());

    let workshopData = {
      title: workshop.title,
      type: workshop.type === "NEW" ? workshop.new_type : workshop.type,
      slug: createSlug(workshop.slug),
      short_description: workshop.short_description,
      full_description: workshop.full_description,
      organizer: workshop.organizer,
      duration: workshop.duration,
      workshop_date: moment(workshop.workshop_date).format("YYYY-MM-DD"),
      workshop_time: moment(workshop.workshop_time).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      workshop_end_date: moment(workshop.workshop_date).format("YYYY-MM-DD"),
      workshop_end_time: moment(workshop.workshop_end_time).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      background_info: workshop.background_info,
      terms_condition: workshop.terms_condition,
      faq: workshop.faq,
      contact: workshop.contact,
      conclave: workshop.conclave,
      venue: workshop.venue,
      view_order: +workshop.view_order ? +workshop.view_order : 0,
      price: workshop.price,
      visible: +workshop.visible,
      is_active: true,
      show_in_home_page: workshop.show_in_home_page,
    };
    dispatch(startLoading());
    axios
      .post("/workshops/create.php", JSON.stringify(workshopData))
      .then((response) => {
        cb(response.data.id);
      })
      .catch((error) => {
        dispatch(stopLoading());
      });
  };
};

export const editWorkshop = (workshop, cb) => {
  return (dispatch) => {
    dispatch(addWorkshopStart());

    let eventData = {
      workshop_id: workshop.workshop_id,
      title: workshop.title,
      type: workshop.type === "NEW" ? workshop.new_type : workshop.type,
      slug: createSlug(workshop.slug),
      short_description: workshop.short_description,
      full_description: workshop.full_description,
      organizer: workshop.organizer,
      duration: workshop.duration,
      workshop_date: moment(workshop.workshop_date).format("YYYY-MM-DD"),
      workshop_time: moment(workshop.workshop_time).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      workshop_end_date: moment(workshop.workshop_end_date).format(
        "YYYY-MM-DD"
      ),
      workshop_end_time: moment(workshop.workshop_end_time).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      background_info: workshop.background_info,
      terms_condition: workshop.terms_condition,
      faq: workshop.faq,
      contact: workshop.contact,
      conclave: workshop.conclave,
      venue: workshop.venue,
      view_order: workshop.view_order,
      price: workshop.price,
      visible: +workshop.visible,
      is_active: true,
      show_in_home_page: workshop.show_in_home_page,
    };
    dispatch(startLoading());
    axios
      .post("/workshops/update.php", JSON.stringify(eventData))
      .then((response) => {
        cb();
      })
      .catch((error) => {
        dispatch(stopLoading());
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

export const deleteWorkshop = (workshopId) => {
  return (dispatch) => {
    axios
      .post("/workshops/delete.php", JSON.stringify({ id: workshopId }))
      .then((response) => {
        dispatch(sendMessage("Workshop Deleted", "success"));
        setTimeout(() => {
          window.location.href = "/dashboard/workshopSummary";
        }, 1000);
      })
      .catch((error) => {
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

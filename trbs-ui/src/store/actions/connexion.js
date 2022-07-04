import moment from "moment";
import { sendMessage } from ".";
import axios from "../../axios-iim";
import * as actionTypes from "./actionTypes";
import { createSlug, startLoading, stopLoading } from "./common";

export const addConnexionSuccess = (category, connexions) => {
  return {
    type: actionTypes.ADD_CONNEXION_SUCCESS,
    connexions: connexions,
    category: category,
  };
};

export const addConnexionFail = (error) => {
  return {
    type: actionTypes.ADD_CONNEXION_FAIL,
    error: error,
  };
};

export const addConnexionStart = () => {
  return {
    type: actionTypes.ADD_CONNEXION_START,
  };
};

export const fetchConnexionSuccess = (category, connexions) => {
  return {
    type: actionTypes.FETCH_CONNEXION_SUCCESS,
    connexions: connexions,
    category: category,
  };
};

export const fetchConnexionFail = (error) => {
  return {
    type: actionTypes.FETCH_CONNEXION_FAIL,
    error: error,
  };
};

export const fetchConnexionStart = () => {
  return {
    type: actionTypes.FETCH_CONNEXION_START,
  };
};

export const fetchCategoriesSuccess = (categories) => {
  return {
    type: actionTypes.FETCH_CONNEXION_CATEGORIES_SUCCESS,
    categories: categories,
  };
};

export const fetchCategoriesStart = () => {
  return {
    type: actionTypes.FETCH_CONNEXION_CATEGORIES_START,
  };
};

export const fetchCategoriesFail = (error) => {
  return {
    type: actionTypes.FETCH_CONNEXION_CATEGORIES_FAIL,
    error: error,
  };
};

export const fetchConnexionCategories = () => {
  return (dispatch) => {
    dispatch(fetchCategoriesStart());
    axios
      .get("/connexions/read-category.php")
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

export const fetchConnexions = (category, queryCriteria) => {
  return (dispatch) => {
    dispatch(fetchConnexionStart());
    const queryParams = "";
    axios
      .post("/connexions/read.php" + queryParams, queryCriteria)
      .then((res) => {
        const fetchedConnexions = [];
        for (let key in res.data) {
          fetchedConnexions.push({
            ...res.data[key],
            id: key,
          });
        }
        dispatch(fetchConnexionSuccess(category, fetchedConnexions));
      })
      .catch((err) => {
        dispatch(fetchConnexionFail(err));
      });
  };
};

export const addConnexion = (connexion, cb) => {
  return (dispatch) => {
    dispatch(addConnexionStart());

    let connexionData = {
      name: connexion.name,
      introduction: connexion.introduction,
      slug: createSlug(connexion.slug),
      designation: connexion.designation,
      type: connexion.type === "NEW" ? connexion.new_type : connexion.type,
      topic: connexion.topic,
      biography: connexion.biography,
      duration: connexion.duration,
      date: moment(connexion.date).format("YYYY-MM-DD"),
      time: moment(connexion.time).format("YYYY-MM-DD HH:mm:ss"),
      registration: connexion.registration,
      venue: connexion.venue,
      view_order: +connexion.view_order ? +connexion.view_order : 0,
      price: connexion.price,
      visible: +connexion.visible,
      is_active: true,
      show_in_home_page: connexion.show_in_home_page,
    };
    dispatch(startLoading());
    axios
      .post("/connexions/create.php", JSON.stringify(connexionData))
      .then((response) => {
        cb(response.data.id);
      })
      .catch((error) => {
        dispatch(stopLoading());
      });
  };
};

export const editConnexion = (connexion, cb) => {
  return (dispatch) => {
    dispatch(addConnexionStart());

    let connexionData = {
      connexion_id: connexion.connexion_id,
      name: connexion.name,
      introduction: connexion.introduction,
      slug: createSlug(connexion.slug),
      designation: connexion.designation,
      topic: connexion.topic,
      type: connexion.type === "NEW" ? connexion.new_type : connexion.type,
      biography: connexion.biography,
      duration: connexion.duration,
      date: moment(connexion.date).format("YYYY-MM-DD"),
      time: moment(connexion.time).format("YYYY-MM-DD HH:mm:ss"),
      registration: connexion.registration,
      venue: connexion.venue,
      view_order: +connexion.view_order ? +connexion.view_order : 0,
      price: connexion.price,
      visible: +connexion.visible,
      is_active: true,
      show_in_home_page: connexion.show_in_home_page,
    };
    dispatch(startLoading());
    axios
      .post("/connexions/update.php", JSON.stringify(connexionData))
      .then((response) => {
        cb();
      })
      .catch((error) => {
        dispatch(stopLoading());
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

export const deleteConnexion = (connextionId) => {
  return (dispatch) => {
    axios
      .post("/connexions/delete.php", JSON.stringify({ id: connextionId }))
      .then((response) => {
        dispatch(sendMessage("Connexion Deleted", "success"));
        setTimeout(() => {
          window.location.href = "/dashboard/connexionSummary";
        }, 1000);
      })
      .catch((error) => {
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

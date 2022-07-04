import { sendMessage } from ".";
import axios from "../../axios-iim";
import * as actionTypes from "./actionTypes";
import { startLoading, stopLoading } from "./common";

export const addSponserSuccess = (category, sponsers) => {
  return {
    type: actionTypes.ADD_SPONSER_SUCCESS,
    sponsers: sponsers,
    category: category,
  };
};

export const addSponserFail = (error) => {
  return {
    type: actionTypes.ADD_SPONSER_FAIL,
    error: error,
  };
};

export const addSponserStart = () => {
  return {
    type: actionTypes.ADD_SPONSER_START,
  };
};

export const fetchSponserSuccess = (category, sponsers) => {
  return {
    type: actionTypes.FETCH_SPONSER_SUCCESS,
    sponsers: sponsers,
    category: category,
  };
};

export const fetchSponserFail = (error) => {
  return {
    type: actionTypes.FETCH_SPONSER_FAIL,
    error: error,
  };
};

export const fetchSponserStart = () => {
  return {
    type: actionTypes.FETCH_SPONSER_START,
  };
};

export const fetchCategoriesSuccess = (categories) => {
  return {
    type: actionTypes.FETCH_SPONSER_CATEGORIES_SUCCESS,
    categories: categories,
  };
};

export const fetchCategoriesStart = () => {
  return {
    type: actionTypes.FETCH_SPONSER_CATEGORIES_START,
  };
};

export const fetchCategoriesFail = (error) => {
  return {
    type: actionTypes.FETCH_SPONSER_CATEGORIES_FAIL,
    error: error,
  };
};

export const fetchSponserCategories = () => {
  return (dispatch) => {
    dispatch(fetchCategoriesStart());
    axios
      .get("/sponsers/read-category.php")
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

export const fetchSponsers = (category, queryCriteria) => {
  return (dispatch) => {
    dispatch(fetchSponserStart());
    const queryParams = "";
    axios
      .post("/sponsers/read.php" + queryParams, queryCriteria)
      .then((res) => {
        const fetchedSponsers = [];
        for (let key in res.data) {
          fetchedSponsers.push({
            ...res.data[key],
            id: key,
          });
        }
        dispatch(fetchSponserSuccess(category, fetchedSponsers));
      })
      .catch((err) => {
        dispatch(fetchSponserFail(err));
      });
  };
};

export const addSponser = (sponser, cb) => {
  return (dispatch) => {
    dispatch(addSponserStart());

    let sponserData = {
      title: sponser.title,
      type: sponser.type === "NEW" ? sponser.new_type : sponser.type,
      link: sponser.link,
      size: sponser.size,
      visible: +sponser.visible,
      view_order: +sponser.view_order ? +sponser.view_order : 0,
      show_in_home_page: sponser.show_in_home_page,
    };
    dispatch(startLoading());
    axios
      .post("/sponsers/create.php", JSON.stringify(sponserData))
      .then((response) => {
        cb(response.data.id);
      })
      .catch((error) => {
        dispatch(stopLoading());
      });
  };
};

export const editSponser = (sponser, cb) => {
  return (dispatch) => {
    dispatch(addSponserStart());

    let sponserData = {
      sponser_id: sponser.sponser_id,
      title: sponser.title,
      type: sponser.type === "NEW" ? sponser.new_type : sponser.type,
      link: sponser.link,
      size: sponser.size,
      visible: +sponser.visible,
      view_order: +sponser.view_order ? +sponser.view_order : 0,
      show_in_home_page: sponser.show_in_home_page,
    };
    dispatch(startLoading());
    axios
      .post("/sponsers/update.php", JSON.stringify(sponserData))
      .then((response) => {
        cb();
      })
      .catch((error) => {
        dispatch(stopLoading());
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

export const deleteSponser = (sponserId) => {
  return (dispatch) => {
    axios
      .post("/sponsers/delete.php", JSON.stringify({ id: sponserId }))
      .then((response) => {
        dispatch(sendMessage("Sponser Deleted", "success"));
        setTimeout(() => {
          window.location.href = "/dashboard/sponserSummary";
        }, 1000);
      })
      .catch((error) => {
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

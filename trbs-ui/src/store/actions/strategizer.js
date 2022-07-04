import { sendMessage } from ".";
import axios from "../../axios-iim";
import * as actionTypes from "./actionTypes";
import { startLoading, stopLoading } from "./common";

export const addStrategizerSuccess = (category, strategizers) => {
  return {
    type: actionTypes.ADD_STRATEGIZER_SUCCESS,
    strategizers: strategizers,
    category: category,
  };
};

export const addStrategizerFail = (error) => {
  return {
    type: actionTypes.ADD_STRATEGIZER_FAIL,
    error: error,
  };
};

export const addStrategizerStart = () => {
  return {
    type: actionTypes.ADD_STRATEGIZER_START,
  };
};

export const fetchStrategizerSuccess = (category, strategizers) => {
  return {
    type: actionTypes.FETCH_STRATEGIZER_SUCCESS,
    strategizers: strategizers,
    category: category,
  };
};

export const fetchStrategizerFail = (error) => {
  return {
    type: actionTypes.FETCH_STRATEGIZER_FAIL,
    error: error,
  };
};

export const fetchStrategizerStart = () => {
  return {
    type: actionTypes.FETCH_STRATEGIZER_START,
  };
};

export const fetchCategoriesSuccess = (categories) => {
  return {
    type: actionTypes.FETCH_STRATEGIZER_CATEGORIES_SUCCESS,
    categories: categories,
  };
};

export const fetchCategoriesStart = () => {
  return {
    type: actionTypes.FETCH_STRATEGIZER_CATEGORIES_START,
  };
};

export const fetchCategoriesFail = (error) => {
  return {
    type: actionTypes.FETCH_STRATEGIZER_CATEGORIES_FAIL,
    error: error,
  };
};

export const fetchStrategizerCategories = () => {
  return (dispatch) => {
    dispatch(fetchCategoriesStart());
    axios
      .get("/strategizers/read-category.php")
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

export const fetchStrategizers = (category, queryCriteria) => {
  return (dispatch) => {
    dispatch(fetchStrategizerStart());
    const queryParams = "";
    axios
      .post("/strategizer/read.php" + queryParams, queryCriteria)
      .then((res) => {
        const fetchedStrategizers = [];
        for (let key in res.data) {
          fetchedStrategizers.push({
            ...res.data[key],
            id: key,
          });
        }
        dispatch(fetchStrategizerSuccess(category, fetchedStrategizers));
      })
      .catch((err) => {
        dispatch(fetchStrategizerFail(err));
      });
  };
};

export const addStrategizer = (strategizer, cb) => {
  return (dispatch) => {
    dispatch(addStrategizerStart());

    let strategizerData = {
      type: strategizer.type,
      name: strategizer.name,
      score: strategizer.score,
      college_id: strategizer.college_id,
      college_name: strategizer.college_name,
    };
    dispatch(startLoading());
    axios
      .post("/strategizer/create.php", JSON.stringify(strategizerData))
      .then((response) => {
        cb(response.data.id);
      })
      .catch((error) => {
        dispatch(stopLoading());
      });
  };
};

export const editStrategizer = (strategizer, cb) => {
  return (dispatch) => {
    dispatch(addStrategizerStart());

    let speakerData = {
      leaderboard_id: strategizer.leaderboard_id,
      type: strategizer.type,
      name: strategizer.name,
      score: strategizer.score,
      college_id: strategizer.college_id,
      college_name: strategizer.college_name,
    };
    dispatch(startLoading());
    axios
      .post("/strategizer/update.php", JSON.stringify(speakerData))
      .then((response) => {
        cb();
      })
      .catch((error) => {
        dispatch(stopLoading());
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

export const deleteStrategizer = (strategizerId) => {
  return (dispatch) => {
    axios
      .post("/strategizer/delete.php", JSON.stringify({ id: strategizerId }))
      .then((response) => {
        dispatch(sendMessage("Strategizer Deleted", "success"));
        setTimeout(() => {
          window.location.href = "/dashboard/strategizerSummary";
        }, 1000);
      })
      .catch((error) => {
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

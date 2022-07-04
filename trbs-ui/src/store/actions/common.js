import * as actionTypes from "./actionTypes";

export const startLoading = () => {
  return {
    type: actionTypes.LOADING_START,
  };
};

export const stopLoading = () => {
  return {
    type: actionTypes.LOADING_STOP,
  };
};

export const nullCheck = (value, defaultValue) => {
  return value === null ? defaultValue : value;
};

export const createSlug = (data = "") => {
  let words = data.trim().split(" ");
  let slug = words.join("-");
  return slug;
};

import * as actionTypes from "./actionTypes";
import axios from "../../axios-iim";

export const fetchRegistrationsSuccess = (category, events) => {
  return {
    type: actionTypes.FETCH_EVENTS_SUCCESS,
    events: events,
    category: category,
  };
};

export const fetchRegistrationsFail = (error) => {
  return {
    type: actionTypes.FETCH_EVENTS_FAIL,
    error: error,
  };
};

export const fetchRegistrationsStart = () => {
  return {
    type: actionTypes.FETCH_EVENTS_START,
  };
};

export const fetchRegistrations = (category, queryCriteria) => {
  return (dispatch) => {
    dispatch(fetchRegistrationsStart());
    const queryParams = "";
    axios
      .post("/users/booking/read.php" + queryParams, queryCriteria)
      .then((res) => {
        // console.log("fetched registrations data: ", res.data);
        const fetchedEvents = [];
        for (let key in res.data) {
          fetchedEvents.push({
            ...res.data[key],
            id: key,
          });
        }
        dispatch(fetchRegistrationsSuccess(category, fetchedEvents));
      })
      .catch((err) => {
        dispatch(fetchRegistrationsFail(err));
      });
  };
};

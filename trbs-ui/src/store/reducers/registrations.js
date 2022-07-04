import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  error: false,
  registrations: null,
  loading: false,
};

const fetchRegistrationsStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchRegistrationsSuccess = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchRegistrationsFail = (state, action) => {
  return updateObject(state, { loading: true });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_REGISTRATIONS_START:
      return fetchRegistrationsStart(state, action);
    case actionTypes.FETCH_REGISTRATIONS_SUCCESS:
      return fetchRegistrationsSuccess(state, action);
    case actionTypes.FETCH_REGISTRATIONS_FAIL:
      return fetchRegistrationsFail(state, action);
    default:
      return state;
  }
};

export default reducer;

import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  error: false,
  contactPersons: null,
  categories: [],
  loading: false,
};

const fetchContactPersonStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchContactPersonSuccess = (state, action) => {
  return updateObject(state, {
    contactPersons: {
      ...state.contactPersons,
      [action.category]: action.contactPersons,
    },
    loading: false,
  });
};

const fetchContactPersonFail = (state, action) => {
  return updateObject(state, { error: true, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_PERSON_START:
      return fetchContactPersonStart(state, action);
    case actionTypes.FETCH_CONTACT_PERSON_SUCCESS:
      return fetchContactPersonSuccess(state, action);
    case actionTypes.FETCH_CONTACT_PERSON_FAIL:
      return fetchContactPersonFail(state, action);
    default:
      return state;
  }
};

export default reducer;

import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  error: false,
  events: null,
  categories: [],
  loading: false,
};

const fetchEventsStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchCategoriesStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchEventsSuccess = (state, action) => {
  return updateObject(state, {
    events: {
      ...state.events,
      [action.category]: action.events,
    },
    loading: false,
  });
};

const fetchCategoriesSuccess = (state, action) => {
  return updateObject(state, {
    categories: action.categories,
    loading: false,
  });
};

const fetchEventsFail = (state, action) => {
  return updateObject(state, { error: true, loading: false });
};

const fetchCategoriesFail = (state, action) => {
  return updateObject(state, { error: true, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_EVENTS_START:
      return fetchEventsStart(state, action);
    case actionTypes.FETCH_EVENTS_SUCCESS:
      return fetchEventsSuccess(state, action);
    case actionTypes.FETCH_EVENTS_FAIL:
      return fetchEventsFail(state, action);
    case actionTypes.FETCH_EVENTS_CATEGORIES_START:
      return fetchCategoriesStart(state, action);
    case actionTypes.FETCH_EVENTS_CATEGORIES_SUCCESS:
      return fetchCategoriesSuccess(state, action);
    case actionTypes.FETCH_EVENTS_CATEGORIES_FAIL:
      return fetchCategoriesFail(state, action);
    default:
      return state;
  }
};

export default reducer;

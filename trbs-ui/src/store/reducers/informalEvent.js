import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  error: false,
  informalEvents: null,
  categories: [],
  loading: false,
};

const fetchInformalEventStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchCategoriesStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchInformalEventSuccess = (state, action) => {
  return updateObject(state, {
    informalEvents: {
      ...state.informalEvents,
      [action.category]: action.informalEvents,
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

const fetchInformalEventFail = (state, action) => {
  return updateObject(state, { error: true, loading: false });
};

const fetchCategoriesFail = (state, action) => {
  return updateObject(state, { error: true, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_INFORMAL_EVENTS_START:
      return fetchInformalEventStart(state, action);
    case actionTypes.FETCH_INFORMAL_EVENTS_SUCCESS:
      return fetchInformalEventSuccess(state, action);
    case actionTypes.FETCH_INFORMAL_EVENTS_FAIL:
      return fetchInformalEventFail(state, action);
    case actionTypes.FETCH_INFORMAL_EVENTS_CATEGORIES_START:
      return fetchCategoriesStart(state, action);
    case actionTypes.FETCH_INFORMAL_EVENTS_CATEGORIES_SUCCESS:
      return fetchCategoriesSuccess(state, action);
    case actionTypes.FETCH_INFORMAL_EVENTS_CATEGORIES_FAIL:
      return fetchCategoriesFail(state, action);
    default:
      return state;
  }
};

export default reducer;

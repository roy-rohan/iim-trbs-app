import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  error: false,
  sponsers: null,
  categories: [],
  loading: false,
};

const fetchSponserStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchCategoriesStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchSponserSuccess = (state, action) => {
  return updateObject(state, {
    sponsers: {
      ...state.sponsers,
      [action.category]: action.sponsers,
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

const fetchSponserFail = (state, action) => {
  return updateObject(state, { error: true, loading: false });
};

const fetchCategoriesFail = (state, action) => {
  return updateObject(state, { error: true, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SPONSER_START:
      return fetchSponserStart(state, action);
    case actionTypes.FETCH_SPONSER_SUCCESS:
      return fetchSponserSuccess(state, action);
    case actionTypes.FETCH_SPONSER_FAIL:
      return fetchSponserFail(state, action);
    case actionTypes.FETCH_SPONSER_CATEGORIES_START:
      return fetchCategoriesStart(state, action);
    case actionTypes.FETCH_SPONSER_CATEGORIES_SUCCESS:
      return fetchCategoriesSuccess(state, action);
    case actionTypes.FETCH_SPONSER_CATEGORIES_FAIL:
      return fetchCategoriesFail(state, action);
    default:
      return state;
  }
};

export default reducer;

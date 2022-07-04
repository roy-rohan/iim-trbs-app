import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  error: false,
  strategizers: null,
  categories: [],
  loading: false,
};

const fetchStrategizerStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchCategoriesStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchStrategizerSuccess = (state, action) => {
  return updateObject(state, {
    strategizers: {
      ...state.strategizers,
      [action.category]: action.strategizers,
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

const fetchStrategizerFail = (state, action) => {
  return updateObject(state, { error: true, loading: false });
};

const fetchCategoriesFail = (state, action) => {
  return updateObject(state, { error: true, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_STRATEGIZER_START:
      return fetchStrategizerStart(state, action);
    case actionTypes.FETCH_STRATEGIZER_SUCCESS:
      return fetchStrategizerSuccess(state, action);
    case actionTypes.FETCH_STRATEGIZER_FAIL:
      return fetchStrategizerFail(state, action);
    case actionTypes.FETCH_STRATEGIZER_CATEGORIES_START:
      return fetchCategoriesStart(state, action);
    case actionTypes.FETCH_STRATEGIZER_CATEGORIES_SUCCESS:
      return fetchCategoriesSuccess(state, action);
    case actionTypes.FETCH_STRATEGIZER_CATEGORIES_FAIL:
      return fetchCategoriesFail(state, action);
    default:
      return state;
  }
};

export default reducer;

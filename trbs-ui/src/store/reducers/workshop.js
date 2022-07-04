import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  error: false,
  workshops: null,
  categories: [],
  loading: false,
};

const fetchWorkshopStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchCategoriesStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchWorkshopSuccess = (state, action) => {
  return updateObject(state, {
    workshops: {
      ...state.workshops,
      [action.category]: action.workshops,
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

const fetchWorkshopFail = (state, action) => {
  return updateObject(state, { error: true, loading: false });
};

const fetchCategoriesFail = (state, action) => {
  return updateObject(state, { error: true, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_WORKSHOP_START:
      return fetchWorkshopStart(state, action);
    case actionTypes.FETCH_WORKSHOP_SUCCESS:
      return fetchWorkshopSuccess(state, action);
    case actionTypes.FETCH_WORKSHOP_FAIL:
      return fetchWorkshopFail(state, action);
    case actionTypes.FETCH_WORKSHOP_CATEGORIES_START:
      return fetchCategoriesStart(state, action);
    case actionTypes.FETCH_WORKSHOP_CATEGORIES_SUCCESS:
      return fetchCategoriesSuccess(state, action);
    case actionTypes.FETCH_WORKSHOP_CATEGORIES_FAIL:
      return fetchCategoriesFail(state, action);
    default:
      return state;
  }
};

export default reducer;

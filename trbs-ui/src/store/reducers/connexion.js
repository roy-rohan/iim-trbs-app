import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  error: false,
  connexions: null,
  categories: [],
  loading: false,
};

const fetchSpeakerStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchCategoriesStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchSpeakerSuccess = (state, action) => {
  return updateObject(state, {
    connexions: {
      ...state.connexions,
      [action.category]: action.connexions,
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

const fetchSpeakerFail = (state, action) => {
  return updateObject(state, { error: true, loading: false });
};

const fetchCategoriesFail = (state, action) => {
  return updateObject(state, { error: true, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONNEXION_START:
      return fetchSpeakerStart(state, action);
    case actionTypes.FETCH_CONNEXION_SUCCESS:
      return fetchSpeakerSuccess(state, action);
    case actionTypes.FETCH_CONNEXION_FAIL:
      return fetchSpeakerFail(state, action);
    case actionTypes.FETCH_CONNEXION_CATEGORIES_START:
      return fetchCategoriesStart(state, action);
    case actionTypes.FETCH_CONNEXION_CATEGORIES_SUCCESS:
      return fetchCategoriesSuccess(state, action);
    case actionTypes.FETCH_CONNEXION_CATEGORIES_FAIL:
      return fetchCategoriesFail(state, action);
    default:
      return state;
  }
};

export default reducer;

import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  error: false,
  coupons: null,
  categories: [],
  loading: false,
};

const fetchStrategizerStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchStrategizerSuccess = (state, action) => {
  return updateObject(state, {
    coupons: {
      ...state.coupons,
      [action.category]: action.coupons,
    },
    loading: false,
  });
};

const fetchStrategizerFail = (state, action) => {
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
    default:
      return state;
  }
};

export default reducer;

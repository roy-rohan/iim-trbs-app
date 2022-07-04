import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  error: false,
  members: null,
  categories: [],
  loading: false,
};

const fetchMemberStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchMemberSuccess = (state, action) => {
  return updateObject(state, {
    members: {
      ...state.members,
      [action.category]: action.members,
    },
    loading: false,
  });
};

const fetchMemberFail = (state, action) => {
  return updateObject(state, { error: true, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_MEMBER_START:
      return fetchMemberStart(state, action);
    case actionTypes.FETCH_MEMBER_SUCCESS:
      return fetchMemberSuccess(state, action);
    case actionTypes.FETCH_MEMBER_FAIL:
      return fetchMemberFail(state, action);
    default:
      return state;
  }
};

export default reducer;

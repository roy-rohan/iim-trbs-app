import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  error: false,
  certificates: null,
  categories: [],
  loading: false,
};

const fetchCertificateStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchCertificateSuccess = (state, action) => {
  return updateObject(state, {
    certificates: {
      ...state.certificates,
      [action.category]: action.certificates,
    },
    loading: false,
  });
};


const fetchCertificateFail = (state, action) => {
  return updateObject(state, { error: true, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CERTIFICATE_START:
      return fetchCertificateStart(state, action);
    case actionTypes.FETCH_CERTIFICATE_SUCCESS:
      return fetchCertificateSuccess(state, action);
    case actionTypes.FETCH_CERTIFICATE_FAIL:
      return fetchCertificateFail(state, action);
    default:
      return state;
  }
};

export default reducer;

import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const loadIntialState = () => {
  const initialState = {
    token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
    user: localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    cart: localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("cart"))
      : null,
    error: null,
    loading: true,
    authRedirectPath: "/",
  };
  return initialState;
};

const userUpdateSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false,
    user: action.user,
  });
};

const userUpdateFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const cartFetchSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false,
    cart: action.cart,
  });
};

const cartFetchFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const loadingStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const loadingStop = (state, action) => {
  return updateObject(state, { error: null, loading: false });
};

const authStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.token,
    user: action.user,
    cart: action.cart,
    error: null,
    loading: false,
    authRedirectPath: action.path,
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const authLogout = (state, action) => {
  return updateObject(state, { token: null, user: null });
};

const reducer = (state = loadIntialState(), action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.USER_UPDATE_SUCCESS:
      return userUpdateSuccess(state, action);
    case actionTypes.USER_UPDATE_FAILURE:
      return userUpdateFail(state, action);
    case actionTypes.CART_FETCH_SUCCESS:
      return cartFetchSuccess(state, action);
    case actionTypes.CART_FETCH_FAILURE:
      return cartFetchFail(state, action);
    case actionTypes.LOADING_START:
      return loadingStart(state, action);
    case actionTypes.LOADING_STOP:
      return loadingStop(state, action);
    default:
      return state;
  }
};

export default reducer;

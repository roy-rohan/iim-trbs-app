import axios from "../../axios-iim";
import * as actionTypes from "./actionTypes";
import { sendMessage } from "./messenger";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, userData, cartData, path) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    cart: cartData,
    user: userData,
    path: path,
  };
};

export const userFetchSuccess = (token, userData, cartData, path) => {
  return {
    type: actionTypes.USER_FETCH_SUCCESS,
    token: token,
    cart: cartData,
    user: userData,
  };
};

export const userFetchFail = (error) => {
  return {
    type: actionTypes.USER_FETCH_FAILURE,
    error: error,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logoutSuccess = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    dispatch(sendMessage("Logged out successfully", "success"));
    dispatch(logoutSuccess());
  };
};

export const login = (loginId, password, cb) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      login_id: loginId,
      password: password,
    };
    let url = "/users/login.php";
    axios
      .post(url, JSON.stringify(authData))
      .then((tokenResponse) => {
        cb(tokenResponse.data.token);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message
          ? error.response?.data?.message
          : "Login attempt was unsuccessful";
        dispatch(sendMessage(errorMessage, "error"));
        dispatch(authFail(error.message));
      });
  };
};

export const activateAccount = (token, cb) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      token: token,
    };
    let url = "/users/activate.php";
    axios
      .post(url, JSON.stringify(authData))
      .then((tokenResponse) => {
        cb(tokenResponse.data.token);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message
          ? error.response?.data?.message
          : "Account activation Link not valid";
        dispatch(sendMessage(errorMessage, "error"));
        dispatch(authFail(error.message));
      });
  };
};

export const loginHandler = (token) => {
  return (dispatch) => {
    axios
      .post(
        "/users/read_single.php",
        JSON.stringify({ token: "Bearer " + token })
      )
      .then((userResponse) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userResponse.data));
        let authRedirectPath = "/profile";
        if (userResponse.data.role === "admin") authRedirectPath = "/dashboard";
        axios
          .get(`/users/cart/read_single.php?id=${userResponse.data.cart_id}`)
          .then((cartData) => {
            localStorage.setItem("cart", JSON.stringify(cartData.data));
            dispatch(
              sendMessage("Welcome " + userResponse.data.first_name, "success")
            );
            dispatch(
              authSuccess(
                token,
                userResponse.data,
                cartData.data,
                authRedirectPath
              )
            );
          })
          .catch((error) => {
            const errorMessage = error.response?.data?.message
              ? error.response?.data?.message
              : "Autentication Failed.";
            dispatch(sendMessage(errorMessage, "error"));
          });
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message
          ? error.response?.data?.message
          : "Autentication Failed.";
        dispatch(sendMessage(errorMessage, "error"));
      });
  };
};

export const updateUser = (token, userData) => {
  return (dispatch) => {
    userData.token = token;
    axios
      .post("/users/update.php")
      .then((data) => {
        dispatch(sendMessage("User has been updated succcessfully", "success"));
        localStorage.setItem("user", JSON.stringify(data));
        dispatch({
          type: actionTypes.USER_UPDATE_SUCCESS,
          user: userData,
        });
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.USER_UPDATE_FAILURE,
          user: userData,
        });
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

export const fetchUser = (token) => {
  return (dispatch) => {
    axios
      .post(
        "/users/read_single.php",
        JSON.stringify({ token: "Bearer " + token })
      )
      .then((userResponse) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userResponse.data));
        axios
          .get(`/users/cart/read_single.php?id=${userResponse.data.cart_id}`)
          .then((cartData) => {
            localStorage.setItem("cart", JSON.stringify(cartData.data));
            dispatch(userFetchSuccess(token, userResponse.data, cartData.data));
          })
          .catch((error) => {
            const errorMessage = error.response?.data?.message
              ? error.response?.data?.message
              : "Failed to fetch User Details";
            dispatch(userFetchFail(error));
            dispatch(sendMessage(errorMessage, "error"));
          });
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message
          ? error.response?.data?.message
          : "Failed to fetch User Details";
        dispatch(userFetchFail(error));
        dispatch(sendMessage(errorMessage, "error"));
      });
  };
};

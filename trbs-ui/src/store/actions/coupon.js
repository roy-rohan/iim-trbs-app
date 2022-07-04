import { sendMessage } from ".";
import axios from "../../axios-iim";
import * as actionTypes from "./actionTypes";
import { startLoading, stopLoading } from "./common";

export const addCouponSuccess = (coupons) => {
  return {
    type: actionTypes.ADD_COUPON_SUCCESS,
    coupons: coupons,
  };
};

export const addCouponFail = (error) => {
  return {
    type: actionTypes.ADD_COUPON_FAIL,
    error: error,
  };
};

export const addCouponStart = () => {
  return {
    type: actionTypes.ADD_COUPON_START,
  };
};

export const addCoupon = (coupon, cb) => {
  return (dispatch) => {
    dispatch(addCouponStart());

    let couponData = {
      discount: +coupon.discount,
      volume: +coupon.volume,
      status: 0,
    };
    dispatch(startLoading());
    axios
      .post("/admin/coupons/create.php", JSON.stringify(couponData))
      .then((response) => {
        cb(response.data.id);
      })
      .catch((error) => {
        dispatch(stopLoading());
      });
  };
};

export const deleteCoupon = (couponId) => {
  return (dispatch) => {
    axios
      .post("/coupon/delete.php", JSON.stringify({ id: couponId }))
      .then((response) => {
        dispatch(sendMessage("Couponr Deleted", "success"));
        setTimeout(() => {
          window.location.href = "/dashboard/couponsSummary";
        }, 1000);
      })
      .catch((error) => {
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

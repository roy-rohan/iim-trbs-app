import { default as axios, default as rawAxios } from "../../axios-iim";
import { encodeData } from "../utility";
import { startLoading, stopLoading } from "./common";
import { sendMessage } from "./messenger";

export const getPaymentLink = (token, user, cart, orderId) => {
  return (dispatch) => {
    let paymentInfo = {
      name: user.first_name + " " + user.last_name,
      email: user.email_id,
      mobile: user.mobile_no,
      description: `user_id:${user.app_user_id},order_id:${orderId}`,
      amount: cart.total,
    };

    paymentInfo = encodeData(JSON.stringify(paymentInfo));

    let payLoad = {
      auth_token: "Bearer " + token,
      payment_token: paymentInfo,
    };

    axios
      .post("/payments/initiate_payment.php", JSON.stringify(payLoad))
      .then((response) => {
        window.open(response.data, "_self");
      })
      .catch((error) => {
        dispatch(stopLoading());
        let errorMessage = error.response?.data?.message
          ? error.response?.data?.message
          : "Something went wrong. Please try after sometime.";
        console.log(JSON.stringify(error.response?.data?.message));
        dispatch(sendMessage(errorMessage, "error"));
      });
  };
};

export const createPaymentDetails = (transaction, cb) => {
  return (dispatch) => {
    let payment = {
      transaction_id: transaction.txn_id,
      mode: transaction.mode,
      user_id: transaction.user_id,
      status: transaction.status,
      description: transaction.description,
      order_id: transaction.order_id,
    };
    dispatch(startLoading());
    axios
      .post("/payments/create.php", JSON.stringify(payment))
      .then((response) => {
        dispatch(sendMessage("Payment Details has been recorded.", "success"));
        cb("success");
      })
      .catch((error) => {
        dispatch(sendMessage("Payment Details could not be updated.", "error"));
        cb("error");
      });
  };
};

export const checkPaymentStatus = (transactionId, orderId, userId, emailId) => {
  return (dispatch) => {
    rawAxios
      .get(
        "https://payments.iima.ac.in/online/api/v1/transaction/" +
          transactionId,
        { headers: { Authorization: `Basic dXNlcjp1c2VyQDEyMw==` } }
      )
      .then((response) => {
        let payment = null;
        if (
          (response.data.errorcode === 100) |
          (response.data.errorcode === 101)
        ) {
          // Validate TXN ID
          if (emailId !== response.data.response.payee_email) {
            dispatch(
              sendMessage(
                "Transaction Id is not authorized for current user.",
                "error"
              )
            );
            return;
          }

          let description = response.data.response.payee_description;
          let params = {};
          let orderDetailList = description.split(",");
          for (let orderDetail of orderDetailList) {
            let param = orderDetail.split(":")[0];
            let value = orderDetail.split(":")[1];
            params[param] = value;
          }

          if (orderId !== params["order_id"]) {
            dispatch(
              sendMessage("Transaction and Order did not match.", "error")
            );
            return;
          }

          payment = {
            txn_id: transactionId,
            mode: "online",
            user_id: userId,
            status:
              response.data.response.txn_status.toUpperCase() === "SUCCESS"
                ? 1
                : 0,
            description: response.data.response.payee_description,
            order_id: orderId,
          };
        }
        if (response.data.errorcode === 100) {
          // dispatch(sendMessage("Transaction is successfull.", "success"));
          dispatch(createPaymentDetails(payment, () => {}));
        } else if (response.data.errorcode === 101) {
          dispatch(createPaymentDetails(payment, () => {}));
          dispatch(sendMessage("Transaction has failed.", "error"));
        } else {
          dispatch(sendMessage("Transaction not found.", "error"));
        }
      })
      .catch((error) => {
        // console.log("ERROR IN PAYMENT");
      });
  };
};

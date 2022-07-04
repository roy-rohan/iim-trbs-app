import * as actionTypes from "./actionTypes";

export const sendMessage = (message, messageType) => {
  return {
    type: actionTypes.SEND_MESSAGE,
    message: message,
    messageType: messageType,
  };
};

export const removeMessage = () => {
  return {
    type: actionTypes.REMOVE_MESSAGE,
  };
};

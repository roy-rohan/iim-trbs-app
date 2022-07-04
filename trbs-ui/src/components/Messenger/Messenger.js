import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import * as actions from "../../store/actions";
const Messenger = (props) => {
  let { addToast } = useToasts();

  useEffect(() => {
    if (props.newMessage) {
      addToast(props.message, {
        appearance: props.messageType,
        autoDismiss: true,
        onDismiss: props.onNotificationDismiss,
      });
    }
  }, [props, addToast]);

  return <></>;
};

const mapStateToProps = (state) => {
  return {
    message: state.messenger.message,
    messageType: state.messenger.messageType,
    newMessage: state.messenger.newMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNotificationDismiss: () => dispatch(actions.removeMessage()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);

import CircularProgress from '@material-ui/core/CircularProgress';
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import axios from "../../../axios-iim";
import * as actions from "../../../store/actions/auth";
import classes from "./GoogleSignin.module.css";

function GoogleSignin(props) {
  let { addToast } = useToasts();
  let [loading, setLoading] = useState(false);

   function handleCallBackResponse(response) {
    let userObject = jwt_decode(response.credential);

    let requestBody = {
      first_name: userObject?.given_name,
      last_name: userObject?.family_name,
      email_id: userObject?.email,
      login_id: userObject?.email,
      profile_image_url: userObject?.picture,
      aud: userObject?.aud,
      state_id: 0,
      is_active: 1
    };

    setLoading(true);
    axios
      .post("/users/google_auth_signin.php", JSON.stringify(requestBody))
      .then((res) => {
        props.onLoginHandler(res?.data?.token, () => {
          setLoading(false);
        });
      })
      .catch((error) => {
        let serverMessage = error.response?.data?.message;
        addToast(serverMessage ? serverMessage : error.message, {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 10000,
        });
        setLoading(false);
      })
   }
   
   useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "494817464515-7a2h9o2f3mnjp256koehr077nlg4mlrm.apps.googleusercontent.com",
      callback: handleCallBackResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById(`signInDiv${props.formName}`),
      {theme: "filled_blue", size: "large"}
    )

    google.accounts.id.prompt();
   }, []);

   return (
    <div className={classes.Signin}>
       {loading ? <CircularProgress /> : <div id={`signInDiv${props.formName}`}></div>}
    </div>
   );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginHandler: (token, cb) => dispatch(actions.loginHandlerWithCB(token, cb)),
  };
};

export default connect(null, mapDispatchToProps)(GoogleSignin);
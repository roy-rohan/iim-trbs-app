import { sendMessage } from ".";
import axios from "../../axios-iim";
import * as actionTypes from "./actionTypes";
import { startLoading, stopLoading } from "./common";

export const addCertificateSuccess = (category, certificates) => {
  return {
    type: actionTypes.ADD_CERTIFICATE_SUCCESS,
    certificates: certificates,
    category: category,
  };
};

export const addCertificateFail = (error) => {
  return {
    type: actionTypes.ADD_CERTIFICATE_FAIL,
    error: error,
  };
};

export const addCertificateStart = () => {
  return {
    type: actionTypes.ADD_CERTIFICATE_START,
  };
};

export const fetchCertificateSuccess = (category, certificates) => {
  return {
    type: actionTypes.FETCH_CERTIFICATE_SUCCESS,
    certificates: certificates,
    category: category,
  };
};

export const fetchCertificateFail = (error) => {
  return {
    type: actionTypes.FETCH_CERTIFICATE_FAIL,
    error: error,
  };
};

export const fetchCertificateStart = () => {
  return {
    type: actionTypes.FETCH_CERTIFICATE_START,
  };
};

export const fetchCertificatesByUserId = async (userId) => {
  let fetchedCertificates = [];
  try {
    let response = await axios.get("/certificates/get_certificates_by_user_id.php?id=" + userId);
    for (let key in response.data) {
      fetchedCertificates.push({
        ...response.data[key],
        id: key,
      });
    }
  } catch(exp) {
    sendMessage("Error occured while fetching certificates...", "error");
  }
  return fetchedCertificates;
};

export const fetchUsersByCertificateId = async (certificateId) => {
  let fetchedUsers = [];
  try {
    let response = await axios.get("/certificates/get_users_by_certificate_id.php?id=" + certificateId);
    for (let key in response.data) {
      fetchedUsers.push({
        ...response.data[key],
        id: key,
      });
    }
  } catch(exp) {
    sendMessage("Error occured while fetching users...", "error");
  }
  return fetchedUsers;
};

export const fetchCertificateById = async (certificateId) => {
  let fetchedCertificate = null;
  try {
    let response = await axios.get("/certificates/read_single.php?id=" + certificateId);
    fetchedCertificate = response.data;
  } catch (exp) {
    sendMessage("Error occured while fetching users...", "error");
  }
  return fetchedCertificate;
};

export const sendCertificates = (certificateCtx, cb) => {
  return (dispatch) => {
    dispatch(addCertificateStart());

    let certificateData = {
      category: certificateCtx.category,
      certificate_id: certificateCtx.certificate_id,
      emails: certificateCtx.emails
    };
    dispatch(startLoading());
    axios
      .post("/certificates/send_certificates.php", JSON.stringify(certificateData))
      .then((response) => {
        cb(response);
      })
      .catch((error) => {
        dispatch(stopLoading());
      });
  };
};

export const fetchCertificates = (category, queryCriteria) => {
  return (dispatch) => {
    dispatch(fetchCertificateStart());
    const queryParams = "";
    axios
      .post("/certificates/read.php" + queryParams, queryCriteria)
      .then((res) => {
        const fetchedCertificates = [];
        for (let key in res.data) {
          fetchedCertificates.push({
            ...res.data[key],
            id: key,
          });
        }
        dispatch(fetchCertificateSuccess(category, fetchedCertificates));
      })
      .catch((err) => {
        dispatch(fetchCertificateFail(err));
      });
  };
};

export const addCertificate = (certificate, cb) => {
  return (dispatch) => {
    dispatch(addCertificateStart());

    let certificateData = {
      name: certificate.name,
      content: certificate.content,
      visible: +certificate.visible,
      content_background_color: certificate.content_background_color,
      content_position_absolute: certificate.content_position_absolute,
      content_position_x: +certificate.content_position_x,
      content_position_y: +certificate.content_position_y,
    };
    dispatch(startLoading());
    axios
      .post("/certificates/create.php", JSON.stringify(certificateData))
      .then((response) => {
        cb(response.data.id);
      })
      .catch((error) => {
        dispatch(stopLoading());
      });
  };
};

export const editCertificate = (certificate, cb) => {
  return (dispatch) => {
    dispatch(addCertificateStart());

    let certificateData = {
      certificate_id: certificate.certificate_id,
      name: certificate.name,
      content: certificate.content,
      visible: +certificate.visible,
      content_background_color: certificate.content_background_color,
      content_position_absolute: certificate.content_position_absolute,
      content_position_x: +certificate.content_position_x,
      content_position_y: +certificate.content_position_y,
    };
    console.log("before post");
    dispatch(startLoading());
    axios
      .post("/certificates/update.php", JSON.stringify(certificateData))
      .then((response) => {
        console.log("after post");
        cb();
      })
      .catch((error) => {
        console.log("error post", error);
        dispatch(stopLoading());
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

export const deleteCertificate = (certificateId) => {
  return (dispatch) => {
    axios
      .post("/certificates/delete.php", JSON.stringify({ id: certificateId }))
      .then((response) => {
        dispatch(sendMessage("Certificate Deleted", "success"));
        setTimeout(() => {
          window.location.href = "/dashboard/certificateSummary";
        }, 1000);
      })
      .catch((error) => {
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

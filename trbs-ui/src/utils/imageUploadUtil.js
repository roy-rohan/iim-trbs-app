import axios from "../axios-iim";
import { sendMessage } from "../store/actions";

export const uploadNewImage = (formData, cb) => {
  if (formData.has("image_upload")) {
    axios
      .post("/images/create.php", formData)
      .then((data) => {
        sendMessage("upload success", "success");
        cb();
      })
      .catch((error) => {
        // console.log(error);
      });
  } else {
    cb();
  }
};

export const updateImage = (formData, cb) => {
  axios
    .post("/images/update.php", formData)
    .then((data) => {
      sendMessage("upload success", "success");
      cb();
    })
    .catch((error) => {
      // console.log(error);
    });
};

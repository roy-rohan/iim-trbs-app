import moment from "moment";
import { sendMessage } from ".";
import axios from "../../axios-iim";
import * as actionTypes from "./actionTypes";
import { createSlug, startLoading, stopLoading } from "./common";

export const addSpeakerSuccess = (category, speakers) => {
  return {
    type: actionTypes.ADD_SPEAKER_SUCCESS,
    speakers: speakers,
    category: category,
  };
};

export const addSpeakerFail = (error) => {
  return {
    type: actionTypes.ADD_SPEAKER_FAIL,
    error: error,
  };
};

export const addSpeakerStart = () => {
  return {
    type: actionTypes.ADD_SPEAKER_START,
  };
};

export const fetchSpeakerSuccess = (category, speakers) => {
  return {
    type: actionTypes.FETCH_SPEAKER_SUCCESS,
    speakers: speakers,
    category: category,
  };
};

export const fetchSpeakerFail = (error) => {
  return {
    type: actionTypes.FETCH_SPEAKER_FAIL,
    error: error,
  };
};

export const fetchSpeakerStart = () => {
  return {
    type: actionTypes.FETCH_SPEAKER_START,
  };
};

export const fetchCategoriesSuccess = (categories) => {
  return {
    type: actionTypes.FETCH_SPEAKER_CATEGORIES_SUCCESS,
    categories: categories,
  };
};

export const fetchCategoriesStart = () => {
  return {
    type: actionTypes.FETCH_SPEAKER_CATEGORIES_START,
  };
};

export const fetchCategoriesFail = (error) => {
  return {
    type: actionTypes.FETCH_SPEAKER_CATEGORIES_FAIL,
    error: error,
  };
};

export const fetchSpeakerCategories = () => {
  return (dispatch) => {
    dispatch(fetchCategoriesStart());
    axios
      .get("/speakers/read-category.php")
      .then((res) => {
        const fetchedCategories = [];
        for (let category in res.data) {
          fetchedCategories.push(res.data[category]);
        }
        dispatch(fetchCategoriesSuccess(fetchedCategories));
      })
      .catch((err) => {
        dispatch(fetchCategoriesFail(err));
      });
  };
};

export const fetchSpeakers = (category, queryCriteria) => {
  return (dispatch) => {
    dispatch(fetchSpeakerStart());
    const queryParams = "";
    axios
      .post("/speakers/read.php" + queryParams, queryCriteria)
      .then((res) => {
        const fetchedSpeakers = [];
        for (let key in res.data) {
          fetchedSpeakers.push({
            ...res.data[key],
            id: key,
          });
        }
        dispatch(fetchSpeakerSuccess(category, fetchedSpeakers));
      })
      .catch((err) => {
        dispatch(fetchSpeakerFail(err));
      });
  };
};

export const addSpeaker = (speaker, cb) => {
  return (dispatch) => {
    dispatch(addSpeakerStart());

    let speakerData = {
      name: speaker.name,
      introduction: speaker.introduction,
      slug: createSlug(speaker.slug),
      designation: speaker.designation,
      topic: speaker.topic,
      biography: speaker.biography,
      duration: speaker.duration,
      date: moment(speaker.date).format("YYYY-MM-DD"),
      time: moment(speaker.time).format("YYYY-MM-DD HH:mm:ss"),
      registration: speaker.registration,
      venue: speaker.venue,
      view_order: +speaker.view_order ? +speaker.view_order : 0,
      price: speaker.price,
      visible: +speaker.visible,
      is_active: true,
      show_in_home_page: speaker.show_in_home_page,
    };
    dispatch(startLoading());
    axios
      .post("/speakers/create.php", JSON.stringify(speakerData))
      .then((response) => {
        cb(response.data.id);
      })
      .catch((error) => {
        dispatch(stopLoading());
      });
  };
};

export const editSpeaker = (speaker, cb) => {
  return (dispatch) => {
    dispatch(addSpeakerStart());

    let speakerData = {
      speaker_id: speaker.speaker_id,
      name: speaker.name,
      introduction: speaker.introduction,
      slug: createSlug(speaker.slug),
      designation: speaker.designation,
      topic: speaker.topic,
      biography: speaker.biography,
      duration: speaker.duration,
      date: moment(speaker.date).format("YYYY-MM-DD"),
      time: moment(speaker.time).format("YYYY-MM-DD HH:mm:ss"),
      registration: speaker.registration,
      venue: speaker.venue,
      view_order: +speaker.view_order ? +speaker.view_order : 0,
      price: speaker.price,
      visible: +speaker.visible,
      is_active: true,
      show_in_home_page: speaker.show_in_home_page,
    };
    dispatch(startLoading());
    axios
      .post("/speakers/update.php", JSON.stringify(speakerData))
      .then((response) => {
        cb();
      })
      .catch((error) => {
        dispatch(stopLoading());
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

export const deleteSpeaker = (speakerId) => {
  return (dispatch) => {
    axios
      .post("/speakers/delete.php", JSON.stringify({ id: speakerId }))
      .then((response) => {
        dispatch(sendMessage("Speaker Deleted", "success"));
        setTimeout(() => {
          window.location.href = "/dashboard/speakerSummary";
        }, 1000);
      })
      .catch((error) => {
        dispatch(sendMessage("Something went wrong", "error"));
      });
  };
};

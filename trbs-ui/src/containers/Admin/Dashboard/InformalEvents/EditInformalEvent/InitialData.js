import moment from "moment";

export const informalEventTypes = [
  "Flagship",
  "International",
  "Conclave",
  "On-Site",
];
export const initalValues = {
  image_upload: {
    value: null,
    error: false,
    errorMessage: "",
    touched: false,
  },
  title: {
    value: "Workshop Title 5",
    error: false,
    errorMessage: "",
    required: true,
    touched: false,
  },
  slug: {
    value: "",
    error: false,
    errorMessage: "",
    required: true,
    touched: false,
  },
  type: {
    value: informalEventTypes[0],
    error: false,
    errorMessage: "",
    required: true,
    touched: false,
  },
  new_type: {
    value: "",
    error: false,
    errorMessage: "",
    touched: false,
  },
  image_id: {
    value: "",
    error: false,
    errorMessage: "",
    touched: false,
  },
  short_description: {
    value: "",
    error: false,
    errorMessage: "",
    touched: false,
  },
  full_description: {
    value: "",
    error: false,
    errorMessage: "",
    touched: false,
  },
  faq: {
    value: "",
    error: false,
    errorMessage: "",
    touched: false,
  },
  background_info: {
    value: "",
    error: false,
    errorMessage: "",
    touched: false,
  },
  event_time: {
    value: moment(),
    error: false,
    errorMessage: "",
    touched: false,
  },
  event_date: {
    value: moment(),
    error: false,
    errorMessage: "",
    touched: false,
  },
  event_end_date: {
    value: moment(),
    error: false,
    errorMessage: "",
    touched: false,
  },
  event_end_time: {
    value: moment(),
    error: false,
    errorMessage: "",
    touched: false,
  },
  terms_condition: {
    value: "",
    error: false,
    errorMessage: "",
    touched: false,
  },
  contact: {
    value: "",
    error: false,
    errorMessage: "",
    touched: false,
  },
  view_order: {
    value: "",
    error: false,
    errorMessage: "",
    touched: false,
  },
  organizer: {
    value: "",
    error: false,
    errorMessage: "",
    touched: false,
  },
  duration: {
    value: "",
    error: false,
    errorMessage: "",
    touched: false,
  },
  venue: {
    value: "",
    error: false,
    errorMessage: "",
    touched: false,
  },
  is_active: {
    value: "",
    error: false,
    errorMessage: "",
    touched: false,
  },
  show_in_home_page: {
    value: 0,
    error: false,
    errorMessage: "",
    touched: false,
  },
  conclave: {
    value: "",
    error: false,
    errorMessage: "",
    touched: false,
  },
  price: {
    value: 0,
    error: false,
    errorMessage: "",
    touched: false,
  },
  image_url: {
    value: 0,
    error: false,
    errorMessage: "",
    touched: false,
  },
  timeline_image_url: {
    value: 0,
    error: false,
    errorMessage: "",
    touched: false,
  },
  informal_event_id: {
    value: 0,
    error: false,
    errorMessage: "",
    touched: false,
  },
  visible: {
    value: 0,
    error: false,
    errorMessage: "",
    touched: false,
  },
};

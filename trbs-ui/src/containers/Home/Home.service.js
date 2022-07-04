import axios from "../../axios-iim";

export const fetchTopEvents = async () => {
  const response = await axios.post(
    "/events/read.php",
    JSON.stringify({
      filters: [
        {
          field_name: "show_in_home_page",
          value: 1,
          op: "=",
        },
      ],
      filterOp: "",
      sort: [
        {
          field_name: "view_order",
          op: "ASC",
        },
      ],
    })
  );

  return response;
};

export const fetchTopWorkshops = async () => {
  const response = await axios.post(
    "/workshops/read.php",
    JSON.stringify({
      filters: [
        {
          field_name: "show_in_home_page",
          value: 1,
          op: "=",
        },
      ],
      filterOp: "",
      sort: [
        {
          field_name: "view_order",
          op: "ASC",
        },
      ],
    })
  );

  return response;
};

export const fetchTopSpeakers = async () => {
  const response = await axios.post(
    "/speakers/read.php",
    JSON.stringify({
      filters: [
        {
          field_name: "show_in_home_page",
          value: 1,
          op: "=",
        },
      ],
      filterOp: "",
      sort: [
        {
          field_name: "view_order",
          op: "ASC",
        },
      ],
    })
  );

  return response;
};

export const fetchTopConnexions = async () => {
  const response = await axios.post(
    "/connexions/read.php",
    JSON.stringify({
      filters: [
        {
          field_name: "show_in_home_page",
          value: 1,
          op: "=",
        },
      ],
      filterOp: "",
      sort: [
        {
          field_name: "view_order",
          op: "ASC",
        },
      ],
    })
  );

  return response;
};

export const fetchHomePageContent = async () => {
  const response = await axios.post(
    "/content/home-page/read-single.php",
    JSON.stringify({})
  );

  return response;
};

export const fetchHomePageSliderImages = async () => {
  const response = await axios.post(
    "/images/read.php",
    JSON.stringify({
      filters: [
        {
          field_name: "entity_type",
          value: "slider",
          op: "=",
        },
      ],
      filter_op: "AND",
      sort: [
        {
          field_name: "entity_id",
          op: "DESC",
        },
      ],
    })
  );

  return response;
};
